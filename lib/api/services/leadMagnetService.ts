import { BaseApiService } from "../utils/baseService";
import { ApiResponse } from "../types";

export class LeadMagnetService extends BaseApiService {
  async enviarLeadMagnet(datos: {
    email: string;
    nombre?: string;
    empresa?: string;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest<any>("/lead-magnet/enviar-pdf", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  }

  async obtenerEstadisticasLeads(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>("/lead-magnet/estadisticas");
  }
}

// Exportar instancia única del servicio
export const leadMagnetService = new LeadMagnetService();
