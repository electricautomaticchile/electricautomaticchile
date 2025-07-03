import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  ArduinoStatus,
  StatsData,
  LoadingStates,
  UseControlArduinoConfig,
  FlaskResponse,
  ArduinoEvent,
} from "./types";
import {
  FLASK_CONFIG,
  FLASK_ENDPOINTS,
  DEFAULT_ARDUINO_STATUS,
  DEFAULT_STATS_DATA,
  DEFAULT_LOADING_STATES,
  DEFAULT_AUTO_REFRESH,
  SYSTEM_MESSAGES,
  TIMEOUTS,
  DEBUG_CONFIG,
} from "./config";

export function useControlArduino(config: UseControlArduinoConfig = {}) {
  // Configuración con valores por defecto
  const {
    autoRefresh: initialAutoRefresh = DEFAULT_AUTO_REFRESH.enabled,
    refreshInterval = DEFAULT_AUTO_REFRESH.interval,
    baseUrl = FLASK_CONFIG.baseUrl,
  } = config;

  // Estados principales
  const [status, setStatus] = useState<ArduinoStatus>(DEFAULT_ARDUINO_STATUS);
  const [stats, setStats] = useState<StatsData>(DEFAULT_STATS_DATA);
  const [loading, setLoading] = useState<LoadingStates>(DEFAULT_LOADING_STATES);
  const [autoRefresh, setAutoRefresh] = useState(initialAutoRefresh);
  const [events, setEvents] = useState<ArduinoEvent[]>([]);

  const { toast } = useToast();

  // Log para debug
  const debugLog = useCallback((message: string, data?: any) => {
    if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.enableConsoleLog) {
      console.log(`[Arduino] ${message}`, data || "");
    }
  }, []);

  // Función para hacer requests a Flask con timeout y retry
  const makeFlaskRequest = useCallback(
    async (
      endpoint: string,
      options: RequestInit = {},
      timeout = TIMEOUTS.connection
    ): Promise<FlaskResponse> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        debugLog(`Making request to: ${baseUrl}${endpoint}`);

        const response = await fetch(`${baseUrl}${endpoint}`, {
          ...options,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        debugLog(`Response received:`, data);

        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        debugLog(`Request failed:`, error);

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            throw new Error(SYSTEM_MESSAGES.connection.timeout);
          }
          throw error;
        }
        throw new Error("Error desconocido");
      }
    },
    [baseUrl, debugLog]
  );

  // Función para obtener el estado del Arduino
  const fetchStatus = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, connection: true }));

      const response = await makeFlaskRequest(FLASK_ENDPOINTS.status);

      // Extraer datos del status (Flask devuelve directamente el objeto, no en una respuesta wrapper)
      const statusData: ArduinoStatus = response as unknown as ArduinoStatus;
      setStatus(statusData);
      debugLog("Status updated:", statusData);

      // Registrar evento
      const event: ArduinoEvent = {
        type: "status",
        timestamp: new Date(),
        data: statusData,
        source: "system",
      };
      setEvents((prev) => [event, ...prev.slice(0, 49)]); // Mantener últimos 50 eventos
    } catch (error) {
      debugLog("Error fetching status:", error);

      // Estado por defecto si Flask no está disponible
      setStatus({
        connected: false,
        port: "",
        led_status: "DESCONOCIDO",
        recent_messages: [
          `Error: ${error instanceof Error ? error.message : "Servidor Flask no disponible"}`,
        ],
      });
    } finally {
      setLoading((prev) => ({ ...prev, connection: false }));
    }
  }, [makeFlaskRequest, debugLog]);

  // Función para obtener estadísticas
  const fetchStats = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, stats: true }));

      const response = await makeFlaskRequest(
        FLASK_ENDPOINTS.stats,
        {},
        TIMEOUTS.stats
      );

      // Convertir formato de Flask a formato esperado
      const statsData = response as any; // Datos crudos de Flask
      const transformedStats: StatsData = {
        total_commands: statsData.total_commands || 0,
        on_commands: statsData.on_commands || 0,
        total_duration: statsData.total_time_on || 0,
        avg_duration: statsData.avg_session_time || 0,
        efficiency_percentage:
          Math.min((statsData.avg_session_time / 86400) * 100, 100) || 0,
      };

      setStats(transformedStats);
      debugLog("Stats updated:", transformedStats);
    } catch (error) {
      debugLog("Error fetching stats:", error);

      // Stats por defecto si Flask no está disponible
      setStats(DEFAULT_STATS_DATA);
    } finally {
      setLoading((prev) => ({ ...prev, stats: false }));
    }
  }, [makeFlaskRequest, debugLog]);

  // Función para conectar Arduino
  const connectArduino = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, connection: true }));

      const data = await makeFlaskRequest(
        FLASK_ENDPOINTS.connect,
        {
          method: "POST",
          body: JSON.stringify({}),
        },
        TIMEOUTS.connection
      );

      if (data.success) {
        toast({
          title: "Conexión exitosa",
          description: data.message || SYSTEM_MESSAGES.connection.success,
        });

        await fetchStatus();

        // Registrar evento
        const event: ArduinoEvent = {
          type: "connection",
          timestamp: new Date(),
          data: { action: "connect", success: true },
          source: "web",
        };
        setEvents((prev) => [event, ...prev.slice(0, 49)]);
      } else {
        throw new Error(data.message || SYSTEM_MESSAGES.connection.error);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : SYSTEM_MESSAGES.connection.serverError;

      toast({
        title: "Error de conexión",
        description: errorMessage,
        variant: "destructive",
      });

      debugLog("Connection error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, connection: false }));
    }
  }, [makeFlaskRequest, fetchStatus, toast, debugLog]);

  // Función para desconectar Arduino
  const disconnectArduino = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, connection: true }));

      const data = await makeFlaskRequest(FLASK_ENDPOINTS.disconnect, {
        method: "POST",
      });

      toast({
        title: data.success ? "Desconectado" : "Error",
        description:
          data.message ||
          (data.success
            ? SYSTEM_MESSAGES.connection.disconnected
            : SYSTEM_MESSAGES.connection.error),
        variant: data.success ? "default" : "destructive",
      });

      if (data.success) {
        await fetchStatus();

        // Registrar evento
        const event: ArduinoEvent = {
          type: "connection",
          timestamp: new Date(),
          data: { action: "disconnect", success: true },
          source: "web",
        };
        setEvents((prev) => [event, ...prev.slice(0, 49)]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: SYSTEM_MESSAGES.connection.serverError,
        variant: "destructive",
      });

      debugLog("Disconnect error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, connection: false }));
    }
  }, [makeFlaskRequest, fetchStatus, toast, debugLog]);

  // Función para controlar LED
  const controlLed = useCallback(
    async (action: string) => {
      if (!status.connected) {
        toast({
          title: "Arduino no conectado",
          description: SYSTEM_MESSAGES.commands.notConnected,
          variant: "destructive",
        });
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, control: true }));

        const data = await makeFlaskRequest(
          FLASK_ENDPOINTS.control(action),
          { method: "POST" },
          TIMEOUTS.command
        );

        toast({
          title: data.success ? "Comando enviado" : "Error",
          description:
            data.message ||
            (data.success
              ? SYSTEM_MESSAGES.commands.success
              : SYSTEM_MESSAGES.commands.error),
          variant: data.success ? "default" : "destructive",
        });

        if (data.success) {
          await fetchStatus();
          await fetchStats();

          // Registrar evento
          const event: ArduinoEvent = {
            type: "command",
            timestamp: new Date(),
            data: { action, success: true },
            source: "web",
          };
          setEvents((prev) => [event, ...prev.slice(0, 49)]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: SYSTEM_MESSAGES.commands.error,
          variant: "destructive",
        });

        debugLog("Control command error:", error);
      } finally {
        setLoading((prev) => ({ ...prev, control: false }));
      }
    },
    [
      status.connected,
      makeFlaskRequest,
      fetchStatus,
      fetchStats,
      toast,
      debugLog,
    ]
  );

  // Función para exportar datos
  const exportData = useCallback(
    async (format: string, days: number) => {
      try {
        setLoading((prev) => ({ ...prev, export: true }));

        toast({
          title: "Generando exportación",
          description: SYSTEM_MESSAGES.export.generating,
        });

        // Abrir enlace de descarga
        const url = `${baseUrl}${FLASK_ENDPOINTS.export(format, days)}`;
        window.open(url, "_blank");

        toast({
          title: "Descarga iniciada",
          description: SYSTEM_MESSAGES.export.success,
        });

        debugLog(`Export requested: ${format}, ${days} days`);
      } catch (error) {
        toast({
          title: "Error de exportación",
          description: SYSTEM_MESSAGES.export.error,
          variant: "destructive",
        });

        debugLog("Export error:", error);
      } finally {
        setLoading((prev) => ({ ...prev, export: false }));
      }
    },
    [baseUrl, toast, debugLog]
  );

  // Toggle auto-refresh
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh((prev) => {
      const newValue = !prev;
      debugLog(`Auto-refresh ${newValue ? "enabled" : "disabled"}`);
      return newValue;
    });
  }, [debugLog]);

  // Auto-refresh con intervalo configurable
  useEffect(() => {
    if (autoRefresh) {
      debugLog(`Auto-refresh started with interval: ${refreshInterval}ms`);

      const interval = setInterval(() => {
        fetchStatus();
        fetchStats();
      }, refreshInterval);

      return () => {
        clearInterval(interval);
        debugLog("Auto-refresh stopped");
      };
    }
  }, [autoRefresh, refreshInterval, fetchStatus, fetchStats, debugLog]);

  // Cargar datos iniciales
  useEffect(() => {
    debugLog("Initializing Arduino hook");
    fetchStatus();
    fetchStats();
  }, [fetchStatus, fetchStats, debugLog]);

  // Función para refrescar todo manualmente
  const refresh = useCallback(async () => {
    debugLog("Manual refresh triggered");
    await Promise.all([fetchStatus(), fetchStats()]);
  }, [fetchStatus, fetchStats, debugLog]);

  // Función para limpiar eventos
  const clearEvents = useCallback(() => {
    setEvents([]);
    debugLog("Events cleared");
  }, [debugLog]);

  // Estado combinado para facilitar el uso
  const isConnected = status.connected;
  const isLoading = Object.values(loading).some(Boolean);
  const hasRecentActivity = status.recent_messages.length > 0;
  const ledStatus = status.led_status;

  return {
    // Estados principales
    status,
    stats,
    loading,
    autoRefresh,
    events,

    // Estados derivados
    isConnected,
    isLoading,
    hasRecentActivity,
    ledStatus,

    // Acciones
    connectArduino,
    disconnectArduino,
    controlLed,
    exportData,
    toggleAutoRefresh,
    refresh,
    clearEvents,

    // Estado de carga específico
    isConnecting: loading.connection,
    isControlling: loading.control,
    isLoadingStats: loading.stats,
    isExporting: loading.export,
  };
}

// Hook simplificado para casos básicos
export function useControlArduinoSimple() {
  const { status, stats, isConnected, isLoading, controlLed } =
    useControlArduino();

  return {
    status,
    stats,
    isConnected,
    isLoading,
    controlLed,
  };
}

// Hook solo para estado (sin acciones)
export function useArduinoStatus() {
  const { status, isConnected, ledStatus, hasRecentActivity } =
    useControlArduino({ autoRefresh: true });

  return {
    status,
    isConnected,
    ledStatus,
    hasRecentActivity,
  };
}
