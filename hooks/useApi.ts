import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/lib/api/apiService";
import { AuthUser, AuthResponse } from "@/types/auth";
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
  user: AuthUser | null;
  isAuthenticated: boolean;
  isRealAuthenticated: boolean;
  isLoading: boolean;
}

// Usuario temporal para desarrollo
const TEMP_USER: AuthUser = {
  id: "temp_user",
  email: "temp@example.com",
  name: "Usuario Temporal",
  role: "cliente",
  type: "cliente",
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
  private isInitializing: boolean = false;
  private hasInitialized: boolean = false;

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
    if (this.isInitializing || this.hasInitialized) {
      return;
    }

    this.isInitializing = true;

    try {
      const token = this.getStoredToken();

      if (!token) {
        this.setState({
          user: TEMP_USER,
          isAuthenticated: false,
          isRealAuthenticated: false,
          isLoading: false,
        });
        this.hasInitialized = true;
        return;
      }

      const savedUser = this.getStoredUser();
      if (savedUser) {
        this.setState({
          user: savedUser,
          isAuthenticated: true,
          isRealAuthenticated: true,
          isLoading: false,
        });
        this.hasInitialized = true;
        return;
      }

      const response = await apiService.getProfile();
      if (response.success && response.data) {
        this.setState({
          user: response.data,
          isAuthenticated: true,
          isRealAuthenticated: true,
          isLoading: false,
        });
        this.saveUser(response.data);
      } else {
        this.clearAuthData();
        this.setState({
          user: TEMP_USER,
          isAuthenticated: false,
          isRealAuthenticated: false,
          isLoading: false,
        });
      }
      this.hasInitialized = true;
    } catch (error) {
      this.setState({
        user: TEMP_USER,
        isAuthenticated: false,
        isRealAuthenticated: false,
        isLoading: false,
      });
      this.hasInitialized = true;
    } finally {
      this.isInitializing = false;
    }
  }



  async login(credentials: LoginCredentials): Promise<ApiAuthResponse> {
    try {
      const response = await apiService.login(credentials);
      if (response.success && response.data) {
        this.setState({
          user: response.data.user,
          isAuthenticated: true,
          isRealAuthenticated: true,
          isLoading: false,
        });
        this.saveUser(response.data.user);
      }
      return response;
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.logout();
    } catch (error) {
    } finally {
      this.clearAuthData();
      this.hasInitialized = false;
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
    const cookies = document.cookie.split(";");
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );
    return authCookie ? decodeURIComponent(authCookie.split("=")[1]) : null;
  }

  private getStoredUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const cookies = document.cookie.split(";");
    const userCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("user_data=")
    );
    if (!userCookie) return null;
    try {
      return JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
    } catch {
      return null;
    }
  }

  private saveUser(user: AuthUser): void {
    if (typeof window === "undefined") return;
    const isProduction = window.location.protocol === "https:";
    const cookieOptions = [
      `user_data=${encodeURIComponent(JSON.stringify(user))}`,
      "path=/",
      `max-age=${24 * 60 * 60}`,
      "samesite=strict",
    ];
    if (isProduction) {
      cookieOptions.push("secure");
    }
    document.cookie = cookieOptions.join("; ");
  }

  private clearAuthData(): void {
    if (typeof window === "undefined") return;
    const clearCookieOptions = [
      "path=/",
      "expires=Thu, 01 Jan 1970 00:00:00 GMT",
      "samesite=strict",
    ];
    if (window.location.protocol === "https:") {
      clearCookieOptions.push("secure");
    }
    document.cookie = `auth_token=; ${clearCookieOptions.join("; ")}`;
    document.cookie = `refresh_token=; ${clearCookieOptions.join("; ")}`;
    document.cookie = `user_data=; ${clearCookieOptions.join("; ")}`;
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
