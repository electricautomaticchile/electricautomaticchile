import { baseService } from "../utils/baseService";
import { ApiResponse } from "../types";
import { API_BASE_URL } from "../utils/config";
import { ensureCSRFToken } from "@/lib/utils/csrf";

export interface IConfiguracion {
  id: string;
  empresaId: string;
  notificaciones: {
    emails: string[];
    enviarResumenDiario: boolean;
  };
  umbrales: {
    consumoMaximo: number;
    desconexionAutomatica: boolean;
  };
  logoUrl?: string;
  coloresTema?: {
    primario: string;
    secundario: string;
  };
  tipo?: "general" | "empresa" | "sistema";
}

export interface IConfiguracionRequest {
  clave: string;
  valor: any;
  categoria: string;
  descripcion?: string;
  esPublica?: boolean;
  editablePorEmpresa?: boolean;
  tipo?: "general" | "empresa" | "sistema";
}

// Interfaz para el servicio de configuración
interface ConfigurationData {
  // Define aquí los campos de la configuración
  id: string;
  nombreEmpresa: string;
  // ... otros campos
}

class ConfiguracionService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const url = `${API_URL}/api${endpoint}`;
	      const defaultHeaders: HeadersInit = {
	        "Content-Type": "application/json",
	      };
	
	      const method = options.method || "GET";
	      if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
	        const csrfToken = await ensureCSRFToken();
	        if (csrfToken) {
	          defaultHeaders["X-CSRF-Token"] = csrfToken;
	        }
	      }
	
	      const config: RequestInit = {
	        ...options,
	        credentials: "include",
	        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || "Error en la solicitud",
        };
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      };
    }
  }

  async obtenerConfiguraciones(
    categoria: string,
    empresaId?: string
  ): Promise<IConfiguracion[]> {
    try {
      const params = new URLSearchParams({ categoria });
      if (empresaId) params.append("empresaId", empresaId);
      const response = await this.makeRequest<IConfiguracion[]>(
        `/configuracion?${params.toString()}`
      );

      if (response.success) {
        return response.data || [];
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  async establecerConfiguracion(
    configuracion: IConfiguracionRequest,
    empresaId?: string
  ): Promise<IConfiguracion | null> {
    try {
      const data = { ...configuracion, ...(empresaId && { empresaId }) };
      const response = await this.makeRequest<IConfiguracion>(
        "/configuracion",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (response.success) {
        return response.data || null;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async actualizarConfiguraciones(
    configuraciones: IConfiguracionRequest[],
    empresaId?: string
  ): Promise<any> {
    try {
      const data = { configuraciones, ...(empresaId && { empresaId }) };
      const response = await this.makeRequest("/configuracion/batch", {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (response.success) {
        return response.data || { exitosasCount: 0, errores: [] };
      } else {
        return { exitosasCount: 0, errores: [response.error] };
      }
    } catch (error) {
      return {
        exitosasCount: 0,
        errores: [error instanceof Error ? error.message : "Error desconocido"],
      };
    }
  }

  async getConfiguration(
    empresaId: string
  ): Promise<ApiResponse<IConfiguracion>> {
    return baseService.get(`/configuracion/${empresaId}`);
  }

  async updateConfiguration(
    empresaId: string,
    data: Partial<IConfiguracion>
  ): Promise<ApiResponse<IConfiguracion>> {
    return baseService.put(`/configuracion/${empresaId}`, data);
  }

  async uploadLogo(
    empresaId: string,
    logo: File
  ): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("logo", logo);

    const endpoint = `/configuracion/${empresaId}/logo`;
	    const url = `${API_BASE_URL}/api${endpoint}`;
	
	    try {
	      const csrfToken = await ensureCSRFToken();
	      const headers: HeadersInit = csrfToken ? { "X-CSRF-Token": csrfToken } : {};
	
	      const response = await fetch(url, {
	        method: "POST",
	        body: formData,
	        headers,
	        credentials: "include",
	      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || "Error al subir logo" };
      }
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      };
    }
  }
}

export const configuracionService = new ConfiguracionService();
