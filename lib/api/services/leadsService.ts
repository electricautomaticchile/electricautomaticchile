import { BaseApiService } from "../utils/baseService";
import { ApiResponse } from "../types";

/**
 * Tipos de lead soportados por el backend (POST /api/leads).
 * Coincide con el contrato `CrearLeadRecipe` del backend:
 *   type oneof=investor distributor
 */
export type LeadType = "distributor" | "investor";

export interface CrearLeadData {
  type: LeadType;
  name: string;
  email: string;
  organization?: string;
  message?: string;
  /** Datos adicionales (teléfono, cantidad de medidores, etc.) */
  extra?: Record<string, unknown>;
  /** Token de Cloudflare Turnstile (opcional; el backend lo omite si no hay secret configurado) */
  turnstileToken?: string;
}

export interface LeadCreado {
  id: string;
  status: string;
  type: string;
  name: string;
  email: string;
}

/**
 * Servicio para el endpoint público de captura de leads de la landing.
 * Ruta backend: `POST {API_URL}/leads` (protegido con rate-limit y Turnstile opcional).
 */
export class LeadsService extends BaseApiService {
  async crearLead(
    data: CrearLeadData
  ): Promise<ApiResponse<LeadCreado>> {
    return this.makeRequest<LeadCreado>("/leads", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

// Exportar instancia única del servicio
export const leadsService = new LeadsService();
