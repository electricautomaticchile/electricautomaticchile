import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

interface ConnectionStatus {
  connected: boolean;
  authenticated: boolean;
  error: string | null;
  reconnecting: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectDelay = 1000,
  } = options;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    authenticated: false,
    error: null,
    reconnecting: false,
  });

  const reconnectCount = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  // Función para conectar al WebSocket
  const connect = useCallback(() => {
    if (socket?.connected) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const newSocket = io(API_URL, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: false, // Manejamos la reconexión manualmente
    });

    // Event handlers
    newSocket.on("connect", () => {
      console.log("✅ WebSocket conectado");
      setConnectionStatus((prev) => ({
        ...prev,
        connected: true,
        error: null,
        reconnecting: false,
      }));
      reconnectCount.current = 0;
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔌 WebSocket desconectado:", reason);
      setConnectionStatus((prev) => ({
        ...prev,
        connected: false,
        authenticated: false,
      }));

      // Intentar reconexión automática
      if (
        reason !== "io client disconnect" &&
        reconnectCount.current < reconnectAttempts
      ) {
        setConnectionStatus((prev) => ({ ...prev, reconnecting: true }));
        reconnectTimer.current = setTimeout(() => {
          reconnectCount.current++;
          console.log(
            `🔄 Intento de reconexión ${reconnectCount.current}/${reconnectAttempts}`
          );
          connect();
        }, reconnectDelay * Math.pow(2, reconnectCount.current)); // Backoff exponencial
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Error de conexión WebSocket:", error);
      setConnectionStatus((prev) => ({
        ...prev,
        error: error.message,
        reconnecting: false,
      }));
    });

    newSocket.on("connection-status", (data) => {
      console.log("📡 Estado de conexión:", data);

      if (data.status === "authenticated") {
        setConnectionStatus((prev) => ({ ...prev, authenticated: true }));
      } else if (data.status === "auth-failed") {
        setConnectionStatus((prev) => ({
          ...prev,
          error: "Autenticación fallida",
          authenticated: false,
        }));
      }
    });

    setSocket(newSocket);
    return newSocket;
  }, [reconnectAttempts, reconnectDelay, socket]);

  // Función para autenticar con token
  const authenticate = useCallback(
    (token: string) => {
      if (socket && socket.connected) {
        socket.emit("authenticate", token);
      }
    },
    [socket]
  );

  // Función para unirse a sala de cliente
  const joinClientRoom = useCallback(
    (clienteId: string) => {
      if (socket && connectionStatus.authenticated) {
        socket.emit("join-client-room", clienteId);
      }
    },
    [socket, connectionStatus.authenticated]
  );

  // Función para unirse a sala de admin
  const joinAdminRoom = useCallback(() => {
    if (socket && connectionStatus.authenticated) {
      socket.emit("join-admin-room");
    }
  }, [socket, connectionStatus.authenticated]);

  // Función para enviar comando a dispositivo
  const sendDeviceCommand = useCallback(
    (deviceId: string, command: string) => {
      if (socket && connectionStatus.authenticated) {
        socket.emit("device-command", { deviceId, command });
      }
    },
    [socket, connectionStatus.authenticated]
  );

  // Función para desconectar
  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setConnectionStatus({
      connected: false,
      authenticated: false,
      error: null,
      reconnecting: false,
    });
  }, [socket]);

  // Función para suscribirse a eventos
  const on = useCallback(
    (event: string, handler: (...args: any[]) => void) => {
      if (socket) {
        socket.on(event, handler);
        return () => socket.off(event, handler);
      }
      return () => {};
    },
    [socket]
  );

  // Función para emitir eventos
  const emit = useCallback(
    (event: string, data?: any) => {
      if (socket && socket.connected) {
        socket.emit(event, data);
      }
    },
    [socket]
  );

  // Auto conectar al montar el componente
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    socket,
    connectionStatus,
    connect,
    disconnect,
    authenticate,
    joinClientRoom,
    joinAdminRoom,
    sendDeviceCommand,
    on,
    emit,
  };
};
