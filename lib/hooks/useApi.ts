import { useState, useEffect, useCallback, useMemo } from "react";
import { apiService, ApiResponse } from "../api/apiService";

// Hook para realizar llamadas API con estado de carga
export function useApiRequest<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (
      apiCall: () => Promise<ApiResponse<T>>
    ): Promise<ApiResponse<T> | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall();

        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || "Error desconocido");
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error de conexión";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// Hook específico para autenticación
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRealAuthenticated, setIsRealAuthenticated] = useState(false);

  // Usuario temporal para desarrollo
  const tempUser = useMemo(
    () => ({
      _id: "temp-user-id",
      id: "temp-user-id",
      nombre: "Usuario Temporal",
      email: "usuario@temporal.com",
      tipoUsuario: "empresa",
      role: "empresa",
      empresa: "Empresa Temporal",
    }),
    []
  );

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);

      // Verificar si hay token usando el mismo método que el apiService
      // Primero intentar localStorage, luego cookies
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("auth_token");

        // Si no está en localStorage, intentar obtener de cookies
        if (!token) {
          const cookies = document.cookie.split(";");
          for (let cookie of cookies) {
            const [name, value] = cookie.trim().split("=");
            if (name === "auth_token") {
              token = value;
              break;
            }
          }
        }
      }

      console.log("🔍 Token encontrado:", token ? "SÍ" : "NO");
      console.log("🔍 Longitud del token:", token?.length || 0);

      if (!token) {
        console.log("❌ No hay token, usando usuario temporal");
        setUser(tempUser); // Usuario temporal para desarrollo
        setIsAuthenticated(false);
        setIsRealAuthenticated(false);
        setLoading(false);
        return;
      }

      // Primero intentar obtener usuario de localStorage (más rápido)
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          console.log("✅ Usuario encontrado en localStorage:", userData);
          setUser(userData);
          setIsAuthenticated(true);
          setIsRealAuthenticated(true);
          setLoading(false);

          // Verificar perfil en segundo plano para sincronizar
          apiService
            .getProfile()
            .then((response) => {
              if (response.success && response.data) {
                setUser(response.data);
                localStorage.setItem("user", JSON.stringify(response.data));
              }
            })
            .catch((error) => {
              console.log("Error al verificar perfil en segundo plano:", error);
            });

          return;
        } catch (error) {
          console.log("Error al parsear usuario guardado:", error);
        }
      }

      // Si no hay usuario en localStorage, consultar API
      const response = await apiService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        setIsRealAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log("✅ Usuario autenticado desde API:", response.data);
      } else {
        // Token inválido, limpiar todo
        console.log("❌ Token inválido, limpiando datos");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        localStorage.removeItem("requiereCambioPassword");

        // Limpiar cookies también
        if (typeof window !== "undefined") {
          document.cookie =
            "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie =
            "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }

        setUser(tempUser);
        setIsAuthenticated(false);
        setIsRealAuthenticated(false);
      }
    } catch (error) {
      console.log("No hay sesión activa, usando usuario temporal");
      setUser(tempUser);
      setIsAuthenticated(false);
      setIsRealAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [tempUser]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);
      if (response.success && response.data) {
        console.log("✅ Login exitoso:", response.data);

        // Actualizar inmediatamente el estado local
        setUser(response.data.user);
        setIsAuthenticated(true);
        setIsRealAuthenticated(true);

        // Guardar usuario en localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Si requiere cambio de contraseña, guardarlo
        if (response.data.requiereCambioPassword) {
          localStorage.setItem("requiereCambioPassword", "true");
        }

        console.log("🎯 Estado actualizado:", {
          user: response.data.user,
          isAuthenticated: true,
          requiereCambioPassword: response.data.requiereCambioPassword || false,
        });
      }
      return response;
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, error: "Error de conexión" };
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
      setUser(tempUser); // Volver al usuario temporal
      setIsAuthenticated(false);
      setIsRealAuthenticated(false);

      // Limpiar localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      localStorage.removeItem("requiereCambioPassword");

      // Limpiar cookies
      if (typeof window !== "undefined") {
        document.cookie =
          "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie =
          "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/";
      }
    }
  };

  return {
    user,
    isAuthenticated: isRealAuthenticated, // Solo true con autenticación real
    loading,
    login,
    logout,
    checkAuthStatus,
    // Compatibilidad con el hook anterior
    data: user ? { user, expires: undefined } : null,
    status: loading
      ? "loading"
      : isRealAuthenticated
        ? "authenticated"
        : "unauthenticated",
    isAdmin:
      (isRealAuthenticated &&
        (user?.tipoUsuario === "admin" || user?.role === "admin")) ||
      false,
  };
}

// Hook para cotizaciones
export function useCotizaciones() {
  const { data, loading, error, execute } = useApiRequest();

  const obtenerCotizaciones = (params?: any) =>
    execute(() => apiService.obtenerCotizaciones(params));

  const obtenerCotizacion = (id: string) =>
    execute(() => apiService.obtenerCotizacion(id));

  const cambiarEstado = (id: string, estado: string, notas?: string) =>
    execute(() => apiService.cambiarEstadoCotizacion(id, estado, notas));

  const eliminar = (id: string) =>
    execute(() => apiService.eliminarCotizacion(id));

  return {
    cotizaciones: data,
    loading,
    error,
    obtenerCotizaciones,
    obtenerCotizacion,
    cambiarEstado,
    eliminar,
  };
}

// Hook para clientes
export function useClientes() {
  const { data, loading, error, execute } = useApiRequest();

  const obtenerClientes = (params?: any) =>
    execute(() => apiService.obtenerClientes(params));

  const obtenerCliente = (id: string) =>
    execute(() => apiService.obtenerCliente(id));

  const crear = (datos: any) => execute(() => apiService.crearCliente(datos));

  const actualizar = (id: string, datos: any) =>
    execute(() => apiService.actualizarCliente(id, datos));

  const eliminar = (id: string) =>
    execute(() => apiService.eliminarCliente(id));

  return {
    clientes: data,
    loading,
    error,
    obtenerClientes,
    obtenerCliente,
    crear,
    actualizar,
    eliminar,
  };
}

// Hook para configuración de API
export function useApiConfig() {
  const [config, setConfig] = useState({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
    isProduction: process.env.NODE_ENV === "production",
    isConnected: false,
  });

  const checkConnection = useCallback(async () => {
    try {
      const healthResponse = await fetch(`${config.baseUrl}/health`);
      const data = await healthResponse.json();

      setConfig((prev) => ({
        ...prev,
        isConnected: healthResponse.ok && data.status === "OK",
      }));

      return healthResponse.ok;
    } catch (error) {
      setConfig((prev) => ({ ...prev, isConnected: false }));
      return false;
    }
  }, [config.baseUrl]);

  useEffect(() => {
    checkConnection();
    // Verificar conexión cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  return {
    config,
    checkConnection,
  };
}
