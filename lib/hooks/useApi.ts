import { useState, useEffect, useCallback } from "react";
import { apiService } from "../api/apiService";
import { logger } from "../utils/logger";
import { UserProfile, AuthResponse } from "@/types/user";
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiAuthResponse {
  success: boolean;
  data?: AuthResponse;
  error?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isRealAuthenticated: boolean;
  isLoading: boolean;
}

// Usuario temporal para desarrollo
const TEMP_USER: UserProfile = {
  id: "temp_user",
  email: "temp@example.com",
  name: "Usuario Temporal",
  role: "client",
  type: "client",
  isActive: true,
};

class AuthManager {
  private static instance: AuthManager;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isRealAuthenticated: false,
    isLoading: true,
  };
  private listeners: Array<(state: AuthState) => void> = [];

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.authState));
  }

  getState(): AuthState {
    return { ...this.authState };
  }

  setState(newState: Partial<AuthState>): void {
    this.authState = { ...this.authState, ...newState };
    this.notify();
  }

  async initializeAuth(): Promise<void> {
    try {
      const token = this.getStoredToken();

      logger.info("Inicializando autenticación", "AuthManager", {
        hasToken: !!token,
        tokenLength: token?.length || 0,
      });

      if (!token) {
        logger.info("No hay token, usando usuario temporal", "AuthManager");
        this.setState({
          user: TEMP_USER,
          isAuthenticated: false,
          isRealAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      // Verificar si hay usuario guardado en localStorage
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          logger.info(
            "Usuario encontrado en localStorage",
            "AuthManager",
            userData
          );

          this.setState({
            user: userData,
            isAuthenticated: true,
            isRealAuthenticated: true,
            isLoading: false,
          });

          // Verificar perfil en segundo plano
          this.verifyProfileInBackground();
          return;
        } catch (error) {
          logger.error("Error al parsear usuario guardado", "AuthManager", {
            error,
          });
        }
      }

      // Verificar token con el servidor
      const response = await apiService.getProfile();
      if (response.success && response.data) {
        this.setState({
          user: response.data,
          isAuthenticated: true,
          isRealAuthenticated: true,
          isLoading: false,
        });

        localStorage.setItem("user", JSON.stringify(response.data));
        logger.info(
          "Usuario autenticado desde API",
          "AuthManager",
          response.data as unknown as Record<string, unknown>
        );
      } else {
        // Token inválido, limpiar todo
        logger.warn("Token inválido, limpiando datos", "AuthManager");
        this.clearAuthData();
        this.setState({
          user: TEMP_USER,
          isAuthenticated: false,
          isRealAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      logger.error("Error en inicialización de auth", "AuthManager", { error });
      this.setState({
        user: TEMP_USER,
        isAuthenticated: false,
        isRealAuthenticated: false,
        isLoading: false,
      });
    }
  }

  private async verifyProfileInBackground(): Promise<void> {
    try {
      const response = await apiService.getProfile();
      if (response.success && response.data) {
        this.setState({ user: response.data });
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      logger.warn("Error al verificar perfil en segundo plano", "AuthManager", {
        error,
      });
    }
  }

  async login(credentials: LoginCredentials): Promise<ApiAuthResponse> {
    try {
      const response = await apiService.login(credentials);
      if (response.success && response.data) {
        logger.info(
          "Login exitoso",
          "AuthManager",
          response.data as unknown as Record<string, unknown>
        );

        this.setState({
          user: response.data.user,
          isAuthenticated: true,
          isRealAuthenticated: true,
          isLoading: false,
        });

        // Guardar datos en localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));

        logger.info("Estado actualizado", "AuthManager", {
          user: response.data.user,
          isAuthenticated: true,
        });
      }

      return response;
    } catch (error) {
      logger.error("Error en login", "AuthManager", { error });
      return { success: false, error: "Error de conexión" };
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.logout();
    } catch (error) {
      logger.error("Error durante logout", "AuthManager", { error });
    } finally {
      this.clearAuthData();
      this.setState({
        user: TEMP_USER,
        isAuthenticated: false,
        isRealAuthenticated: false,
        isLoading: false,
      });
    }
  }

  private getStoredToken(): string | null {
    if (typeof window === "undefined") return null;

    // Intentar obtener de cookies primero
    const cookies = document.cookie.split(";");
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );

    if (authCookie) {
      return authCookie.split("=")[1];
    }

    // Fallback a localStorage
    return localStorage.getItem("auth_token");
  }

  private clearAuthData(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    // Limpiar cookies
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}

export function useApi() {
  const authManager = AuthManager.getInstance();
  const [authState, setAuthState] = useState<AuthState>(authManager.getState());

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);

    // Inicializar autenticación si no se ha hecho
    if (authState.isLoading) {
      authManager.initializeAuth();
    }

    return unsubscribe;
  }, [authManager, authState.isLoading]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<ApiAuthResponse> => {
      return authManager.login(credentials);
    },
    [authManager]
  );

  const logout = useCallback(async (): Promise<void> => {
    return authManager.logout();
  }, [authManager]);

  const refreshAuth = useCallback(async (): Promise<void> => {
    return authManager.initializeAuth();
  }, [authManager]);

  return {
    // Estado de autenticación
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isRealAuthenticated: authState.isRealAuthenticated,
    isLoading: authState.isLoading,

    // Métodos de autenticación
    login,
    logout,
    refreshAuth,

    // Estado derivado
    isLoggedIn: authState.isAuthenticated,
    userRole: authState.user?.role,
    userType: authState.user?.type,
    userName: authState.user?.name,
    userEmail: authState.user?.email,
  };
}
