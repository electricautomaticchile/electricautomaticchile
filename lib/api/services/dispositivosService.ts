import { BaseApiService } from "../utils/baseService";
import { ApiResponse } from "../types";

export class DispositivosService extends BaseApiService {
  async obtenerDispositivos(params?: {
    cliente?: string;
    estado?: string;
    tipoDispositivo?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/dispositivos?${queryParams.toString()}`
      : "/dispositivos";

    return this.makeRequest<any[]>(endpoint);
  }

  async obtenerDispositivo(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/dispositivos/${id}`);
  }

  async crearDispositivo(datos: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>("/dispositivos", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  }

  async agregarLecturaDispositivo(
    id: string,
    lecturas: any[]
  ): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/dispositivos/${id}/lecturas`, {
      method: "POST",
      body: JSON.stringify({ lecturas }),
    });
  }

  async controlarDispositivo(
    id: string,
    accion: "shutdown" | "restart" | "toggle" | "on" | "off"
  ): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/dispositivos/${id}/control`, {
      method: "POST",
      body: JSON.stringify({ accion }),
    });
  }
}

// Exportar instancia única del servicio
export const dispositivosService = new DispositivosService();
