import { ApiResponse } from "../types";
import { API_URL } from "./config";
import { TokenManager } from "./tokenManager";

// Clase base para servicios API
export class BaseApiService {
  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    const token = TokenManager.getToken();

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
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
        if (response.status === 401 && token) {
          try {
            await this.refreshAuthToken();
            // Reintentar la solicitud original con el nuevo token
            const newToken = TokenManager.getToken();
            if (newToken) {
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${newToken}`,
              };
              const retryResponse = await fetch(url, config);
              const retryData = await retryResponse.json();

              if (retryResponse.ok) {
                return retryData;
              }
            }
          } catch (refreshError) {
            // Si falla la renovación, limpiar tokens y redirigir al login
            TokenManager.clearTokens();
            if (typeof window !== "undefined") {
              window.location.href = "/auth/login";
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
      console.error("API Request Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      };
    }
  }

  private async refreshAuthToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.makeRequest<{ token: string }>(
      "/auth/refresh-token",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (response.success && response.data) {
      TokenManager.setToken(response.data.token);
    }

    return response;
  }
}
