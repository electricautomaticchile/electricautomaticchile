// Importar servicios modularizados
import {
  clientesReportService,
  empresasReportService,
  cotizacionesReportService,
} from "../reportes/services";

import { apiService } from "../apiService";

// Re-exportar tipos e interfaces desde el sistema modular
export type {
  IFiltrosReporte,
  IConfigReporte,
  IProgressCallback,
} from "../reportes/types";

// Interfaces adicionales para compatibilidad
export interface IReporteGenerado {
  _id: string;
  tipo: "clientes" | "empresas" | "cotizaciones" | "dispositivos";
  formato: "excel" | "csv";
  fechaGeneracion: Date;
  usuarioId: string;
  usuarioTipo: "empresa" | "superusuario" | "cliente";
  empresaId?: string;
  filtros: any;
  estadisticas: {
    totalRegistros: number;
    tamañoArchivo: number;
    tiempoGeneracion: number;
    filtrosAplicados: number;
  };
  estado: "generando" | "completado" | "error" | "expirado";
  metadatos: {
    ipAddress?: string;
    userAgent?: string;
    nombreArchivo: string;
    tipoMime: string;
  };
  error?: {
    mensaje: string;
    codigo: string;
    timestamp: Date;
  };
  expiresAt: Date;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface IEstadisticasReportes {
  general: {
    totalReportes: number;
    reportesExitosos: number;
    reportesError: number;
    tamañoTotalMB: number;
    tiempoPromedioMs: number;
    registrosTotales: number;
  };
  tendencias: Array<{
    _id: {
      fecha: string;
      tipo: string;
      formato: string;
    };
    cantidad: number;
    tamañoPromedio: number;
  }>;
  porTipo: Array<{
    _id: {
      tipo: string;
      formato: string;
    };
    cantidad: number;
    exitosos: number;
    errores: number;
    tamañoPromedio: number;
    tiempoPromedio: number;
  }>;
  periodo: {
    desde: Date;
    hasta: Date;
    dias: number;
  };
}

import { DownloadUtils } from "../reportes/utils/downloadUtils";

// TODO: Refactorizar este servicio para que use baseService y maneje la autenticación correctamente.
// Las siguientes líneas están comentadas temporalmente debido a problemas con la importación de tipos.

// class ReportesService {
//   async generarReporte(
//     params: any // GenerarReporteParams
//   ): Promise<any> { // ApiResponse<Reporte>
//     return baseService.post<any>("/reportes/generar", params);
//   }

//   async getEstadoReporte(id: string): Promise<any> { // ApiResponse<EstadoReporte>
//     return baseService.get<any>(`/reportes/${id}/estado`);
//   }

//   async getReportesGenerados(
//     tipoReporte?: string
//   ): Promise<any> { // ApiResponse<Reporte[]>
//     const endpoint = tipoReporte
//       ? `/reportes?tipo=${tipoReporte}`
//       : "/reportes";
//     return baseService.get<any[]>(endpoint);
//   }
// }
// export const reportesService = new ReportesService();

/**
 * Servicio principal de reportes - Wrapper refactorizado
 * Mantiene compatibilidad hacia atrás usando servicios modularizados
 */
class ReportesService {
  /**
   * Descargar reporte de clientes - Delegado al servicio especializado
   */
  async descargarReporteClientes(config: any, onProgress?: any): Promise<void> {
    return await clientesReportService.generarReporte(config, onProgress);
  }

  /**
   * Descargar reporte de empresas - Delegado al servicio especializado
   */
  async descargarReporteEmpresas(config: any, onProgress?: any): Promise<void> {
    return await empresasReportService.generarReporte(config, onProgress);
  }

  /**
   * Descargar reporte de cotizaciones - Delegado al servicio especializado
   */
  async descargarReporteCotizaciones(
    config: any,
    onProgress?: any
  ): Promise<void> {
    return await cotizacionesReportService.generarReporte(config, onProgress);
  }

  /**
   * Exportar datos locales a CSV - Usar utilidad desde el sistema modular
   */
  exportarCSVLocal(datos: any[], columnas: any[], nombreArchivo: string): void {
    // Importar utilidad CSV desde el sistema modular
    const { CSVUtils } = require("../reportes/utils/csvUtils");
    return CSVUtils.exportarCSV(datos, columnas, nombreArchivo);
  }

  /**
   * Generar reporte completo con configuración avanzada
   */
  async generarReporteCompleto(config: any, onProgress?: any): Promise<void> {
    try {
      switch (config.tipo) {
        case "clientes":
          await this.descargarReporteClientes(config, onProgress);
          break;
        case "empresas":
          await this.descargarReporteEmpresas(config, onProgress);
          break;
        case "cotizaciones":
          await this.descargarReporteCotizaciones(config, onProgress);
          break;
        default:
          throw new Error(`Tipo de reporte no soportado: ${config.tipo}`);
      }
    } catch (error) {
      console.error("❌ Error generando reporte completo:", error);
      throw error;
    }
  }

  /**
   * Obtener historial de reportes del usuario
   */
  async obtenerHistorialReportes(
    page: number = 1,
    limit: number = 10,
    filtros?: {
      tipo?: string;
      formato?: string;
      estado?: string;
    }
  ): Promise<{
    success: boolean;
    data?: {
      reportes: IReporteGenerado[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
    error?: string;
  }> {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (filtros?.tipo) params.append("tipo", filtros.tipo);
      if (filtros?.formato) params.append("formato", filtros.formato);
      if (filtros?.estado) params.append("estado", filtros.estado);

      const response = await this.makeRequest<{
        reportes: IReporteGenerado[];
        pagination: any;
      }>(`/reportes/historial?${params.toString()}`);

      return response;
    } catch (error) {
      console.error("❌ Error obteniendo historial de reportes:", error);
      return {
        success: false,
        error: "Error al obtener historial de reportes",
      };
    }
  }

  /**
   * Obtener estadísticas de reportes
   */
  async obtenerEstadisticasReportes(diasAtras: number = 30): Promise<{
    success: boolean;
    data?: IEstadisticasReportes;
    error?: string;
  }> {
    try {
      const response = await this.makeRequest<IEstadisticasReportes>(
        `/reportes/estadisticas?diasAtras=${diasAtras}`
      );
      return response;
    } catch (error) {
      console.error("❌ Error obteniendo estadísticas de reportes:", error);
      return {
        success: false,
        error: "Error al obtener estadísticas de reportes",
      };
    }
  }

  /**
   * Método privado para hacer requests al API
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{
    success: boolean;
    data?: T;
    error?: string;
  }> {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api${endpoint}`,
        {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("❌ Error en makeRequest:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  /**
   * Generar vista previa del reporte
   */
  generarVistaPrevia(config: any): string {
    try {
      let vistaPrevia: any;

      switch (config.tipo) {
        case "clientes":
          vistaPrevia = clientesReportService.generarVistaPrevia(config);
          break;
        case "empresas":
          vistaPrevia = empresasReportService.generarVistaPrevia(config);
          break;
        case "cotizaciones":
          vistaPrevia = cotizacionesReportService.generarVistaPrevia(config);
          break;
        default:
          return "Vista previa no disponible para este tipo de reporte.";
      }

      // Convertir objeto a string para compatibilidad
      if (typeof vistaPrevia === "object") {
        return `📋 **${vistaPrevia.titulo}**\n\n${vistaPrevia.descripcion}\n\n**Registros estimados:** ${vistaPrevia.registrosEstimados}\n**Tamaño estimado:** ${vistaPrevia.tamañoEstimado}\n**Tiempo estimado:** ${vistaPrevia.tiempoEstimado}`;
      }

      return vistaPrevia;
    } catch (error) {
      console.error("Error generando vista previa:", error);
      return "Error al generar vista previa del reporte.";
    }
  }

  /**
   * Estimar tiempo de generación
   */
  estimarTiempoGeneracion(config: any): string {
    try {
      let estimacion: any;

      switch (config.tipo) {
        case "clientes":
          estimacion = clientesReportService.estimarTiempo(config);
          break;
        case "empresas":
          estimacion = empresasReportService.estimarTiempo(config);
          break;
        case "cotizaciones":
          estimacion = cotizacionesReportService.estimarTiempo(config);
          break;
        default:
          return "No se puede estimar el tiempo para este tipo de reporte.";
      }

      return `${Math.round(estimacion.tiempoEstimado / 1000)} segundos`;
    } catch (error) {
      console.error("Error estimando tiempo:", error);
      return "No se puede estimar el tiempo.";
    }
  }

  /**
   * Métodos legacy para compatibilidad hacia atrás
   */
  async descargarReporteEstadisticas(
    subtipo: "mensual" | "diario" | "horario",
    config: any,
    onProgress?: any
  ): Promise<void> {
    console.warn(
      "⚠️  Método legacy: descargarReporteEstadisticas - Considera usar el nuevo sistema modular"
    );

    try {
      const params = new URLSearchParams();
      if (config.formato) params.append("formato", config.formato);
      if (config.filtros)
        params.append("filtros", JSON.stringify(config.filtros));
      params.append("subtipo", subtipo);

      const url = `/api/reportes/estadisticas${config.formato === "pdf" ? `/${subtipo}/pdf` : ""}?${params.toString()}`;
      const extension =
        config.formato === "excel"
          ? "xlsx"
          : config.formato === "pdf"
            ? "pdf"
            : "csv";
      const nombreArchivo = `reporte_estadisticas_${subtipo}_${new Date().toISOString().split("T")[0]}.${extension}`;

      // Usar utilidad de descarga del sistema modular
      const { DownloadUtils } = require("../reportes/utils/downloadUtils");
      await DownloadUtils.descargarArchivoConProgress(
        url,
        nombreArchivo,
        onProgress
      );
    } catch (error) {
      console.error("❌ Error descargando reporte de estadísticas:", error);
      throw new Error("Error al descargar reporte de estadísticas");
    }
  }

  async descargarReporteConsumoSectorial(
    subtipo: "equipamiento" | "area" | "horario",
    config: any,
    onProgress?: any
  ): Promise<void> {
    console.warn(
      "⚠️  Método legacy: descargarReporteConsumoSectorial - Considera usar el nuevo sistema modular"
    );

    try {
      const params = new URLSearchParams();
      if (config.formato) params.append("formato", config.formato);
      if (config.filtros)
        params.append("filtros", JSON.stringify(config.filtros));
      params.append("subtipo", subtipo);

      const url = `/api/reportes/consumo-sectorial${config.formato === "pdf" ? "/pdf" : ""}?${params.toString()}`;
      const extension =
        config.formato === "excel"
          ? "xlsx"
          : config.formato === "pdf"
            ? "pdf"
            : "csv";
      const nombreArchivo = `reporte_consumo_${subtipo}_${new Date().toISOString().split("T")[0]}.${extension}`;

      // Usar utilidad de descarga del sistema modular
      const { DownloadUtils } = require("../reportes/utils/downloadUtils");
      await DownloadUtils.descargarArchivoConProgress(
        url,
        nombreArchivo,
        onProgress
      );
    } catch (error) {
      console.error(
        "❌ Error descargando reporte de consumo sectorial:",
        error
      );
      throw new Error("Error al descargar reporte de consumo sectorial");
    }
  }

  async descargarReporteEstadisticasPDF(
    subtipo: "mensual" | "diario" | "horario",
    config: any,
    onProgress?: any
  ): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (config.filtros)
        params.append("filtros", JSON.stringify(config.filtros));
      params.append("subtipo", subtipo);

      const url = `/api/reportes/estadisticas/${subtipo}/pdf?${params.toString()}`;
      const nombreArchivo = `reporte_estadisticas_${subtipo}_${new Date().toISOString().split("T")[0]}.pdf`;

      const { DownloadUtils } = require("../reportes/utils/downloadUtils");
      await DownloadUtils.descargarArchivoConProgress(
        url,
        nombreArchivo,
        onProgress
      );
    } catch (error) {
      console.error("❌ Error descargando reporte PDF de estadísticas:", error);
      throw new Error("Error al descargar reporte PDF de estadísticas");
    }
  }

  async descargarReporteConsumoSectorialPDF(
    subtipo: "equipamiento" | "area" | "horario",
    config: any,
    onProgress?: any
  ): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (config.filtros)
        params.append("filtros", JSON.stringify(config.filtros));
      params.append("subtipo", subtipo);

      const url = `/api/reportes/consumo-sectorial/${subtipo}/pdf?${params.toString()}`;
      const nombreArchivo = `reporte_consumo_${subtipo}_${new Date().toISOString().split("T")[0]}.pdf`;

      const { DownloadUtils } = require("../reportes/utils/downloadUtils");
      await DownloadUtils.descargarArchivoConProgress(
        url,
        nombreArchivo,
        onProgress
      );
    } catch (error) {
      console.error(
        "❌ Error descargando reporte PDF de consumo sectorial:",
        error
      );
      throw new Error("Error al descargar reporte PDF de consumo sectorial");
    }
  }

  async descargarReporte(id: string): Promise<void> {
    const url = `/reportes/${id}/descargar`;
    // DownloadUtils ya maneja la autenticación con el token
    await DownloadUtils.descargarArchivoConProgress(url, `reporte-${id}.pdf`);
  }
}

// Instancia singleton del servicio principal
export const reportesService = new ReportesService();

// Exportar también la clase para casos especiales
export { ReportesService };

// Exportar servicios especializados para uso directo
export {
  clientesReportService,
  empresasReportService,
  cotizacionesReportService,
};

// Mantener compatibilidad hacia atrás
export default reportesService;
