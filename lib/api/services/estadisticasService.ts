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
}

// Exportar instancia única del servicio
export const estadisticasService = new EstadisticasService();
