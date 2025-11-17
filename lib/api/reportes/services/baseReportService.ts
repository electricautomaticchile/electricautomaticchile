import { IConfigReporte, IProgressCallback, IReporteResult } from "../types";
import { DownloadUtils } from "../utils/downloadUtils";
import {
  REPORTE_CONFIG,
  ENDPOINTS,
  PROGRESS_STEPS,
  ERROR_MESSAGES,
  DEBUG_CONFIG,
} from "../config";

// Servicio base para todos los reportes
export abstract class BaseReportService {
  // Método abstracto que cada servicio debe implementar
  protected abstract getEndpoint(): string;
  protected abstract getReportPrefix(): string;

  // Generar reporte con configuración
  async generarReporte(
    config: IConfigReporte,
    onProgress?: IProgressCallback
  ): Promise<void> {
    try {
      // Validar configuración
      const validacion = this.validarConfiguracion(config);
      if (!validacion.valid) {
        throw new Error(
          `Configuración inválida: ${validacion.errors.join(", ")}`
        );
      }

      if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.logRequests) {
        console.log(
          `📊 [${this.getReportPrefix()}] Generando reporte:`,
          config
        );
      }

      // Progress: Iniciando
      onProgress?.({
        step: "init",
        percentage: PROGRESS_STEPS.init.percentage,
        message: PROGRESS_STEPS.init.message,
      });

      // Construir URL con parámetros
      const url = this.construirURL(config);

      // Progress: Solicitando
      onProgress?.({
        step: "request",
        percentage: PROGRESS_STEPS.request.percentage,
        message: PROGRESS_STEPS.request.message,
      });

      // Generar nombre de archivo
      const nombreArchivo = DownloadUtils.generarNombreArchivo(
        this.getReportPrefix(),
        config.formato
      );

      // Descargar archivo
      await DownloadUtils.descargarArchivoConProgress(
        url,
        nombreArchivo,
        onProgress
      );

      // Progress: Completado
      onProgress?.({
        step: "complete",
        percentage: PROGRESS_STEPS.complete.percentage,
        message: PROGRESS_STEPS.complete.message,
      });

      if (DEBUG_CONFIG.enabled) {
        console.log(
          `✅ [${this.getReportPrefix()}] Reporte generado exitosamente`
        );
      }
    } catch (error) {
      if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.logErrors) {
        console.error(
          `❌ [${this.getReportPrefix()}] Error generando reporte:`,
          error
        );
      }

      // Progress: Error
      onProgress?.({
        step: "error",
        percentage: PROGRESS_STEPS.error.percentage,
        message: `Error: ${error instanceof Error ? error.message : ERROR_MESSAGES.serverError}`,
      });

      throw new Error(`Error al generar reporte de ${this.getReportPrefix()}`);
    }
  }

  // Construir URL con parámetros específicos
  protected construirURL(config: IConfigReporte): string {
    const params: Record<string, any> = {};

    // Parámetros básicos
    if (config.formato) params.formato = config.formato;
    if (config.empresaId) params.empresaId = config.empresaId;

    // Filtros
    if (config.filtros) {
      // Agregar filtros como parámetros individuales para mejor control
      Object.entries(config.filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });
    }

    return DownloadUtils.construirURL(this.getEndpoint(), params);
  }

  // Validar configuración del reporte
  protected validarConfiguracion(config: IConfigReporte): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validaciones básicas
    if (!config.tipo) {
      errors.push("Tipo de reporte es requerido");
    }

    if (!config.formato || !["excel", "csv", "pdf"].includes(config.formato)) {
      errors.push("Formato debe ser 'excel', 'csv' o 'pdf'");
    }

    if (!config.titulo || config.titulo.trim().length === 0) {
      errors.push("Título del reporte es requerido");
    }

    // Validaciones de filtros de fecha
    if (config.filtros?.fechaDesde && config.filtros?.fechaHasta) {
      const desde = new Date(config.filtros.fechaDesde);
      const hasta = new Date(config.filtros.fechaHasta);

      if (desde > hasta) {
        errors.push("Fecha desde debe ser menor que fecha hasta");
      }

      // Validar que las fechas no sean futuras
      const hoy = new Date();
      if (hasta > hoy) {
        errors.push("Fecha hasta no puede ser futura");
      }
    }

    // Validaciones específicas pueden ser sobrescritas por subclases
    const validacionesEspecificas = this.validacionesEspecificas(config);
    errors.push(...validacionesEspecificas);

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Método para validaciones específicas de cada tipo de reporte
  protected validacionesEspecificas(config: IConfigReporte): string[] {
    return []; // Por defecto, sin validaciones adicionales
  }

  // Estimar tiempo de generación del reporte
  estimarTiempo(config: IConfigReporte): {
    tiempoEstimado: number;
    complejidad: "baja" | "media" | "alta";
    factores: string[];
  } {
    const factores: string[] = [];
    let tiempoBase = 2000; // 2 segundos base

    // Factor por formato
    if (config.formato === "excel") {
      tiempoBase += 1000;
      factores.push("Formato Excel (+1s)");
    }

    // Factor por filtros de fecha
    if (config.filtros?.fechaDesde && config.filtros?.fechaHasta) {
      const desde = new Date(config.filtros.fechaDesde);
      const hasta = new Date(config.filtros.fechaHasta);
      const diasDiferencia =
        Math.abs(hasta.getTime() - desde.getTime()) / (1000 * 60 * 60 * 24);

      if (diasDiferencia > 365) {
        tiempoBase += 5000;
        factores.push("Rango de fechas amplio (+5s)");
      } else if (diasDiferencia > 90) {
        tiempoBase += 2000;
        factores.push("Rango de fechas medio (+2s)");
      }
    }

    // Determinar complejidad
    let complejidad: "baja" | "media" | "alta";
    if (tiempoBase <= 3000) {
      complejidad = "baja";
    } else if (tiempoBase <= 7000) {
      complejidad = "media";
    } else {
      complejidad = "alta";
    }

    return {
      tiempoEstimado: tiempoBase,
      complejidad,
      factores,
    };
  }

  // Generar vista previa del reporte
  generarVistaPrevia(config: IConfigReporte): {
    titulo: string;
    descripcion: string;
    columnas: string[];
    registrosEstimados: number;
    tamañoEstimado: string;
    tiempoEstimado: string;
    restricciones?: string[];
  } {
    const estimacion = this.estimarTiempo(config);

    return {
      titulo: config.titulo,
      descripcion: `Reporte de ${config.tipo} en formato ${config.formato.toUpperCase()}`,
      columnas: this.obtenerColumnasEsperadas(),
      registrosEstimados: this.estimarCantidadRegistros(config),
      tamañoEstimado: this.estimarTamañoArchivo(config),
      tiempoEstimado: `${Math.round(estimacion.tiempoEstimado / 1000)} segundos`,
      restricciones: this.obtenerRestricciones(config),
    };
  }

  // Métodos que pueden ser sobrescritos por subclases
  protected obtenerColumnasEsperadas(): string[] {
    return ["ID", "Nombre", "Fecha", "Estado"];
  }

  protected estimarCantidadRegistros(config: IConfigReporte): number {
    return 100; // Estimación por defecto
  }

  protected estimarTamañoArchivo(config: IConfigReporte): string {
    const registros = this.estimarCantidadRegistros(config);
    const bytesPerRecord = config.formato === "excel" ? 150 : 80;
    const tamañoBytes = registros * bytesPerRecord;

    if (tamañoBytes < 1024) return `${tamañoBytes} bytes`;
    if (tamañoBytes < 1024 * 1024)
      return `${(tamañoBytes / 1024).toFixed(2)} KB`;
    return `${(tamañoBytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  protected obtenerRestricciones(config: IConfigReporte): string[] {
    const restricciones: string[] = [];

    if (
      this.estimarCantidadRegistros(config) > REPORTE_CONFIG.limits.maxRecords
    ) {
      restricciones.push(
        `Máximo ${REPORTE_CONFIG.limits.maxRecords.toLocaleString()} registros`
      );
    }

    return restricciones;
  }

  // Método para hacer requests HTTP básicos
  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<IReporteResult> {
    try {
      const token = this.obtenerToken();

      const response = await fetch(`${REPORTE_CONFIG.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  // Obtener token de autenticación
  private obtenerToken(): string {
    return (
      localStorage.getItem("token") || localStorage.getItem("auth_token") || ""
    );
  }
}
