import { apiService } from "../apiService";

export interface IFiltrosReporte {
  // Filtros generales
  formato?: "excel" | "csv";
  fechaDesde?: string;
  fechaHasta?: string;

  // Filtros específicos para clientes
  empresaId?: string;
  activo?: boolean;
  tipoCliente?: string;
  ciudad?: string;

  // Filtros específicos para empresas
  estado?: string;
  region?: string;

  // Filtros específicos para cotizaciones
  servicio?: string;

  // Filtros específicos para estadísticas y consumo
  subtipo?: "mensual" | "diario" | "horario" | "equipamiento" | "area";
  periodo?: string;
}

export interface IConfigReporte {
  titulo: string;
  tipo: "clientes" | "empresas" | "cotizaciones" | "dispositivos";
  formato: "excel" | "csv";
  filtros?: IFiltrosReporte;
  empresaId?: string;
}

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

export interface IProgressCallback {
  (progress: { step: string; percentage: number; message: string }): void;
}

class ReportesService {
  // Descargar reporte de clientes con progress
  async descargarReporteClientes(
    config: IConfigReporte,
    onProgress?: IProgressCallback
  ): Promise<void> {
    try {
      console.log("📊 [HÍBRIDO] Descargando reporte de clientes:", config);

      // Progress: Iniciando
      onProgress?.({
        step: "init",
        percentage: 0,
        message: "Iniciando generación de reporte...",
      });

      const params = new URLSearchParams();
      if (config.formato) params.append("formato", config.formato);
      if (config.empresaId) params.append("empresaId", config.empresaId);
      if (config.filtros)
        params.append("filtros", JSON.stringify(config.filtros));

      const url = `/api/reportes/clientes?${params.toString()}`;

      // Progress: Solicitando al servidor
      onProgress?.({
        step: "request",
        percentage: 25,
        message: "Solicitando datos al servidor...",
      });

      const nombreArchivo = `reporte_clientes_${new Date().toISOString().split("T")[0]}.${config.formato === "excel" ? "xlsx" : "csv"}`;

      await this.descargarArchivoConProgress(url, nombreArchivo, onProgress);

      // Progress: Completado
      onProgress?.({
        step: "complete",
        percentage: 100,
        message: "Reporte descargado exitosamente",
      });
    } catch (error) {
      console.error(
        "❌ [HÍBRIDO] Error descargando reporte de clientes:",
        error
      );

      // Progress: Error
      onProgress?.({
        step: "error",
        percentage: 0,
        message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
      });

      throw new Error("Error al descargar reporte de clientes");
    }
  }

  // Descargar reporte de empresas
  async descargarReporteEmpresas(
    config: IConfigReporte,
    onProgress?: IProgressCallback
  ): Promise<void> {
    try {
      console.log("📊 [HÍBRIDO] Descargando reporte de empresas:", config);

      onProgress?.({
        step: "init",
        percentage: 0,
        message: "Iniciando generación de reporte de empresas...",
      });

      const params = new URLSearchParams();
      if (config.formato) params.append("formato", config.formato);
      if (config.filtros)
        params.append("filtros", JSON.stringify(config.filtros));

      const url = `/api/reportes/empresas?${params.toString()}`;

      onProgress?.({
        step: "request",
        percentage: 25,
        message: "Solicitando datos de empresas...",
      });

      const nombreArchivo = `reporte_empresas_${new Date().toISOString().split("T")[0]}.${config.formato === "excel" ? "xlsx" : "csv"}`;

      await this.descargarArchivoConProgress(url, nombreArchivo, onProgress);

      onProgress?.({
        step: "complete",
        percentage: 100,
        message: "Reporte de empresas descargado exitosamente",
      });
    } catch (error) {
      console.error(
        "❌ [HÍBRIDO] Error descargando reporte de empresas:",
        error
      );

      onProgress?.({
        step: "error",
        percentage: 0,
        message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
      });

      throw new Error("Error al descargar reporte de empresas");
    }
  }

  // Descargar reporte de cotizaciones
  async descargarReporteCotizaciones(
    config: IConfigReporte,
    onProgress?: IProgressCallback
  ): Promise<void> {
    try {
      console.log("📊 [HÍBRIDO] Descargando reporte de cotizaciones:", config);

      onProgress?.({
        step: "init",
        percentage: 0,
        message: "Iniciando generación de reporte de cotizaciones...",
      });

      const params = new URLSearchParams();
      if (config.formato) params.append("formato", config.formato);
      if (config.filtros)
        params.append("filtros", JSON.stringify(config.filtros));

      const url = `/api/reportes/cotizaciones?${params.toString()}`;

      onProgress?.({
        step: "request",
        percentage: 25,
        message: "Solicitando datos de cotizaciones...",
      });

      const nombreArchivo = `reporte_cotizaciones_${new Date().toISOString().split("T")[0]}.${config.formato === "excel" ? "xlsx" : "csv"}`;

      await this.descargarArchivoConProgress(url, nombreArchivo, onProgress);

      onProgress?.({
        step: "complete",
        percentage: 100,
        message: "Reporte de cotizaciones descargado exitosamente",
      });
    } catch (error) {
      console.error(
        "❌ [HÍBRIDO] Error descargando reporte de cotizaciones:",
        error
      );

      onProgress?.({
        step: "error",
        percentage: 0,
        message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
      });

      throw new Error("Error al descargar reporte de cotizaciones");
    }
  }

  // Método privado para manejar la descarga de archivos con progress
  private async descargarArchivoConProgress(
    url: string,
    nombreArchivo: string,
    onProgress?: IProgressCallback
  ): Promise<void> {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

      // Progress: Conectando
      onProgress?.({
        step: "connecting",
        percentage: 30,
        message: "Conectando con el servidor...",
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api${url}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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

      // Progress: Procesando respuesta
      onProgress?.({
        step: "processing",
        percentage: 60,
        message: "Procesando respuesta del servidor...",
      });

      // Extraer información adicional de headers
      const totalRegistros = response.headers.get("X-Reporte-Registros");
      const tiempoGeneracion = response.headers.get("X-Reporte-Tiempo");
      const reporteId = response.headers.get("X-Reporte-ID");

      console.log("📊 [HÍBRIDO] Información del reporte:", {
        nombreArchivo,
        totalRegistros,
        tiempoGeneracion: tiempoGeneracion ? `${tiempoGeneracion}ms` : "N/A",
        reporteId,
        tamaño: response.headers.get("Content-Length"),
      });

      // Crear blob con la respuesta
      const blob = await response.blob();

      // Progress: Preparando descarga
      onProgress?.({
        step: "download",
        percentage: 90,
        message: "Preparando descarga...",
      });

      // Crear URL para descarga
      const urlDescarga = window.URL.createObjectURL(blob);

      // Crear elemento <a> temporal para descarga
      const link = document.createElement("a");
      link.href = urlDescarga;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlDescarga);

      console.log("✅ [HÍBRIDO] Archivo descargado exitosamente:", {
        nombreArchivo,
        tamaño: `${(blob.size / 1024).toFixed(2)}KB`,
        registros: totalRegistros,
        tiempo: tiempoGeneracion ? `${tiempoGeneracion}ms` : "N/A",
      });
    } catch (error) {
      console.error("❌ [HÍBRIDO] Error en descarga de archivo:", error);
      throw error;
    }
  }

  // Método privado legacy para compatibilidad
  private async descargarArchivo(
    url: string,
    nombreArchivo: string
  ): Promise<void> {
    return this.descargarArchivoConProgress(url, nombreArchivo);
  }

  // Exportar datos locales a CSV (para cuando no hay backend)
  exportarCSVLocal(datos: any[], columnas: any[], nombreArchivo: string): void {
    try {
      // Crear headers del CSV
      const headers = columnas.map((col) => col.header || col.key);

      // Crear filas de datos
      const filas = datos.map((fila) => {
        return columnas.map((col) => {
          let valor = fila[col.key];

          // Formatear según tipo
          if (col.type === "date" && valor) {
            valor = new Date(valor).toLocaleDateString("es-CL");
          } else if (col.type === "currency" && typeof valor === "number") {
            valor = new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
            }).format(valor);
          } else if (col.type === "number" && typeof valor === "number") {
            valor = new Intl.NumberFormat("es-CL").format(valor);
          }

          // Escapar comillas y saltos de línea para CSV
          if (typeof valor === "string") {
            valor = valor.replace(/"/g, '""');
            if (
              valor.includes(",") ||
              valor.includes("\n") ||
              valor.includes('"')
            ) {
              valor = `"${valor}"`;
            }
          }

          return valor || "";
        });
      });

      // Construir contenido CSV
      const csvContent = [
        headers.join(","),
        ...filas.map((fila) => fila.join(",")),
      ].join("\n");

      // Crear blob y descargar
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${nombreArchivo}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      console.log("✅ CSV local exportado:", nombreArchivo);
    } catch (error) {
      console.error("❌ Error exportando CSV local:", error);
      throw new Error("Error al exportar CSV");
    }
  }

  // Generar reporte completo con configuración avanzada
  async generarReporteCompleto(
    config: IConfigReporte,
    onProgress?: IProgressCallback
  ): Promise<void> {
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

  // Obtener historial de reportes del usuario
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
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  // Obtener estadísticas de reportes
  async obtenerEstadisticasReportes(diasAtras: number = 30): Promise<{
    success: boolean;
    data?: IEstadisticasReportes;
    error?: string;
  }> {
    try {
      const params = new URLSearchParams();
      params.append("diasAtras", diasAtras.toString());

      const response = await this.makeRequest<IEstadisticasReportes>(
        `/reportes/estadisticas?${params.toString()}`
      );

      return response;
    } catch (error) {
      console.error("❌ Error obteniendo estadísticas de reportes:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  // Método privado para hacer requests con token
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{
    success: boolean;
    data?: T;
    error?: string;
  }> {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const url = `${API_URL}/api${endpoint}`;
      const token =
        localStorage.getItem("auth_token") || localStorage.getItem("token");

      const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`;
      }

      const config: RequestInit = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || "Error en la solicitud",
        };
      }

      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("API Request Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      };
    }
  }

  // Generar vista previa de filtros aplicados
  generarVistaPrevia(config: IConfigReporte): string {
    const filtros = config.filtros || {};
    const filtrosTexto: string[] = [];

    if (filtros.tipoCliente) {
      filtrosTexto.push(`Tipo: ${filtros.tipoCliente}`);
    }
    if (filtros.ciudad) {
      filtrosTexto.push(`Ciudad: ${filtros.ciudad}`);
    }
    if (filtros.estado) {
      filtrosTexto.push(`Estado: ${filtros.estado}`);
    }
    if (filtros.activo !== undefined) {
      filtrosTexto.push(`Activo: ${filtros.activo ? "Sí" : "No"}`);
    }
    if (filtros.fechaDesde) {
      filtrosTexto.push(
        `Desde: ${new Date(filtros.fechaDesde).toLocaleDateString("es-CL")}`
      );
    }
    if (filtros.fechaHasta) {
      filtrosTexto.push(
        `Hasta: ${new Date(filtros.fechaHasta).toLocaleDateString("es-CL")}`
      );
    }

    if (filtrosTexto.length === 0) {
      return "Sin filtros aplicados - Se incluirán todos los registros";
    }

    return `Filtros aplicados: ${filtrosTexto.join(", ")}`;
  }

  // Estimar tiempo de generación basado en filtros
  estimarTiempoGeneracion(config: IConfigReporte): string {
    const filtros = config.filtros || {};
    const cantidadFiltros = Object.keys(filtros).length;

    // Estimación básica basada en tipo y formato
    let tiempoBase = 2; // segundos base

    if (config.formato === "excel") {
      tiempoBase += 1; // Excel toma más tiempo
    }

    if (config.tipo === "cotizaciones") {
      tiempoBase += 1; // Cotizaciones suelen tener más datos
    }

    // Ajustar por filtros (menos filtros = más datos = más tiempo)
    if (cantidadFiltros === 0) {
      tiempoBase += 3; // Sin filtros = todos los datos
    } else if (cantidadFiltros < 3) {
      tiempoBase += 1;
    }

    return `${tiempoBase}-${tiempoBase + 2} segundos`;
  }

  // Generar reporte de estadísticas de consumo
  async descargarReporteEstadisticas(
    subtipo: "mensual" | "diario" | "horario",
    config: Omit<IConfigReporte, "tipo">,
    onProgress?: IProgressCallback
  ): Promise<void> {
    try {
      console.log("📊 [HÍBRIDO] Descargando reporte de estadísticas:", {
        subtipo,
        config,
      });

      onProgress?.({
        step: "init",
        percentage: 0,
        message: "Iniciando generación de reporte de estadísticas...",
      });

      const params = new URLSearchParams();
      if (config.formato) params.append("formato", config.formato);
      if (config.filtros)
        params.append("filtros", JSON.stringify(config.filtros));

      const url = `/api/reportes/estadisticas/${subtipo}?${params.toString()}`;

      onProgress?.({
        step: "request",
        percentage: 25,
        message: `Solicitando datos de estadísticas ${subtipo}...`,
      });

      const nombreArchivo = `estadisticas_${subtipo}_${new Date().toISOString().split("T")[0]}.${config.formato === "excel" ? "xlsx" : "csv"}`;

      await this.descargarArchivoConProgress(url, nombreArchivo, onProgress);

      onProgress?.({
        step: "complete",
        percentage: 100,
        message: "Reporte de estadísticas descargado exitosamente",
      });
    } catch (error) {
      console.error(
        "❌ [HÍBRIDO] Error descargando reporte de estadísticas:",
        error
      );

      onProgress?.({
        step: "error",
        percentage: 0,
        message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
      });

      throw new Error("Error al descargar reporte de estadísticas");
    }
  }

  // Descargar reporte de consumo sectorial
  async descargarReporteConsumoSectorial(
    subtipo: "equipamiento" | "area" | "horario",
    config: Omit<IConfigReporte, "tipo">,
    onProgress?: IProgressCallback
  ): Promise<void> {
    try {
      console.log("📊 [HÍBRIDO] Descargando reporte de consumo sectorial:", {
        subtipo,
        config,
      });

      onProgress?.({
        step: "init",
        percentage: 0,
        message: "Iniciando generación de reporte de consumo sectorial...",
      });

      const params = new URLSearchParams();
      if (config.formato) params.append("formato", config.formato);
      if (config.filtros)
        params.append("filtros", JSON.stringify(config.filtros));

      const url = `/api/reportes/consumo-sectorial/${subtipo}?${params.toString()}`;

      onProgress?.({
        step: "request",
        percentage: 25,
        message: `Solicitando datos de consumo ${subtipo}...`,
      });

      const nombreArchivo = `consumo_${subtipo}_${new Date().toISOString().split("T")[0]}.${config.formato === "excel" ? "xlsx" : "csv"}`;

      await this.descargarArchivoConProgress(url, nombreArchivo, onProgress);

      onProgress?.({
        step: "complete",
        percentage: 100,
        message: "Reporte de consumo sectorial descargado exitosamente",
      });
    } catch (error) {
      console.error(
        "❌ [HÍBRIDO] Error descargando reporte de consumo sectorial:",
        error
      );

      onProgress?.({
        step: "error",
        percentage: 0,
        message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
      });

      throw new Error("Error al descargar reporte de consumo sectorial");
    }
  }
}

// Exportar instancia singleton
export const reportesService = new ReportesService();
