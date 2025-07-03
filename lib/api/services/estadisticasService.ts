import { BaseApiService } from "../utils/baseService";
import { ApiResponse } from "../types";

export class EstadisticasService extends BaseApiService {
  async obtenerEstadisticasConsumoCliente(
    clienteId: string,
    params?: {
      periodo?: "mensual" | "diario" | "horario";
      año?: number;
      mes?: number;
    }
  ): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/estadisticas/consumo-electrico/${clienteId}?${queryParams.toString()}`
      : `/estadisticas/consumo-electrico/${clienteId}`;

    return this.makeRequest<any>(endpoint);
  }

  async obtenerEstadisticasGlobales(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>("/estadisticas/globales");
  }

  async obtenerConsumoSectorial(
    empresaId: string,
    filtros?: {
      subtipo?: "equipamiento" | "area" | "horario";
      periodo?: string;
    }
  ): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (filtros?.subtipo) params.append("subtipo", filtros.subtipo);
    if (filtros?.periodo) params.append("periodo", filtros.periodo);

    const endpoint = `/reportes/consumo-sectorial${
      filtros?.subtipo ? `/${filtros.subtipo}` : ""
    }?empresaId=${empresaId}&${params.toString()}`;

    return this.makeRequest<any>(endpoint);
  }
}

// Exportar instancia única del servicio
export const estadisticasService = new EstadisticasService();
