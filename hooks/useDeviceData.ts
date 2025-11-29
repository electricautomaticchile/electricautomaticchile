import { useState, useEffect, useCallback } from "react";

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

  // WebSocket removido temporalmente
  const isConnected = false;
  const webSocketDeviceData = null;
  const notifications: any[] = [];
  const socket = null;
  const sendMessage = (..._args: any[]) => {};

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
      setError("Error de conexión al cargar dispositivos");
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  // WebSocket removido - este código se reactivará cuando se implemente el sistema IoT
  // useEffect(() => {
  //   if (webSocketDeviceData && webSocketDeviceData.dispositivoId) {
  //     const deviceId = webSocketDeviceData.dispositivoId;
  //     const newDeviceData: DeviceData = {
  //       deviceId,
  //       timestamp: webSocketDeviceData.timestamp || new Date().toISOString(),
  //       lecturas: webSocketDeviceData.data || [],
  //     };

  //     setDeviceData((prev) => {
  //       const newMap = new Map(prev);
  //       const deviceHistory = newMap.get(deviceId) || [];
  //       const updatedHistory = [...deviceHistory, newDeviceData].slice(-100);
  //       newMap.set(deviceId, updatedHistory);
  //       return newMap;
  //     });
  //   }
  // }, [webSocketDeviceData]);

  // Convertir notificaciones del WebSocket a alertas
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.dispositivo) {
        const alert: DeviceAlert = {
          deviceId: notification.dispositivo,
          timestamp: notification.timestamp,
          tipoAlerta: notification.tipo,
          mensaje: notification.mensaje,
          esResuelta: false,
        };

        setAlerts((prev) => {
          const exists = prev.some(
            (a) =>
              a.deviceId === alert.deviceId && a.timestamp === alert.timestamp
          );
          if (!exists) {
            return [alert, ...prev].slice(0, 50);
          }
          return prev;
        });
      }
    });
  }, [notifications]);

  // Polling de datos como fallback
  useEffect(() => {
    if (!autoConnect) return;

    loadDevices();

    const pollTimer = setInterval(() => {
      if (!isConnected) {
        loadDevices();
      }
    }, pollInterval);

    return () => clearInterval(pollTimer);
  }, [loadDevices, isConnected, pollInterval, autoConnect]);

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
      if (socket && isConnected) {
        sendMessage("device_command", { deviceId, command });
      }
    },
    [socket, isConnected, sendMessage]
  );

  const refreshDevices = useCallback(() => {
    loadDevices();
  }, [loadDevices]);

  return {
    devices,
    deviceData: Object.fromEntries(deviceData),
    alerts,
    loading,
    error,
    isConnected,
    getDeviceById,
    getDeviceHistory,
    getLatestReading,
    getUnresolvedAlerts,
    sendCommand,
    refreshDevices,
  };
};
