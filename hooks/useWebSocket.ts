import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/components/ui/use-toast";

interface WebSocketData {
  dispositivoId?: string;
  data?: any;
  timestamp?: string;
}

interface NotificationData {
  id: string;
  tipo: "error" | "advertencia" | "informacion";
  mensaje: string;
  ubicacion?: string;
  dispositivo?: string;
  timestamp: string;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  deviceData: WebSocketData | null;
  notifications: NotificationData[];
  sendMessage: (event: string, data: any) => void;
  clearNotifications: () => void;
  markNotificationAsRead: (id: string) => void;
}

export const useWebSocket = (
  url: string = "http://localhost:3001"
): UseWebSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceData, setDeviceData] = useState<WebSocketData | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { toast } = useToast();

  const sendMessage = useCallback(
    (event: string, data: any) => {
      if (socket && isConnected) {
        socket.emit(event, data);
      }
    },
    [socket, isConnected]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  useEffect(() => {
    // Crear conexión WebSocket
    const socketInstance = io(url, {
      transports: ["websocket"],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("🔗 WebSocket conectado");
      setIsConnected(true);
      setSocket(socketInstance);
    });

    socketInstance.on("disconnect", () => {
      console.log("🔌 WebSocket desconectado");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Error de conexión WebSocket:", error);
      setIsConnected(false);
    });

    // Escuchar datos de dispositivos
    socketInstance.on("device_data", (data: WebSocketData) => {
      setDeviceData(data);
    });

    // Escuchar notificaciones del sistema
    socketInstance.on(
      "system_notification",
      (notification: NotificationData) => {
        setNotifications((prev) => [notification, ...prev.slice(0, 9)]); // Mantener solo las últimas 10

        // Mostrar toast para notificaciones importantes
        if (
          notification.tipo === "error" ||
          notification.tipo === "advertencia"
        ) {
          toast({
            title:
              notification.tipo === "error"
                ? "Error del Sistema"
                : "Advertencia",
            description: notification.mensaje,
            variant: notification.tipo === "error" ? "destructive" : "default",
          });
        }
      }
    );

    // Escuchar alertas de dispositivos
    socketInstance.on("device_alert", (alert: NotificationData) => {
      setNotifications((prev) => [alert, ...prev.slice(0, 9)]);

      if (alert.tipo === "error") {
        toast({
          title: `Alerta de Dispositivo ${alert.dispositivo}`,
          description: alert.mensaje,
          variant: "destructive",
        });
      }
    });

    // Escuchar estadísticas en tiempo real
    socketInstance.on("stats_update", (stats: any) => {
      // Aquí puedes manejar las estadísticas en tiempo real
      console.log("📊 Estadísticas actualizadas:", stats);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [url, toast]);

  return {
    socket,
    isConnected,
    deviceData,
    notifications,
    sendMessage,
    clearNotifications,
    markNotificationAsRead,
  };
};
