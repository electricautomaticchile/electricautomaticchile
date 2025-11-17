import { IProgressCallback, IProgressState } from "../types";
import {
  REPORTE_CONFIG,
  PROGRESS_STEPS,
  ERROR_MESSAGES,
  DEBUG_CONFIG,
} from "../config";

// Utilidad para manejar descargas de archivos con progress
export class DownloadUtils {
  // Descargar archivo con seguimiento de progreso
  static async descargarArchivoConProgress(
    url: string,
    nombreArchivo: string,
    onProgress?: IProgressCallback
  ): Promise<void> {
    try {
      const token = this.obtenerToken();

      // Progress: Conectando
      onProgress?.({
        step: "connecting",
        percentage: PROGRESS_STEPS.connecting.percentage,
        message: PROGRESS_STEPS.connecting.message,
      });

      const response = await fetch(`${REPORTE_CONFIG.baseUrl}${url}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        throw new Error("Sin datos");
      }
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: ERROR_MESSAGES.serverError }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Progress: Procesando respuesta
      onProgress?.({
        step: "processing",
        percentage: PROGRESS_STEPS.processing.percentage,
        message: PROGRESS_STEPS.processing.message,
      });

      // Extraer metadatos de headers
      const metadata = this.extraerMetadatos(response);

      if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.logResponses) {
        console.log("📊 [Download] Información del reporte:", {
          nombreArchivo,
          ...metadata,
        });
      }

      // Crear blob con la respuesta
      const blob = await response.blob();

      // Progress: Preparando descarga
      onProgress?.({
        step: "download",
        percentage: PROGRESS_STEPS.download.percentage,
        message: PROGRESS_STEPS.download.message,
      });

      // Ejecutar descarga
      await this.ejecutarDescarga(blob, nombreArchivo);

      if (DEBUG_CONFIG.enabled) {
        console.log("✅ [Download] Archivo descargado exitosamente:", {
          nombreArchivo,
          tamañoArchivo: `${(blob.size / 1024).toFixed(2)}KB`,
          ...metadata,
        });
      }
    } catch (error) {
      if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.logErrors) {
        console.error("❌ [Download] Error en descarga de archivo:", error);
      }
      throw error;
    }
  }

  // Obtener token de autenticación
  private static obtenerToken(): string {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token") ||
      document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      )
    );
  }

  // Extraer metadatos de los headers de respuesta
  private static extraerMetadatos(response: Response) {
    return {
      totalRegistros: response.headers.get("X-Reporte-Registros"),
      tiempoGeneracion: response.headers.get("X-Reporte-Tiempo"),
      reporteId: response.headers.get("X-Reporte-ID"),
      tamaño: response.headers.get("Content-Length"),
      contentType: response.headers.get("Content-Type"),
    };
  }

  // Ejecutar la descarga del archivo
  private static async ejecutarDescarga(
    blob: Blob,
    nombreArchivo: string
  ): Promise<void> {
    // Crear URL para descarga
    const urlDescarga = window.URL.createObjectURL(blob);

    // Crear elemento <a> temporal para descarga
    const link = document.createElement("a");
    link.href = urlDescarga;
    link.download = nombreArchivo;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(urlDescarga);
  }

  // Generar nombre de archivo con timestamp
  static generarNombreArchivo(
    prefijo: string,
    formato: "excel" | "csv" | "pdf",
    incluirTimestamp: boolean = true
  ): string {
    const extension = REPORTE_CONFIG.formats[formato].extension;
    const timestamp = incluirTimestamp
      ? `_${new Date().toISOString().split("T")[0]}`
      : "";

    return `${prefijo}${timestamp}.${extension}`;
  }

  // Validar tamaño de archivo
  static validarTamañoArchivo(blob: Blob): { valid: boolean; error?: string } {
    const sizeMB = blob.size / (1024 * 1024);

    if (sizeMB > REPORTE_CONFIG.limits.maxFileSizeMB) {
      return {
        valid: false,
        error: `${ERROR_MESSAGES.fileTooLarge}. Tamaño: ${sizeMB.toFixed(2)}MB`,
      };
    }

    return { valid: true };
  }

  // Construir URL con parámetros
  static construirURL(endpoint: string, params: Record<string, any>): string {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          urlParams.append(key, JSON.stringify(value));
        } else {
          urlParams.append(key, value.toString());
        }
      }
    });

    const queryString = urlParams.toString();
    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }

  // Manejar retry automático
  static async conReintentos<T>(
    operation: () => Promise<T>,
    maxRetries: number = REPORTE_CONFIG.limits.retryAttempts,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error");

        if (attempt === maxRetries) {
          throw lastError;
        }

        if (DEBUG_CONFIG.enabled) {
          console.warn(
            `⚠️ [Download] Intento ${attempt} falló, reintentando en ${delay}ms:`,
            lastError.message
          );
        }

        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  }

  // Validar configuración de descarga
  static validarConfiguracion(config: any): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!config.tipo) {
      errors.push("Tipo de reporte es requerido");
    }

    if (!config.formato || !["excel", "csv", "pdf"].includes(config.formato)) {
      errors.push("Formato debe ser 'excel', 'csv' o 'pdf'");
    }

    if (config.filtros?.fechaDesde && config.filtros?.fechaHasta) {
      const desde = new Date(config.filtros.fechaDesde);
      const hasta = new Date(config.filtros.fechaHasta);

      if (desde > hasta) {
        errors.push("Fecha desde debe ser menor que fecha hasta");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
