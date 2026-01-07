import { BaseApiService } from "../utils/baseService";
import { ApiResponse, ICliente } from "../types";
import { PaginatedResponse, PaginationParams, buildPaginationQuery } from "@/types/pagination";
import { FilterParams, buildFilterQuery, combineQueryParams } from "@/types/filters";

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

  async obtenerClientesPaginado(
    params: PaginationParams,
    filters?: FilterParams
  ): Promise<ApiResponse<PaginatedResponse<ICliente>>> {
    const paginationQuery = buildPaginationQuery(params);
    const filterQuery = filters ? buildFilterQuery(filters) : "";
    const query = combineQueryParams(paginationQuery, filterQuery);
    
    return this.makeRequest<PaginatedResponse<ICliente>>(`/clientes?${query}`);
  }

  async obtenerCliente(id: string): Promise<ApiResponse<ICliente>> {
    return this.makeRequest<ICliente>(`/clientes/${id}`);
  }

  async crearCliente(datos: Partial<ICliente>): Promise<ApiResponse<ICliente>> {
    const cookies = document.cookie.split(";");
    const userCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("user_data=")
    );
    
    let empresaId = "";
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
        empresaId = userData.empresaId || userData._id || userData.id || "";
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    const datosConEmpresa = {
      ...datos,
      empresaId: empresaId,
    };

    return this.makeRequest<ICliente>("/clientes", {
      method: "POST",
      body: JSON.stringify(datosConEmpresa),
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
