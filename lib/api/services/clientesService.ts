import { BaseApiService } from "../utils/baseService";
import { ApiResponse, ICliente } from "../types";

export class ClientesService extends BaseApiService {
  async obtenerClientes(params?: {
    page?: number;
    limit?: number;
    tipoCliente?: string;
    ciudad?: string;
  }): Promise<ApiResponse<ICliente[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/clientes?${queryParams.toString()}`
      : "/clientes";

    return this.makeRequest<ICliente[]>(endpoint);
  }

  async obtenerCliente(id: string): Promise<ApiResponse<ICliente>> {
    return this.makeRequest<ICliente>(`/clientes/${id}`);
  }

  async crearCliente(datos: Partial<ICliente>): Promise<ApiResponse<ICliente>> {
    return this.makeRequest<ICliente>("/clientes", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  }

  async actualizarCliente(
    id: string,
    datos: Partial<ICliente>
  ): Promise<ApiResponse<ICliente>> {
    return this.makeRequest<ICliente>(`/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    });
  }

  async eliminarCliente(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/clientes/${id}`, {
      method: "DELETE",
    });
  }
}

// Exportar instancia única del servicio
export const clientesService = new ClientesService();
