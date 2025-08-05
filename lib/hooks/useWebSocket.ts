import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { logger } from "../utils/logger";

// Tipos específicos para WebSocket
export interface WebSocketConfig {
  autoConnect?: boolean;
  room?: string;
  userId?: string;
  userRole?: string;
  userType?: string;
  token?: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  connectionConfirmed: boolean;
  error: string | null;
  reconnectAttempts: number;
}

export interface IoTDataUpdate {
  deviceId: string;
  type: string;
  value: number;
  timestamp: string;
  quality: "good" | "warning" | "critical";
}

export interface IoTAlert {
  id: string;
  deviceId: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
}

export interface HardwareCommandData {
  deviceId: string;
  command: "on" | "off" | "toggle" | "status" | "reset";
  target?: "led" | "relay" | "sensor" | "system";
  parameters?: Record<string, unknown>;
}

export interface MLTrainingData {
  deviceId: string;
  dataType: string;
}

export interface ForecastRequest {
  deviceId: string;
  dataType: string;
  hoursAhead: number;
}

export interface ReportConfig {
  id: string;
  name: string;
  type: string;
  devices: string[];
  metrics: string[];
  format: string;
}

export function useWebSocket(config: WebSocketConfig = {}) {
  const {
    autoConnect = true,
    room,
    userId,
    userRole,
    userType,
    token,
  } = config;

  const socketRef = useRef<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    connectionConfirmed: false,
    error: null,
    reconnectAttempts: 0,
  });

  const websocketUrl =
    process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:5000";

  useEffect(() => {
    if (!autoConnect) return;

    logger.info("Iniciando conexión WebSocket", "useWebSocket", {
      websocketUrl,
    });

    const socket = io(websocketUrl, {
      auth: {
        userId,
        userRole,
        userType,
        token,
      },
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Event handlers para conexión
    socket.on("connect", () => {
      logger.info("WebSocket conectado", "useWebSocket", {
        socketId: socket.id,
      });
      setConnectionStatus((prev) => ({
        ...prev,
        isConnected: true,
        error: null,
        reconnectAttempts: 0,
      }));

      if (room) {
        socket.emit("room:join", room);
      }
    });

    socket.on("connection:confirmed", (data) => {
      logger.info(
        "Conexión WebSocket confirmada",
        "useWebSocket",
        data as unknown as Record<string, unknown>
      );
      setConnectionStatus((prev) => ({
        ...prev,
        connectionConfirmed: true,
      }));
    });

    socket.on("room:joined", (data) => {
      logger.info("Unido a sala", "useWebSocket", { room: data.room });
    });

    socket.on("disconnect", (reason) => {
      logger.warn("WebSocket desconectado", "useWebSocket", { reason });
      setConnectionStatus((prev) => ({
        ...prev,
        isConnected: false,
        connectionConfirmed: false,
      }));
    });

    socket.on("connect_error", (err) => {
      logger.error("Error de conexión WebSocket", "useWebSocket", {
        error: err.message,
      });
      setConnectionStatus((prev) => ({
        ...prev,
        error: err.message,
        isConnected: false,
        reconnectAttempts: prev.reconnectAttempts + 1,
      }));
    });

    socket.on("reconnect", (attemptNumber) => {
      logger.info("WebSocket reconectado", "useWebSocket", { attemptNumber });
      setConnectionStatus((prev) => ({
        ...prev,
        isConnected: true,
        error: null,
        reconnectAttempts: 0,
      }));
    });

    // Event handlers específicos de la aplicación
    socket.on("iot:data:update", (data: IoTDataUpdate) => {
      logger.debug(
        "Datos IoT actualizados",
        "useWebSocket",
        data as unknown as Record<string, unknown>
      );
    });

    socket.on("iot:alert:new", (alert: IoTAlert) => {
      logger.info(
        "Nueva alerta IoT",
        "useWebSocket",
        alert as unknown as Record<string, unknown>
      );
    });

    socket.on("notification:received", (notification: NotificationData) => {
      logger.info(
        "Notificación recibida",
        "useWebSocket",
        notification as unknown as Record<string, unknown>
      );
    });

    // Event handlers para Machine Learning
    socket.on("ml:model_trained", (data) => {
      logger.info(
        "Modelo ML entrenado",
        "useWebSocket",
        data as unknown as Record<string, unknown>
      );
    });

    socket.on("ml:forecast_generated", (data) => {
      logger.info(
        "Pronóstico generado",
        "useWebSocket",
        data as unknown as Record<string, unknown>
      );
    });

    socket.on("ml:patterns_analyzed", (data) => {
      logger.info(
        "Patrones analizados",
        "useWebSocket",
        data as unknown as Record<string, unknown>
      );
    });

    socket.on("ml:models_optimized", (data) => {
      logger.info(
        "Modelos optimizados",
        "useWebSocket",
        data as unknown as Record<string, unknown>
      );
    });

    socket.on("ml:critical_predictions", (data) => {
      logger.warn(
        "Predicciones críticas",
        "useWebSocket",
        data as unknown as Record<string, unknown>
      );
    });

    // Event handlers para Reportes
    socket.on("reporting:report_generated", (data) => {
      logger.info(
        "Reporte generado",
        "useWebSocket",
        data as unknown as Record<string, unknown>
      );
    });

    socket.on("reporting:auto_report_configured", (data) => {
      logger.info(
        "Reporte automático configurado",
        "useWebSocket",
        data as unknown as Record<string, unknown>
      );
    });

    socket.on("reporting:critical_recommendations", (data) => {
      logger.warn(
        "Recomendaciones críticas",
        "useWebSocket",
        data as unknown as Record<string, unknown>
      );
    });

    return () => {
      logger.info("Desconectando WebSocket", "useWebSocket");
      socket.disconnect();
    };
  }, [autoConnect, room, userId, userRole, userType, token, websocketUrl]);

  // Métodos básicos
  const emit = (event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
      logger.debug("Evento emitido", "useWebSocket", { event, data });
    } else {
      logger.warn(
        "Intentando emitir evento sin conexión WebSocket",
        "useWebSocket",
        { event }
      );
    }
  };

  const on = (event: string, callback: (data: unknown) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback?: (data: unknown) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  // Métodos específicos para salas
  const joinRoom = (roomName: string) => {
    emit("room:join", { room: roomName });
  };

  const leaveRoom = (roomName: string) => {
    emit("room:leave", { room: roomName });
  };

  // Métodos específicos para IoT
  const sendIoTData = (data: IoTDataUpdate) => {
    emit("iot:data", data);
  };

  const sendIoTAlert = (alert: Omit<IoTAlert, "id" | "timestamp">) => {
    emit("iot:alert", {
      ...alert,
      id: `alert_${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
  };

  const sendNotification = (notification: {
    targetUserId?: string;
    targetRole?: string;
    message: string;
    type: string;
  }) => {
    emit("notification:send", notification);
  };

  // Métodos específicos para IoT eléctrico
  const sendDeviceConnectionStatus = (data: {
    deviceId: string;
    status: "connected" | "disconnected" | "reconnecting";
    lastSeen?: Date;
    metadata?: Record<string, unknown>;
  }) => {
    emit("device:connection_status", data);
  };

  const sendVoltageReading = (data: {
    deviceId: string;
    voltage: number;
    phase?: "L1" | "L2" | "L3";
    quality: "good" | "warning" | "critical";
    location?: string;
  }) => {
    emit("device:voltage_reading", data);
  };

  const sendCurrentReading = (data: {
    deviceId: string;
    current: number;
    phase?: "L1" | "L2" | "L3";
    powerFactor?: number;
    location?: string;
  }) => {
    emit("device:current_reading", data);
  };

  const sendPowerConsumption = (data: {
    deviceId: string;
    activePower: number;
    reactivePower?: number;
    apparentPower?: number;
    energy: number;
    cost?: number;
    location?: string;
  }) => {
    emit("device:power_consumption", data);
  };

  const sendDeviceReconnection = (data: {
    deviceId: string;
    previousStatus: string;
    reconnectionTime: number;
    attempts: number;
    success: boolean;
  }) => {
    emit("device:reconnection", data);
  };

  const sendPowerOutageAlert = (data: {
    deviceId: string;
    location: string;
    affectedDevices?: string[];
    estimatedDuration?: number;
  }) => {
    emit("alert:power_outage", data);
  };

  const sendVoltageAnomalyAlert = (data: {
    deviceId: string;
    currentVoltage: number;
    expectedVoltage: number;
    deviation: number;
    phase?: string;
  }) => {
    emit("alert:voltage_anomaly", data);
  };

  const sendSwitchState = (data: {
    deviceId: string;
    switchId: string;
    state: "on" | "off" | "auto";
    controlledBy?: string;
    reason?: string;
  }) => {
    emit("control:switch_state", data);
  };

  const sendEmergencyStop = (data: {
    deviceId: string;
    reason: string;
    triggeredBy: string;
    affectedSystems: string[];
  }) => {
    emit("control:emergency_stop", data);
  };

  // Métodos específicos para control hardware
  const sendArduinoCommand = (data: HardwareCommandData) => {
    emit("hardware:arduino_command", data);
  };

  const reportCommandResult = (data: {
    commandId: string;
    deviceId: string;
    success: boolean;
    result?: Record<string, unknown>;
    error?: string;
    executionTime?: number;
  }) => {
    emit("hardware:command_result", data);
  };

  const sendSensorReading = (data: {
    deviceId: string;
    sensorType: "temperature" | "humidity" | "pressure" | "light";
    value: number;
    unit: string;
    location?: string;
  }) => {
    emit("hardware:sensor_reading", data);
  };

  const controlRelay = (data: {
    deviceId: string;
    relayId: string;
    action: "on" | "off" | "toggle";
    duration?: number;
    priority?: "low" | "medium" | "high";
  }) => {
    emit("hardware:relay_control", data);
  };

  const configureDevice = (data: {
    deviceId: string;
    configType: "device" | "network" | "security" | "performance";
    configuration: Record<string, unknown>;
    applyImmediately?: boolean;
  }) => {
    emit("hardware:configure", data);
  };

  const sendPerformanceMetrics = (data: {
    deviceId: string;
    cpuUsage?: number;
    memoryUsage?: number;
    temperature?: number;
    uptime: number;
    networkLatency?: number;
    errorCount?: number;
  }) => {
    emit("hardware:performance_metrics", data);
  };

  // Métodos de Machine Learning
  const trainModel = (data: MLTrainingData) => {
    emit("ml:train", data);
  };

  const requestForecast = (data: ForecastRequest) => {
    emit("ml:forecast", data);
  };

  const analyzePatterns = (data: MLTrainingData) => {
    emit("ml:analyze_patterns", data);
  };

  const optimizeModels = () => {
    emit("ml:optimize", {});
  };

  // Métodos de Reportes
  const generateReport = (config: ReportConfig) => {
    emit("reporting:generate", config);
  };

  const configureAutoReport = (config: ReportConfig) => {
    emit("reporting:configure", config);
  };

  return {
    // Estado de conexión
    isConnected: connectionStatus.isConnected,
    connectionConfirmed: connectionStatus.connectionConfirmed,
    error: connectionStatus.error,
    reconnectAttempts: connectionStatus.reconnectAttempts,

    // Métodos básicos
    emit,
    on,
    off,
    joinRoom,
    leaveRoom,

    // Métodos IoT básicos
    sendIoTData,
    sendIoTAlert,
    sendNotification,

    // Métodos específicos para IoT eléctrico
    sendDeviceConnectionStatus,
    sendVoltageReading,
    sendCurrentReading,
    sendPowerConsumption,
    sendDeviceReconnection,
    sendPowerOutageAlert,
    sendVoltageAnomalyAlert,
    sendSwitchState,
    sendEmergencyStop,

    // Métodos específicos para control hardware
    sendArduinoCommand,
    reportCommandResult,
    sendSensorReading,
    controlRelay,
    configureDevice,
    sendPerformanceMetrics,

    // Métodos de Machine Learning
    trainModel,
    requestForecast,
    analyzePatterns,
    optimizeModels,

    // Métodos de Reportes
    generateReport,
    configureAutoReport,

    // Socket directo para casos especiales
    socket: socketRef.current,
  };
}
