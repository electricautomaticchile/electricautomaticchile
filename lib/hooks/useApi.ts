import { useState, useEffect, useCallback } from "react";
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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("No hay sesión activa");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const response = await apiService.login(credentials);
    if (response.success && response.data) {
      setUser(response.data.user);
      setIsAuthenticated(true);
    }
    return response;
  };

  const logout = async () => {
    await apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
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
