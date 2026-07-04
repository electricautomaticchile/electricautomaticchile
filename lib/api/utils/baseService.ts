import { ApiResponse } from "../types";
import { API_URL } from "./config";
import { TokenManager } from "./tokenManager";
import { ensureCSRFToken } from "@/lib/utils/csrf";
import { sanitizeInput } from "@/lib/utils/sanitize";

const PUBLIC_AUTH_MUTATIONS = [
  "/auth/login",
  "/auth/login/empresa",
  "/auth/registro-empresa",
  "/auth/solicitar-recuperacion",
  "/auth/restablecer-password",
  "/auth/refresh",
  "/auth/refresh-token",
  // Captura pública de leads: no requiere CSRF (endpoint sin AuthMiddleware en el backend)
  "/leads",
];

function shouldAttachCSRF(method: string, endpoint: string) {
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(method)) return false;
  return !PUBLIC_AUTH_MUTATIONS.some((publicEndpoint) => endpoint === publicEndpoint);
}

// Clase base para servicios API
export class BaseApiService {
  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    const method = options.method || "GET";
    const needsCSRF = shouldAttachCSRF(method, endpoint);
    const csrfToken = needsCSRF
      ? await ensureCSRFToken()
      : "";

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (options.body instanceof FormData) {
      delete defaultHeaders["Content-Type"];
    }

    if (csrfToken && needsCSRF) {
      defaultHeaders['X-CSRF-Token'] = csrfToken;
    }

    const config: RequestInit = {
      ...options,
      credentials: 'include', // Enviar cookies HttpOnly automáticamente
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Si el token ha expirado, intentar renovarlo
        if (response.status === 401 && !endpoint.includes("/auth/refresh")) {
          try {
            await this.refreshAuthToken();
            const retryResponse = await fetch(url, config);
            const retryData = await retryResponse.json();

            if (retryResponse.ok) {
              return retryData;
            }
          } catch (refreshError) {
            // Si falla la renovación, limpiar sesión local y redirigir al login
            TokenManager.clearTokens();
            if (typeof window !== "undefined") {
              window.location.href = "/";
            }
          }
        }

        return {
          success: false,
          error: data.message || data.error || "Error en la solicitud",
          errors: data.errors,
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      };
    }
  }

  private async refreshAuthToken(): Promise<ApiResponse<unknown>> {
    return this.makeRequest<unknown>(
      "/auth/refresh-token",
      {
        method: "POST",
      }
    );
  }

  // Métodos de conveniencia para HTTP
  async get<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// Instancia por defecto para usar en los servicios
export const baseService = new BaseApiService();
