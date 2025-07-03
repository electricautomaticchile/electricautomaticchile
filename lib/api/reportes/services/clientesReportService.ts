import { BaseReportService } from "./baseReportService";
import { IConfigReporte } from "../types";
import { ENDPOINTS, DEFAULT_COLUMNS } from "../config";

// Servicio especializado para reportes de clientes
export class ClientesReportService extends BaseReportService {
  protected getEndpoint(): string {
    return ENDPOINTS.clientes;
  }

  protected getReportPrefix(): string {
    return "reporte_clientes";
  }

  // Validaciones específicas para reportes de clientes
  protected validacionesEspecificas(config: IConfigReporte): string[] {
    const errors: string[] = [];

    // Validar filtros específicos de clientes
    if (
      config.filtros?.empresaId &&
      typeof config.filtros.empresaId !== "string"
    ) {
      errors.push("EmpresaId debe ser una cadena válida");
    }

    if (
      config.filtros?.activo !== undefined &&
      typeof config.filtros.activo !== "boolean"
    ) {
      errors.push("Filtro 'activo' debe ser booleano");
    }

    if (
      config.filtros?.tipoCliente &&
      !["residencial", "comercial", "industrial"].includes(
        config.filtros.tipoCliente
      )
    ) {
      errors.push(
        "Tipo de cliente debe ser: residencial, comercial o industrial"
      );
    }

    return errors;
  }

  // Columnas esperadas para reportes de clientes
  protected obtenerColumnasEsperadas(): string[] {
    return DEFAULT_COLUMNS.clientes.map((col) => col.header);
  }

  // Estimación específica de registros para clientes
  protected estimarCantidadRegistros(config: IConfigReporte): number {
    let baseRegistros = 500; // Base para clientes

    // Ajustar según filtros
    if (config.filtros?.empresaId) {
      baseRegistros = Math.floor(baseRegistros * 0.3); // Una empresa tiene menos clientes
    }

    if (config.filtros?.activo === false) {
      baseRegistros = Math.floor(baseRegistros * 0.1); // Pocos clientes inactivos
    }

    if (config.filtros?.ciudad) {
      baseRegistros = Math.floor(baseRegistros * 0.2); // Filtro por ciudad reduce mucho
    }

    if (config.filtros?.tipoCliente) {
      baseRegistros = Math.floor(baseRegistros * 0.4); // Filtro por tipo reduce
    }

    // Ajustar por rango de fechas
    if (config.filtros?.fechaDesde && config.filtros?.fechaHasta) {
      const desde = new Date(config.filtros.fechaDesde);
      const hasta = new Date(config.filtros.fechaHasta);
      const diasDiferencia =
        Math.abs(hasta.getTime() - desde.getTime()) / (1000 * 60 * 60 * 24);

      if (diasDiferencia < 30) {
        baseRegistros = Math.floor(baseRegistros * 0.1);
      } else if (diasDiferencia < 90) {
        baseRegistros = Math.floor(baseRegistros * 0.3);
      } else if (diasDiferencia < 365) {
        baseRegistros = Math.floor(baseRegistros * 0.7);
      }
    }

    return Math.max(1, baseRegistros); // Mínimo 1 registro
  }

  // Restricciones específicas para clientes
  protected obtenerRestricciones(config: IConfigReporte): string[] {
    const restricciones = super.obtenerRestricciones(config);

    // Restricciones específicas de clientes
    if (!config.filtros?.empresaId && !config.empresaId) {
      restricciones.push(
        "Se recomienda filtrar por empresa para mejor rendimiento"
      );
    }

    if (config.filtros?.fechaDesde && config.filtros?.fechaHasta) {
      const desde = new Date(config.filtros.fechaDesde);
      const hasta = new Date(config.filtros.fechaHasta);
      const diasDiferencia =
        Math.abs(hasta.getTime() - desde.getTime()) / (1000 * 60 * 60 * 24);

      if (diasDiferencia > 365) {
        restricciones.push(
          "Rangos de fecha mayores a 1 año pueden tardar más tiempo"
        );
      }
    }

    return restricciones;
  }

  // Método específico para obtener estadísticas de clientes antes del reporte
  async obtenerEstadisticasClientes(empresaId?: string): Promise<{
    total: number;
    activos: number;
    inactivos: number;
    porTipo: Record<string, number>;
    porCiudad: Record<string, number>;
  }> {
    try {
      const params = empresaId ? `?empresaId=${empresaId}` : "";
      const response = await this.makeRequest(
        `${this.getEndpoint()}/estadisticas${params}`
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || "Error al obtener estadísticas");
      }
    } catch (error) {
      console.error("Error obteniendo estadísticas de clientes:", error);

      // Devolver valores por defecto
      return {
        total: 0,
        activos: 0,
        inactivos: 0,
        porTipo: {},
        porCiudad: {},
      };
    }
  }

  // Método para obtener vista previa de datos (primeros registros)
  // TEMPORALMENTE DESHABILITADO - Error de tipos
  /*
  async obtenerVistaPrevia(config: IConfigReporte): Promise<{
    datos: any[];
    total: number;
  }> {
    try {
      // Construir URL para vista previa (con límite)
        },
      });

      const response = await this.makeRequest(url);

      if (response.success) {
        return {
          datos: response.data.clientes || [],
          total: response.data.total || 0,
        };
      } else {
        throw new Error(response.error || "Error al obtener vista previa");
      }
    } catch (error) {
      console.error("Error obteniendo vista previa de clientes:", error);
      return {
        datos: [],
        total: 0,
      };
    }
  }
  */

  // Validar si el usuario tiene permisos para generar este reporte
  async validarPermisos(config: IConfigReporte): Promise<{
    valid: boolean;
    error?: string;
  }> {
    try {
      // Si hay empresaId en filtros, validar que el usuario tenga acceso
      if (config.filtros?.empresaId) {
        const response = await this.makeRequest(
          `/empresas/${config.filtros.empresaId}/acceso`
        );

        if (!response.success) {
          return {
            valid: false,
            error: "No tiene permisos para acceder a los datos de esta empresa",
          };
        }
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: "Error validando permisos",
      };
    }
  }
}

// Instancia singleton del servicio
export const clientesReportService = new ClientesReportService();
