import { BaseApiService } from "../utils/baseService";
import { TokenManager } from "../utils/tokenManager";
import {
  ApiResponse,
  IUsuario,
  LoginCredentials,
  AuthResponse,
} from "../types";

export class AuthService extends BaseApiService {
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      TokenManager.setToken(response.data.token);
      TokenManager.setRefreshToken(response.data.refreshToken);
      TokenManager.setUser(response.data.user);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.makeRequest("/auth/logout", {
      method: "POST",
    });

    TokenManager.clearTokens();
    return response;
  }

  async getProfile(): Promise<ApiResponse<IUsuario>> {
    return this.makeRequest<IUsuario>("/auth/me");
  }

  async cambiarPassword(
    passwordActual: string,
    passwordNueva: string
  ): Promise<ApiResponse<{ passwordTemporal?: boolean }>> {
    return this.makeRequest("/auth/cambiar-password", {
      method: "POST",
      body: JSON.stringify({ passwordActual, passwordNueva }),
    });
  }

  async solicitarRecuperacion(
    emailOrNumeroCliente: string
  ): Promise<ApiResponse<any>> {
    return this.makeRequest("/auth/solicitar-recuperacion", {
      method: "POST",
      body: JSON.stringify({ emailOrNumeroCliente }),
    });
  }

  async restablecerPassword(
    token: string,
    nuevaPassword: string
  ): Promise<ApiResponse<{ numeroCliente: string; tipoUsuario: string }>> {
    return this.makeRequest("/auth/restablecer-password", {
      method: "POST",
      body: JSON.stringify({ token, nuevaPassword }),
    });
  }
}

// Exportar instancia única del servicio
export const authService = new AuthService();
