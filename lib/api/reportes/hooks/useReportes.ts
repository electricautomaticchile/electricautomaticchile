"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IConfigReporte, IProgressCallback, IProgressState } from "../types";
import { clientesReportService } from "../services/clientesReportService";
import { empresasReportService } from "../services/empresasReportService";
import { cotizacionesReportService } from "../services/cotizacionesReportService";
import { CSVUtils } from "../utils/csvUtils";
import { DEFAULT_COLUMNS } from "../config";

// Hook principal para manejo de reportes
export function useReportes() {
  const [progress, setProgress] = useState<IProgressState | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Callback para actualizar progreso
  const onProgress: IProgressCallback = useCallback(
    (progressData) => {
      setProgress({
        step: progressData.step as any,
        percentage: progressData.percentage,
        message: progressData.message,
        startTime: progress?.startTime || new Date(),
        currentOperation: progressData.message,
      });
    },
    [progress?.startTime]
  );

  // Mutation para generar reportes
  const generarReporteMutation = useMutation({
    mutationFn: async (config: IConfigReporte) => {
      setIsGenerating(true);
      setProgress({
        step: "init",
        percentage: 0,
        message: "Iniciando generación...",
        startTime: new Date(),
      });

      try {
        // Seleccionar servicio según tipo
        let service;
        switch (config.tipo) {
          case "clientes":
            service = clientesReportService;
            break;
          case "empresas":
            service = empresasReportService;
            break;
          case "cotizaciones":
            service = cotizacionesReportService;
            break;
          default:
            throw new Error(`Tipo de reporte no soportado: ${config.tipo}`);
        }

        // Generar reporte
        await service.generarReporte(config, onProgress);

        return { success: true };
      } finally {
        setIsGenerating(false);
      }
    },
    onError: (error) => {
      setIsGenerating(false);
      setProgress({
        step: "error",
        percentage: 0,
        message: error instanceof Error ? error.message : "Error desconocido",
        startTime: progress?.startTime || new Date(),
      });
    },
    onSuccess: () => {
      setProgress({
        step: "complete",
        percentage: 100,
        message: "Reporte generado exitosamente",
        startTime: progress?.startTime || new Date(),
      });
    },
  });

  // Función para limpiar estado
  const limpiarEstado = useCallback(() => {
    setProgress(null);
    setIsGenerating(false);
  }, []);

  // Función para cancelar reporte (si es posible)
  const cancelarReporte = useCallback(() => {
    // Por ahora solo limpiamos el estado local
    // En el futuro se podría implementar cancelación real
    limpiarEstado();
  }, [limpiarEstado]);

  return {
    // Estado
    isGenerating,
    progress,
    error: generarReporteMutation.error?.message || null,
    isSuccess: generarReporteMutation.isSuccess,

    // Acciones
    generarReporte: generarReporteMutation.mutate,
    cancelarReporte,
    limpiarEstado,

    // Estados de la mutation
    isPending: generarReporteMutation.isPending,
    isError: generarReporteMutation.isError,
  };
}

// Hook para exportación CSV local
export function useExportacionCSV() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportarCSV = useCallback(
    async (
      datos: any[],
      tipo: "clientes" | "empresas" | "cotizaciones",
      nombreArchivo?: string
    ) => {
      try {
        setIsExporting(true);
        setError(null);

        // Obtener columnas según tipo
        const columnas = DEFAULT_COLUMNS[tipo] || DEFAULT_COLUMNS.clientes;

        // Validar datos
        const validacion = CSVUtils.validarDatos(datos, columnas);
        if (!validacion.valid) {
          throw new Error(
            `Error de validación: ${validacion.errors.join(", ")}`
          );
        }

        // Generar nombre de archivo
        const nombreFinal = nombreArchivo || `exportacion_${tipo}`;

        // Exportar
        CSVUtils.exportarCSVLocal(datos, columnas, nombreFinal);

        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        throw err;
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return {
    exportarCSV,
    isExporting,
    error,
    limpiarError: () => setError(null),
  };
}

// Hook para obtener vista previa de reportes
export function useVistaPrevia() {
  return useQuery({
    queryKey: ["reportes", "vista-previa"],
    queryFn: async ({ queryKey }) => {
      // Esto sería implementado según necesidades específicas
      return null;
    },
    enabled: false, // Solo ejecutar manualmente
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para estadísticas de reportes
export function useEstadisticasReportes(empresaId?: string) {
  return useQuery({
    queryKey: ["reportes", "estadisticas", empresaId],
    queryFn: async () => {
      if (empresaId) {
        return await clientesReportService.obtenerEstadisticasClientes(
          empresaId
        );
      }
      // Estadísticas generales
      return {
        total: 0,
        activos: 0,
        inactivos: 0,
        porTipo: {},
        porCiudad: {},
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    enabled: !!empresaId,
  });
}

// Hook para validar permisos de reportes
export function useValidacionPermisos() {
  const validarPermisosMutation = useMutation({
    mutationFn: async (config: IConfigReporte) => {
      let service;
      switch (config.tipo) {
        case "clientes":
          service = clientesReportService;
          break;
        case "empresas":
          service = empresasReportService;
          break;
        case "cotizaciones":
          service = cotizacionesReportService;
          break;
        default:
          throw new Error("Tipo de reporte no válido");
      }

      // Validar permisos si el servicio lo soporta
      if (
        "validarPermisos" in service &&
        typeof service.validarPermisos === "function"
      ) {
        return await (service as any).validarPermisos(config);
      }

      return { valid: true };
    },
  });

  return {
    validarPermisos: validarPermisosMutation.mutate,
    isValidating: validarPermisosMutation.isPending,
    validationResult: validarPermisosMutation.data,
    validationError: validarPermisosMutation.error,
  };
}

// Hook principal que combina todas las funcionalidades
export function useReportesCompleto() {
  const reportes = useReportes();
  const exportacionCSV = useExportacionCSV();
  const validacionPermisos = useValidacionPermisos();
  const vistaPrevia = useVistaPrevia();

  return {
    // Reportes
    ...reportes,

    // Exportación CSV
    exportarCSV: exportacionCSV.exportarCSV,
    isExportingCSV: exportacionCSV.isExporting,
    csvError: exportacionCSV.error,
    limpiarCSVError: exportacionCSV.limpiarError,

    // Validación de permisos
    validarPermisos: validacionPermisos.validarPermisos,
    isValidatingPermisos: validacionPermisos.isValidating,
    permisosResult: validacionPermisos.validationResult,
    permisosError: validacionPermisos.validationError,

    // Vista previa
    vistaPrevia: vistaPrevia.data,
    isLoadingVistaPrevia: vistaPrevia.isLoading,
    refetchVistaPrevia: vistaPrevia.refetch,
  };
}
