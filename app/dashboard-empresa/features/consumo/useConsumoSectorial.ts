import { useState, useEffect, useCallback } from "react";
import {
  reportesService,
  IProgressCallback,
} from "@/lib/api/services/reportesService";
import { toast } from "@/components/ui/use-toast";
import {
  DatoSector,
  EstadoExportacion,
  TipoExportacion,
  ConfiguracionExportacion,
  DatoBase,
} from "./types";
import {
  SECTORES_BASE,
  AREAS_BASE,
  FRANJAS_BASE,
  SECTOR_COLORS,
  AREA_COLORS,
  HORARIO_COLORS,
} from "./config";
import { estadisticasService } from "@/lib/api/services/estadisticasService";

export function useConsumoSectorial() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("nov-2023");
  const [loading, setLoading] = useState(false);
  const [datosSectores, setDatosSectores] = useState<DatoSector[]>([]);
  const [datosAreas, setDatosAreas] = useState<DatoSector[]>([]);
  const [datosFranjasHorarias, setDatosFranjasHorarias] = useState<
    DatoSector[]
  >([]);

  const [estadoExportacion, setEstadoExportacion] = useState<EstadoExportacion>(
    {
      estado: "idle",
      progreso: { step: "", percentage: 0, message: "" },
      mostrarModal: false,
    }
  );

  const [tipoExportacionActual, setTipoExportacionActual] =
    useState<TipoExportacion>("equipamiento");

  // Función para generar datos con variación realista
  const generarDatos = (datos: DatoBase[], colores: string[]): DatoSector[] => {
    const total = datos.reduce((sum, item) => sum + item.base, 0);
    return datos.map((item, index) => {
      const variacion = (Math.random() - 0.5) * 2 * item.variacion;
      const consumo = Math.floor(item.base * (1 + variacion));
      const porcentaje = Math.round((consumo / total) * 100);
      return {
        nombre: item.nombre,
        consumo,
        porcentaje,
        costo: Math.floor(consumo * (30 + Math.random() * 10)), // Costo por kWh variable
        tendencia: (Math.random() - 0.5) * 20, // Tendencia en %
        color: colores[index % colores.length],
      };
    });
  };

  // Cargar datos simulados con variación
  const cargarDatos = useCallback(async (periodo: string) => {
    setLoading(true);
    try {
      const empresaId = "1"; // TODO: obtener del contexto de usuario
      const response = await estadisticasService.obtenerConsumoSectorial(
        empresaId,
        { periodo }
      );

      if (response.success && response.data) {
        const { equipamiento, area, horario } = response.data;
        setDatosSectores(equipamiento || []);
        setDatosAreas(area || []);
        setDatosFranjasHorarias(horario || []);
      } else {
        // Fallback a simulación
        setDatosSectores(generarDatos(SECTORES_BASE, SECTOR_COLORS));
        setDatosAreas(generarDatos(AREAS_BASE, AREA_COLORS));
        setDatosFranjasHorarias(generarDatos(FRANJAS_BASE, HORARIO_COLORS));
      }
    } catch (error) {
      console.error("Error cargando datos de consumo sectorial:", error);
      toast({
        title: "❌ Error de Carga",
        description: "No se pudieron cargar los datos de consumo sectorial.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para cargar datos cuando cambia el período
  useEffect(() => {
    cargarDatos(periodoSeleccionado);
  }, [periodoSeleccionado, cargarDatos]);

  // Manejar exportación de reportes
  const handleExportarConsumoSectorial = async (
    subtipo: TipoExportacion,
    formato: "excel" | "csv" | "pdf" = "excel"
  ) => {
    try {
      setTipoExportacionActual(subtipo);
      setEstadoExportacion({
        estado: "generando",
        progreso: {
          step: "init",
          percentage: 0,
          message: "Iniciando exportación...",
        },
        mostrarModal: true,
      });

      const config: ConfiguracionExportacion = {
        formato,
        filtros: {
          periodo: periodoSeleccionado,
          subtipo,
        },
        titulo: `Consumo Sectorial por ${subtipo.charAt(0).toUpperCase() + subtipo.slice(1)}`,
      };

      // Usar el método específico para PDF si corresponde
      if (formato === "pdf") {
        await reportesService.descargarReporteConsumoSectorialPDF(
          subtipo,
          config,
          (progreso: { step: string; percentage: number; message: string }) => {
            setEstadoExportacion((prev) => ({
              ...prev,
              estado: "descargando",
              progreso,
            }));
          }
        );
      } else {
        await reportesService.descargarReporteConsumoSectorial(
          subtipo,
          config,
          (progreso: { step: string; percentage: number; message: string }) => {
            setEstadoExportacion((prev) => ({
              ...prev,
              estado: "descargando",
              progreso,
            }));
          }
        );
      }

      setEstadoExportacion((prev) => ({
        ...prev,
        estado: "completado",
        progreso: {
          step: "complete",
          percentage: 100,
          message: `Consumo sectorial exportado exitosamente en formato ${formato.toUpperCase()}`,
        },
      }));

      toast({
        title: "✅ Exportación Exitosa",
        description: `El consumo sectorial por ${subtipo} ha sido descargado correctamente en formato ${formato.toUpperCase()}.`,
      });

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setEstadoExportacion((prev) => ({ ...prev, mostrarModal: false }));
      }, 2000);
    } catch (error) {
      console.error("Error exportando consumo sectorial:", error);
      setEstadoExportacion({
        estado: "error",
        progreso: {
          step: "error",
          percentage: 0,
          message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
        },
        mostrarModal: true,
      });

      toast({
        title: "❌ Error en Exportación",
        description:
          "No se pudo exportar el consumo sectorial. Inténtalo nuevamente.",
        variant: "destructive",
      });
    }
  };

  // Cerrar modal de exportación
  const cerrarModalExportacion = () => {
    setEstadoExportacion((prev) => ({ ...prev, mostrarModal: false }));
  };

  // Refrescar datos
  const refrescarDatos = () => {
    cargarDatos(periodoSeleccionado);
  };

  return {
    // Estados
    periodoSeleccionado,
    loading,
    datosSectores,
    datosAreas,
    datosFranjasHorarias,
    estadoExportacion,
    tipoExportacionActual,

    // Acciones
    setPeriodoSeleccionado,
    handleExportarConsumoSectorial,
    cerrarModalExportacion,
    refrescarDatos,
    cargarDatos,
  };
}
