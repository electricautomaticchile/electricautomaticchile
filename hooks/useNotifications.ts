import { useState, useCallback, useEffect } from "react";

export interface Notification {
  id: string;
  tipo: "error" | "advertencia" | "informacion" | "exito";
  mensaje: string;
  ubicacion?: string;
  dispositivo?: string;
  fecha: string;
  hora: string;
  leida: boolean;
  importante: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "fecha" | "hora" | "leida">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadImportant: () => Notification[];
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generar ID único para notificaciones
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Formatear fecha y hora actual
  const getCurrentDateTime = () => {
    const now = new Date();
    const fecha = now.toLocaleDateString("es-CL");
    const hora = now.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { fecha, hora };
  };

  // Agregar nueva notificación
  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "fecha" | "hora" | "leida">) => {
      const { fecha, hora } = getCurrentDateTime();
      const newNotification: Notification = {
        ...notification,
        id: generateId(),
        fecha,
        hora,
        leida: false,
      };

      setNotifications((prev) => [newNotification, ...prev.slice(0, 49)]); // Mantener máximo 50 notificaciones
    },
    []
  );

  // Marcar como leída
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif))
    );
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, leida: true }))
    );
  }, []);

  // Remover notificación específica
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  // Limpiar todas las notificaciones
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Obtener notificaciones importantes no leídas
  const getUnreadImportant = useCallback(() => {
    return notifications.filter((notif) => !notif.leida && notif.importante);
  }, [notifications]);

  // Calcular cantidad de no leídas
  const unreadCount = notifications.filter((notif) => !notif.leida).length;

  // WebSocket removido temporalmente - las notificaciones se manejarán por polling o manualmente

  // Agregar algunas notificaciones de ejemplo al inicializar
  useEffect(() => {
    if (notifications.length === 0) {
      // Notificaciones de ejemplo para mostrar el sistema funcionando
      const ejemplos: Omit<Notification, "id" | "fecha" | "hora" | "leida">[] =
        [
          {
            tipo: "advertencia",
            mensaje: "Nivel de batería bajo detectado",
            ubicacion: "Edificio Oeste - Piso 2",
            dispositivo: "DEV006",
            importante: true,
          },
          {
            tipo: "informacion",
            mensaje: "Actualización de firmware disponible",
            ubicacion: "Múltiples ubicaciones",
            dispositivo: "Múltiples",
            importante: false,
          },
          {
            tipo: "exito",
            mensaje: "Conexión con dispositivo restablecida",
            ubicacion: "Edificio Norte - Piso 1",
            dispositivo: "DEV003",
            importante: false,
          },
        ];

      ejemplos.forEach((ejemplo) => {
        setTimeout(() => addNotification(ejemplo), Math.random() * 1000);
      });
    }
  }, [notifications.length, addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getUnreadImportant,
  };
};
