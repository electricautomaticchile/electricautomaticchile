import { BaseApiService } from "../utils/baseService";
import { ApiResponse } from "../types";

export interface IAlerta {
  _id?: string;
  tipo: "error" | "advertencia" | "informacion" | "exito";
  titulo: string;
  mensaje: string;
  dispositivo?: string;
  empresaId: string;
  ubicacion?: string;
  importante: boolean;
  leida: boolean;
  resuelta: boolean;
  asignadoA?: string;
  fechaCreacion: Date;
  fechaResolucion?: Date;
  accionesTomadas?: string;
  metadatos?: any;
}

export interface ICrearAlerta {
  tipo: "error" | "advertencia" | "informacion" | "exito";
  titulo: string;
  mensaje: string;
  dispositivo?: string;
  empresaId: string;
  ubicacion?: string;
  importante?: boolean;
  metadatos?: any;
}

export interface IResumenAlertas {
  total: number;
  errorCritico: number;
  advertencia: number;
  informacion: number;
  exito: number;
  noLeidas: number;
  importantes: number;
  resueltas: number;
}

export interface IFiltrosAlertas {
  tipo?: "error" | "advertencia" | "informacion" | "exito";
  estado?: "leidas" | "no_leidas" | "resueltas" | "activas";
  importante?: boolean;
  empresaId?: string;
  dispositivo?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  page?: number;
  limit?: number;
}

class AlertasService extends BaseApiService {
  private basePath = "/alertas";

  // Obtener alertas con filtros
  async obtenerAlertas(filtros: IFiltrosAlertas = {}): Promise<
    ApiResponse<{
      data: IAlerta[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      };
    }>
  > {
    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return this.makeRequest(`${this.basePath}?${params.toString()}`);
  }

  // Obtener alertas activas
  async obtenerAlertasActivas(): Promise<
    ApiResponse<{
      data: IAlerta[];
      total: number;
    }>
  > {
    return this.makeRequest(`${this.basePath}/activas`);
  }

  // Obtener alertas por empresa
  async obtenerAlertasPorEmpresa(
    empresaId: string,
    incluirResueltas: boolean = false
  ): Promise<
    ApiResponse<{
      data: IAlerta[];
      total: number;
    }>
  > {
    const params = new URLSearchParams();
    params.append("incluirResueltas", incluirResueltas.toString());

    return this.makeRequest(
      `${this.basePath}/empresa/${empresaId}?${params.toString()}`
    );
  }

  // Obtener resumen de alertas
  async obtenerResumenAlertas(empresaId: string): Promise<
    ApiResponse<{
      data: IResumenAlertas;
    }>
  > {
    return this.makeRequest(`${this.basePath}/resumen/${empresaId}`);
  }

  // Crear nueva alerta
  async crearAlerta(datosAlerta: ICrearAlerta): Promise<
    ApiResponse<{
      data: IAlerta;
      message: string;
    }>
  > {
    return this.makeRequest(`${this.basePath}`, {
      method: "POST",
      body: JSON.stringify(datosAlerta),
    });
  }

  // Resolver alerta
  async resolverAlerta(
    alertaId: string,
    accionesTomadas?: string
  ): Promise<
    ApiResponse<{
      data: IAlerta;
      message: string;
    }>
  > {
    return this.makeRequest(`${this.basePath}/${alertaId}/resolver`, {
      method: "PUT",
      body: JSON.stringify({ accionesTomadas }),
    });
  }

  // Asignar alerta a técnico
  async asignarAlerta(
    alertaId: string,
    asignadoA: string
  ): Promise<
    ApiResponse<{
      data: IAlerta;
      message: string;
    }>
  > {
    return this.makeRequest(`${this.basePath}/${alertaId}/asignar`, {
      method: "PUT",
      body: JSON.stringify({ asignadoA }),
    });
  }

  // Eliminar alerta
  async eliminarAlerta(alertaId: string): Promise<
    ApiResponse<{
      message: string;
    }>
  > {
    return this.makeRequest(`${this.basePath}/${alertaId}`, {
      method: "DELETE",
    });
  }

  // Simular alerta (para desarrollo/testing)
  async simularAlerta(): Promise<
    ApiResponse<{
      data: IAlerta;
      message: string;
    }>
  > {
    return this.makeRequest(`${this.basePath}/simular`, {
      method: "POST",
      body: JSON.stringify({}),
    });
  }

  // Simular múltiples alertas
  async simularAlertasBatch(cantidad: number = 5): Promise<
    ApiResponse<{
      data: IAlerta[];
      message: string;
    }>
  > {
    return this.makeRequest(`${this.basePath}/simular-batch`, {
      method: "POST",
      body: JSON.stringify({ cantidad }),
    });
  }
}

export const alertasService = new AlertasService();
export default alertasService;
