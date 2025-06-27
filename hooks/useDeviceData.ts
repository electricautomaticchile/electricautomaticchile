import { useState, useEffect, useCallback } from "react";
import { useWebSocket } from "./useWebSocket";
import { apiService } from "@/lib/api/apiService";

interface DeviceData {
  deviceId: string;
  timestamp: string;
  lecturas: Array<{
    valor: number;
    unidad: string;
    esVoltaje?: boolean;
    esAmperaje?: boolean;
    esPotencia?: boolean;
    esConsumo?: boolean;
  }>;
}

interface DeviceAlert {
  deviceId: string;
  timestamp: string;
  tipoAlerta: string;
  mensaje: string;
  esResuelta: boolean;
}

interface UseDeviceDataOptions {
  clienteId: string;
  autoConnect?: boolean;
  pollInterval?: number;
}

export const useDeviceData = (options: UseDeviceDataOptions) => {
  const { clienteId, autoConnect = true, pollInterval = 30000 } = options;

  const [devices, setDevices] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<Map<string, DeviceData[]>>(
    new Map()
  );
  const [alerts, setAlerts] = useState<DeviceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    connectionStatus,
    connect,
    authenticate,
    joinClientRoom,
    on,
    sendDeviceCommand,
  } = useWebSocket({ autoConnect });

  // Cargar dispositivos iniciales
  const loadDevices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.obtenerDispositivos({
        cliente: clienteId,
        estado: "activo",
      });

      if (response.success && response.data) {
        setDevices(response.data);
      } else {
        setError(response.message || "Error al cargar dispositivos");
      }
    } catch (err) {
      console.error("Error cargando dispositivos:", err);
      setError("Error de conexión al cargar dispositivos");
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  // Configurar autenticación y sala cuando se conecte
  useEffect(() => {
    if (connectionStatus.connected && !connectionStatus.authenticated) {
      // Obtener token de localStorage
      const token = localStorage.getItem("auth_token");
      if (token) {
        authenticate(token);
      }
    }

    if (connectionStatus.authenticated) {
      joinClientRoom(clienteId);
    }
  }, [connectionStatus, authenticate, joinClientRoom, clienteId]);

  // Suscribirse a eventos de WebSocket
  useEffect(() => {
    if (!connectionStatus.authenticated) return;

    // Manejar datos de dispositivos en tiempo real
    const unsubscribeDeviceData = on("device-data", (data: DeviceData) => {
      console.log("📊 Datos de dispositivo recibidos:", data);

      setDeviceData((prev) => {
        const newMap = new Map(prev);
        const deviceHistory = newMap.get(data.deviceId) || [];

        // Mantener solo los últimos 100 registros por dispositivo
        const updatedHistory = [...deviceHistory, data].slice(-100);
        newMap.set(data.deviceId, updatedHistory);

        return newMap;
      });
    });

    // Manejar alertas de dispositivos
    const unsubscribeDeviceAlert = on("device-alert", (alert: DeviceAlert) => {
      console.log("🚨 Alerta de dispositivo:", alert);

      setAlerts((prev) => {
        // Evitar duplicados basados en timestamp y deviceId
        const exists = prev.some(
          (a) =>
            a.deviceId === alert.deviceId && a.timestamp === alert.timestamp
        );

        if (!exists) {
          return [alert, ...prev].slice(0, 50); // Mantener últimas 50 alertas
        }
        return prev;
      });
    });

    // Manejar actualizaciones de estadísticas
    const unsubscribeStatsUpdate = on("statistics-update", (stats: any) => {
      console.log("📈 Actualización de estadísticas:", stats);
      // Aquí se podría actualizar un estado global de estadísticas
    });

    return () => {
      unsubscribeDeviceData();
      unsubscribeDeviceAlert();
      unsubscribeStatsUpdate();
    };
  }, [connectionStatus.authenticated, on]);

  // Polling de datos como fallback
  useEffect(() => {
    if (!autoConnect) return;

    loadDevices();

    const pollTimer = setInterval(() => {
      if (!connectionStatus.connected) {
        // Si no hay conexión WebSocket, usar polling
        loadDevices();
      }
    }, pollInterval);

    return () => clearInterval(pollTimer);
  }, [loadDevices, connectionStatus.connected, pollInterval, autoConnect]);

  // Funciones de utilidad
  const getDeviceById = useCallback(
    (deviceId: string) => {
      return devices.find(
        (device) => device._id === deviceId || device.idDispositivo === deviceId
      );
    },
    [devices]
  );

  const getDeviceHistory = useCallback(
    (deviceId: string) => {
      return deviceData.get(deviceId) || [];
    },
    [deviceData]
  );

  const getLatestReading = useCallback(
    (deviceId: string, type?: string) => {
      const history = deviceData.get(deviceId) || [];
      const latest = history[history.length - 1];

      if (!latest) return null;

      if (type) {
        const reading = latest.lecturas.find((lectura) => {
          switch (type) {
            case "consumo":
              return lectura.esConsumo;
            case "voltaje":
              return lectura.esVoltaje;
            case "amperaje":
              return lectura.esAmperaje;
            case "potencia":
              return lectura.esPotencia;
            default:
              return false;
          }
        });
        return reading || null;
      }

      return latest.lecturas[0] || null;
    },
    [deviceData]
  );

  const getUnresolvedAlerts = useCallback(() => {
    return alerts.filter((alert) => !alert.esResuelta);
  }, [alerts]);

  const sendCommand = useCallback(
    (deviceId: string, command: string) => {
      sendDeviceCommand(deviceId, command);
    },
    [sendDeviceCommand]
  );

  const refreshDevices = useCallback(() => {
    loadDevices();
  }, [loadDevices]);

  return {
    // Estados
    devices,
    deviceData: Object.fromEntries(deviceData),
    alerts,
    loading,
    error,
    connectionStatus,

    // Funciones
    getDeviceById,
    getDeviceHistory,
    getLatestReading,
    getUnresolvedAlerts,
    sendCommand,
    refreshDevices,
    connect,
  };
};
