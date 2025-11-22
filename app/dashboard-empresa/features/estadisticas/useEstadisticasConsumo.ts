import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useUserId, useIsAuthenticated } from "@/lib/store/useAppStore";
import { estadisticasService } from "@/lib/api/services/estadisticasService";
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

  // Obtener usuario autenticado usando selectores primitivos optimizados
  const userId = useUserId();
  const isAuthenticated = useIsAuthenticated();

  // Log de debugging para verificar inicialización
  console.log("useEstadisticasConsumo: estado inicializado", {
    loading,
    resumenEstadisticasDefined: !!resumenEstadisticas,
    resumenEstadisticasConsumoMensual: resumenEstadisticas?.consumoMensual,
    userId,
    isAuthenticated,
  });

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
      console.log("useEstadisticasConsumo: iniciando carga de datos", {
        periodo,
        userId,
      });
      setLoading(true);

      if (!isAuthenticated || !userId) {
        console.warn(
          "useEstadisticasConsumo: Usuario no autenticado, usando datos simulados"
        );
        const datosSimulados = generarDatosConsumo(periodo as TipoExportacion);
        setDatosConsumo(datosSimulados);
        setResumenEstadisticas(ESTADISTICAS_RESUMEN_DEFAULT);
        setLoading(false);
        return;
      }

      const clienteId = userId; // ✅ USAR ID DEL USUARIO AUTENTICADO
      const response =
        await estadisticasService.obtenerEstadisticasConsumoCliente(clienteId, {
          periodo: periodo as any,
        });

      if (response.success && response.data) {
        const responseData = response.data as any;

        // Validar que los datos tengan la estructura esperada
        const datos = Array.isArray(responseData.datos)
          ? responseData.datos as DatoConsumo[]
          : [];

        const resumen = responseData.resumen && typeof responseData.resumen === 'object'
          ? responseData.resumen as EstadisticasResumen
          : ESTADISTICAS_RESUMEN_DEFAULT;

        console.log("useEstadisticasConsumo: datos cargados desde API", {
          success: response.success,
          datosLength: datos.length,
          resumenDefined: !!resumen,
          timestamp: new Date().toISOString()
        });

        setDatosConsumo(datos);
        setResumenEstadisticas(resumen);
      } else {
        console.warn("useEstadisticasConsumo: API no devolvió datos válidos, usando simulación", {
          success: response.success,
          hasData: !!response.data
        });
        const datosSimulados = generarDatosConsumo(periodo as TipoExportacion);
        setDatosConsumo(datosSimulados);
        setResumenEstadisticas(ESTADISTICAS_RESUMEN_DEFAULT);
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);

      // Usar datos simulados en caso de error
      const datosSimulados = generarDatosConsumo(periodo as TipoExportacion);
      setDatosConsumo(datosSimulados);
      setResumenEstadisticas(ESTADISTICAS_RESUMEN_DEFAULT);

      toast({
        title: "❌ Error de Carga",
        description: "No se pudieron cargar las estadísticas de consumo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, isAuthenticated]);

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

        // Usar el método específico para PDF si corresponde
        if (formato === "pdf") {
          await reportesService.descargarReporteEstadisticasPDF(
            tipo,
            config,
            (progreso: {
              step: string;
              percentage: number;
              message: string;
            }) => {
              setEstadoExportacion((prev) => ({
                ...prev,
                estado: "descargando",
                progreso,
              }));
            }
          );
        } else {
          await reportesService.descargarReporteEstadisticas(
            tipo,
            config,
            (progreso: {
              step: string;
              percentage: number;
              message: string;
            }) => {
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
            message: `Estadísticas exportadas exitosamente en formato ${formato.toUpperCase()}`,
          },
        }));

        toast({
          title: "✅ Exportación Exitosa",
          description: `Las estadísticas ${tipo} han sido descargadas correctamente en formato ${formato.toUpperCase()}.`,
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
