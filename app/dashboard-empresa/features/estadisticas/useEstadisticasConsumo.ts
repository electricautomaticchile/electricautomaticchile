import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/api/apiService";
import { reportesService } from "@/lib/api/services/reportesService";
import {
  DatoConsumo,
  EstadisticasResumen,
  EstadoExportacion,
  TipoExportacion,
  FormatoExportacion,
} from "./types";
import {
  generarDatosConsumo,
  ESTADISTICAS_RESUMEN_DEFAULT,
  CONFIG_ACTUALIZACION,
  MENSAJES,
} from "./config";

export function useEstadisticasConsumo() {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("nov-2023");
  const [datosConsumo, setDatosConsumo] = useState<DatoConsumo[]>([]);
  const [resumenEstadisticas, setResumenEstadisticas] =
    useState<EstadisticasResumen>(ESTADISTICAS_RESUMEN_DEFAULT);

  const [estadoExportacion, setEstadoExportacion] = useState<EstadoExportacion>(
    {
      estado: "idle",
      progreso: { step: "", percentage: 0, message: "" },
      mostrarModal: false,
    }
  );

  const [tipoExportacionActual, setTipoExportacionActual] =
    useState<TipoExportacion>("mensual");

  // Cargar datos de consumo
  const cargarDatos = useCallback(async (periodo: string) => {
    try {
      setLoading(true);

      // Simular delay de carga
      await new Promise((resolve) => setTimeout(resolve, 800));

      const datosSimulados = generarDatosConsumo(periodo as TipoExportacion);
      setDatosConsumo(datosSimulados);

      // Actualizar estadísticas con algo de variación aleatoria
      setResumenEstadisticas((prev) => ({
        ...prev,
        consumoMensual: Math.floor(Math.random() * 500) + 4300,
        variacionMensual: (Math.random() - 0.5) * 10,
        eficienciaEnergetica: Math.floor(Math.random() * 10) + 85,
        costoMensual: Math.floor(Math.random() * 20000) + 150000,
        pico: {
          ...prev.pico,
          valor: Math.floor(Math.random() * 50) + 200,
        },
      }));
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
      toast({
        title: "❌ Error de Carga",
        description: "No se pudieron cargar las estadísticas de consumo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Manejar exportación de estadísticas
  const handleExportarEstadisticas = useCallback(
    async (tipo: TipoExportacion, formato: FormatoExportacion = "excel") => {
      try {
        setTipoExportacionActual(tipo);
        setEstadoExportacion({
          estado: "generando",
          progreso: {
            step: "init",
            percentage: 0,
            message: "Iniciando exportación...",
          },
          mostrarModal: true,
        });

        const config = {
          formato,
          filtros: {
            periodo: periodoSeleccionado,
            subtipo: tipo,
            incluirCostos: true,
            incluirEficiencia: true,
          },
          titulo: `Estadísticas de Consumo ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
          incluirGraficos: true,
          incluirResumen: true,
        };

        await reportesService.descargarReporteEstadisticas(
          tipo,
          config,
          (progreso: { step: string; percentage: number; message: string }) => {
            setEstadoExportacion((prev) => ({
              ...prev,
              estado: "descargando",
              progreso,
            }));
          }
        );

        setEstadoExportacion((prev) => ({
          ...prev,
          estado: "completado",
          progreso: {
            step: "complete",
            percentage: 100,
            message: "Estadísticas exportadas exitosamente",
          },
        }));

        toast({
          title: "✅ Exportación Exitosa",
          description: `Las estadísticas ${tipo} han sido descargadas correctamente.`,
        });

        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          setEstadoExportacion((prev) => ({ ...prev, mostrarModal: false }));
        }, 2000);
      } catch (error) {
        console.error("Error exportando estadísticas:", error);
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
            "No se pudieron exportar las estadísticas. Inténtalo nuevamente.",
          variant: "destructive",
        });
      }
    },
    [periodoSeleccionado]
  );

  // Cerrar modal de exportación
  const cerrarModalExportacion = () => {
    setEstadoExportacion((prev) => ({ ...prev, mostrarModal: false }));
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    cargarDatos(periodoSeleccionado);
  }, [periodoSeleccionado, cargarDatos]);

  // Efecto para actualizaciones automáticas (opcional)
  useEffect(() => {
    if (!CONFIG_ACTUALIZACION.habilitada) return;

    const interval = setInterval(() => {
      cargarDatos(periodoSeleccionado);
    }, CONFIG_ACTUALIZACION.intervalo);

    return () => clearInterval(interval);
  }, [periodoSeleccionado, cargarDatos]);

  return {
    // Estados
    loading,
    periodoSeleccionado,
    datosConsumo,
    resumenEstadisticas,
    estadoExportacion,
    tipoExportacionActual,

    // Acciones
    setPeriodoSeleccionado,
    handleExportarEstadisticas,
    cerrarModalExportacion,

    // Métodos utilitarios
    refrescarDatos: () => cargarDatos(periodoSeleccionado),
  };
}
