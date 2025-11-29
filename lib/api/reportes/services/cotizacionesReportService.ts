import { BaseReportService } from "./baseReportService";
import { IConfigReporte, IProgressCallback } from "../types";
import { DownloadUtils } from "../utils/downloadUtils";
import { CSVUtils } from "../utils/csvUtils";
import { ENDPOINTS, DEFAULT_COLUMNS } from "../config";

// Servicio especializado para reportes de cotizaciones
export class CotizacionesReportService extends BaseReportService {
  constructor() {
    super();
  }

  protected getEndpoint(): string {
    return ENDPOINTS.cotizaciones;
  }

  protected getReportPrefix(): string {
    return "reporte_cotizaciones";
  }

  // Validaciones específicas para reportes de cotizaciones
  protected validacionesEspecificas(config: IConfigReporte): string[] {
    const errors: string[] = [];

    // Validar filtros específicos de cotizaciones
    const serviciosValidos = ["consulta", "hardware", "reposicion", "consumo"];
    if (
      config.filtros?.servicio &&
      !serviciosValidos.includes(config.filtros.servicio)
    ) {
      errors.push(`Servicio debe ser uno de: ${serviciosValidos.join(", ")}`);
    }

    return errors;
  }

  // Columnas esperadas para reportes de cotizaciones
  protected obtenerColumnasEsperadas(): string[] {
    return DEFAULT_COLUMNS.cotizaciones.map((col) => col.header);
  }

  // Estimación específica de registros para cotizaciones
  protected estimarCantidadRegistros(config: IConfigReporte): number {
    let baseRegistros = 300; // Base para cotizaciones

    // Ajustar según filtros
    if (config.filtros?.empresaId) {
      baseRegistros = Math.floor(baseRegistros * 0.2); // Por empresa específica
    }

    if (config.filtros?.servicio) {
      baseRegistros = Math.floor(baseRegistros * 0.4); // Por servicio específico
    }

    return Math.max(1, baseRegistros);
  }

  /**
   * Descargar reporte de cotizaciones
   */
  async descargarReporteCotizaciones(
    config: IConfigReporte,
    onProgress?: IProgressCallback
  ): Promise<void> {
    try {
        "📊 [COTIZACIONES] Descargando reporte de cotizaciones:",
        config
      );

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

      await DownloadUtils.descargarArchivoConProgress(
        url,
        nombreArchivo,
        onProgress
      );

      onProgress?.({
        step: "complete",
        percentage: 100,
        message: "Reporte de cotizaciones descargado exitosamente",
      });
    } catch (error) {

      onProgress?.({
        step: "error",
        percentage: 0,
        message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
      });

      throw new Error("Error al descargar reporte de cotizaciones");
    }
  }

  /**
   * Exportar cotizaciones locales a CSV
   */
  exportarCotizacionesCSV(
    cotizaciones: any[],
    nombreArchivo: string = "cotizaciones"
  ): void {
    const columnas = [
      { key: "numero", header: "Número", type: "string" as const },
      { key: "cliente", header: "Cliente", type: "string" as const },
      { key: "empresa", header: "Empresa", type: "string" as const },
      { key: "servicio", header: "Servicio", type: "string" as const },
      { key: "valor", header: "Valor", type: "currency" as const },
      { key: "estado", header: "Estado", type: "string" as const },
      { key: "fechaCreacion", header: "Fecha Creación", type: "date" as const },
      {
        key: "fechaVencimiento",
        header: "Fecha Vencimiento",
        type: "date" as const,
      },
      {
        key: "observaciones",
        header: "Observaciones",
        type: "string" as const,
      },
    ];

    CSVUtils.exportarCSVLocal(cotizaciones, columnas, nombreArchivo);
  }

  /**
   * Generar vista previa del reporte de cotizaciones
   */
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
      titulo: config.titulo || "Reporte de Cotizaciones",
      descripcion: `Reporte de cotizaciones en formato ${config.formato?.toUpperCase() || "CSV"}`,
      columnas: [
        "Número de cotización",
        "Cliente",
        "Empresa",
        "Servicio",
        "Valor",
        "Estado",
        "Fecha de creación",
        "Fecha de vencimiento",
        "Observaciones",
      ],
      registrosEstimados: this.estimarCantidadRegistros(config),
      tamañoEstimado: this.estimarTamañoArchivo(config),
      tiempoEstimado: `${Math.round(estimacion.tiempoEstimado / 1000)} segundos`,
      restricciones: config.filtros?.servicio
        ? [`Filtrado por servicio: ${config.filtros.servicio}`]
        : undefined,
    };
  }

  /**
   * Estimar tiempo de generación del reporte
   */
  estimarTiempoGeneracion(config: IConfigReporte): string {
    const baseTime = 2000; // 2 segundos base
    let estimatedTime = baseTime;

    // Ajustar según filtros
    if (config.filtros?.fechaDesde && config.filtros?.fechaHasta) {
      const fechaDesde = new Date(config.filtros.fechaDesde);
      const fechaHasta = new Date(config.filtros.fechaHasta);
      const diasDiferencia =
        Math.abs(fechaHasta.getTime() - fechaDesde.getTime()) /
        (1000 * 60 * 60 * 24);
      estimatedTime += diasDiferencia * 100; // 100ms por día
    }

    // Ajustar según formato
    if (config.formato === "excel") {
      estimatedTime *= 1.5; // Excel toma más tiempo
    }

    if (estimatedTime < 2000) estimatedTime = 2000;
    if (estimatedTime > 30000) estimatedTime = 30000;

    return `${Math.round(estimatedTime / 1000)} segundos`;
  }
}

// Instancia singleton del servicio
export const cotizacionesReportService = new CotizacionesReportService();
