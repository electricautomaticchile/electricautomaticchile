import { BaseReportService } from "./baseReportService";
import { IConfigReporte } from "../types";
import { ENDPOINTS, DEFAULT_COLUMNS } from "../config";

// Servicio especializado para reportes de empresas
export class EmpresasReportService extends BaseReportService {
  protected getEndpoint(): string {
    return ENDPOINTS.empresas;
  }

  protected getReportPrefix(): string {
    return "reporte_empresas";
  }

  // Validaciones específicas para reportes de empresas
  protected validacionesEspecificas(config: IConfigReporte): string[] {
    const errors: string[] = [];

    // Validar filtros específicos de empresas
    if (
      config.filtros?.estado &&
      !["activa", "inactiva", "suspendida", "pendiente"].includes(
        config.filtros.estado
      )
    ) {
      errors.push("Estado debe ser: activa, inactiva, suspendida o pendiente");
    }

    if (config.filtros?.region && typeof config.filtros.region !== "string") {
      errors.push("Región debe ser una cadena válida");
    }

    return errors;
  }

  // Columnas esperadas para reportes de empresas
  protected obtenerColumnasEsperadas(): string[] {
    return DEFAULT_COLUMNS.empresas.map((col) => col.header);
  }

  // Estimación específica de registros para empresas
  protected estimarCantidadRegistros(config: IConfigReporte): number {
    let baseRegistros = 200; // Base para empresas (menos que clientes)

    // Ajustar según filtros
    if (config.filtros?.estado === "inactiva") {
      baseRegistros = Math.floor(baseRegistros * 0.1);
    } else if (config.filtros?.estado === "pendiente") {
      baseRegistros = Math.floor(baseRegistros * 0.05);
    }

    if (config.filtros?.region) {
      baseRegistros = Math.floor(baseRegistros * 0.3); // Por región
    }

    if (config.filtros?.ciudad) {
      baseRegistros = Math.floor(baseRegistros * 0.15); // Por ciudad específica
    }

    return Math.max(1, baseRegistros);
  }

  // Restricciones específicas para empresas
  protected obtenerRestricciones(config: IConfigReporte): string[] {
    const restricciones = super.obtenerRestricciones(config);

    // Solo superusuarios pueden generar reportes completos de empresas
    restricciones.push(
      "Requiere permisos de superusuario para reporte completo"
    );

    return restricciones;
  }
}

// Instancia singleton del servicio
export const empresasReportService = new EmpresasReportService();
