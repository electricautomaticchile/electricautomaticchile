"use client";

import { useState, useEffect } from "react";
import { apiService, IUsuario } from "@/lib/api/apiService";

interface AuthUser extends IUsuario {
  // Campos adicionales para compatibilidad
  id?: string;
  image?: string;
  empresa?: string;
}

interface AuthSession {
  user: AuthUser;
  expires?: string;
}

interface AuthHook {
  data: AuthSession | null;
  status: "loading" | "authenticated" | "unauthenticated";
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthHook {
  // 🔓 MODO TEMPORAL: Usuario simulado para acceso sin autenticación
  const tempUser: AuthUser = {
    _id: "temp-user-id",
    id: "temp-user-id",
    nombre: "Usuario Temporal",
    email: "usuario@temporal.com",
    tipoUsuario: "empresa",
    role: "empresa",
    empresa: "Empresa Temporal",
  } as AuthUser;

  const [user, setUser] = useState<AuthUser | null>(tempUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🔓 COMENTADO: checkAuth automático
    // checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Verificar si hay token en localStorage
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiService.getProfile();
      if (response.success && response.data) {
        setUser(response.data as AuthUser);
      } else {
        // Token inválido, limpiar
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);

      if (response.success && response.data) {
        setUser(response.data.user as AuthUser);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Error al iniciar sesión",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  const session: AuthSession | null = user
    ? { user, expires: undefined }
    : null;
  const status = loading
    ? "loading"
    : user
    ? "authenticated"
    : "unauthenticated";

  return {
    data: session,
    status,
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.tipoUsuario === "admin" || user?.role === "admin" || false,
  };
}

// Hook alternativo con la misma API que useSession para fácil migración
export function useSession() {
  const auth = useAuth();
  return {
    data: auth.data,
    status: auth.status,
  };
}
