import { BaseApiService } from "../utils/baseService";
import {
  ApiResponse,
  IEmpresa,
  ICrearEmpresa,
  IActualizarEmpresa,
  CrearEmpresaResponse,
  ResetearPasswordEmpresaResponse,
} from "../types";

export class EmpresasService extends BaseApiService {
  async obtenerEmpresas(params?: {
    page?: number;
    limit?: number;
    estado?: string;
    ciudad?: string;
    region?: string;
    search?: string;
  }): Promise<ApiResponse<IEmpresa[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/empresas?${queryParams.toString()}`
      : "/empresas";

    return this.makeRequest<IEmpresa[]>(endpoint);
  }

  async obtenerEmpresa(id: string): Promise<ApiResponse<IEmpresa>> {
    return this.makeRequest<IEmpresa>(`/empresas/${id}`);
  }

  async crearEmpresa(datos: ICrearEmpresa): Promise<CrearEmpresaResponse> {
    return this.makeRequest("/empresas", {
      method: "POST",
      body: JSON.stringify(datos),
    }) as Promise<CrearEmpresaResponse>;
  }

  async actualizarEmpresa(
    id: string,
    datos: IActualizarEmpresa
  ): Promise<ApiResponse<IEmpresa>> {
    return this.makeRequest<IEmpresa>(`/empresas/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    });
  }

  async eliminarEmpresa(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/empresas/${id}`, {
      method: "DELETE",
    });
  }

  async cambiarEstadoEmpresa(
    id: string,
    estado: "activo" | "suspendido" | "inactivo",
    motivoSuspension?: string
  ): Promise<ApiResponse<IEmpresa>> {
    return this.makeRequest<IEmpresa>(`/empresas/${id}/cambiar-estado`, {
      method: "PUT",
      body: JSON.stringify({ estado, motivoSuspension }),
    });
  }

  async resetearPasswordEmpresa(
    id: string
  ): Promise<ResetearPasswordEmpresaResponse> {
    return this.makeRequest(`/empresas/${id}/resetear-password`, {
      method: "POST",
    }) as Promise<ResetearPasswordEmpresaResponse>;
  }

  async obtenerEstadisticasEmpresas(): Promise<
    ApiResponse<{
      totales: {
        total: number;
        activas: number;
        suspendidas: number;
        inactivas: number;
      };
      ultimas: IEmpresa[];
      porRegion: { _id: string; count: number }[];
    }>
  > {
    return this.makeRequest("/empresas/estadisticas");
  }
}

// Exportar instancia única del servicio
export const empresasService = new EmpresasService();
