'use client';

import { useEffect, useCallback, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { useAuth } from '@/lib/store/useAppStore';
import { toast } from '@/components/ui/use-toast';

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  deviceId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  actionUrl?: string;
}

/**
 * Hook para notificaciones en tiempo real via WebSocket
 * 
 * Características:
 * - Recepción de notificaciones en tiempo real
 * - Toast automático para notificaciones importantes
 * - Gestión de notificaciones no leídas
 * - Sonido opcional
 * - Reconexión automática
 * 
 * @example
 * const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
 */
export function useNotifications() {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';

  const { socket, state, reconnect } = useWebSocket({
    url: wsUrl,
    autoConnect: isAuthenticated,
    reconnection: true,
    maxReconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30000,
    jitterFactor: 0.3,
    onConnect: () => {

      // Unirse a la sala del usuario
      if (user?.id) {
        socket?.emit('join', `user:${user.id}`);
        socket?.emit('join', `notifications:${user.id}`);
      }
    },
    onDisconnect: (reason) => {
    },
    onReconnectAttempt: (attempt) => {
    },
  });

  /**
   * Reproducir sonido de notificación
   */
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;

    try {
      // Crear un beep simple usando Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frecuencia en Hz
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
    }
  }, [soundEnabled]);

  /**
   * Obtener tipo de icono según tipo de notificación
   */
  const getNotificationIconType = (type: Notification['type']): string => {
    switch (type) {
      case 'alert':
      case 'error':
        return 'alert-triangle';
      case 'warning':
        return 'zap';
      case 'success':
        return 'check-circle';
      case 'info':
      default:
        return 'info';
    }
  };

  /**
   * Mostrar toast para notificación
   */
  const showToast = useCallback(
    (notification: Notification) => {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'error' || notification.type === 'alert' ? 'destructive' : 'default',
        duration: notification.severity === 'critical' ? 10000 : 5000,
      });
    },
    []
  );

  /**
   * Agregar notificación
   */
  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 100)); // Mantener solo 100

      // Mostrar toast para notificaciones importantes
      if (
        notification.type === 'alert' ||
        notification.type === 'error' ||
        notification.severity === 'critical' ||
        notification.severity === 'high'
      ) {
        showToast(newNotification);
        playNotificationSound();
      }

      return newNotification;
    },
    [showToast, playNotificationSound]
  );

  /**
   * Marcar como leída
   */
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  /**
   * Marcar todas como leídas
   */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  /**
   * Eliminar notificación
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  /**
   * Limpiar todas
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Escuchar eventos de WebSocket
   */
  useEffect(() => {
    if (!socket) return;

    // Evento: Nueva alerta IoT
    socket.on('alerta:nueva', (data: any) => {
      addNotification({
        type: 'alert',
        title: data.titulo || 'Nueva Alerta',
        message: data.mensaje || data.message || 'Se ha detectado una alerta en el sistema',
        severity: data.severidad || data.severity || 'medium',
        deviceId: data.dispositivoId || data.deviceId,
      });
    });

    // Evento: Alerta resuelta
    socket.on('alerta:resuelta', (data: any) => {
      addNotification({
        type: 'success',
        title: 'Alerta Resuelta',
        message: data.mensaje || `La alerta ha sido resuelta`,
        deviceId: data.dispositivoId || data.deviceId,
      });
    });

    // Evento: Dispositivo desconectado
    socket.on('dispositivo:desconectado', (data: any) => {
      addNotification({
        type: 'warning',
        title: 'Dispositivo Desconectado',
        message: `El dispositivo ${data.idDispositivo || data.deviceId} se ha desconectado`,
        severity: 'high',
        deviceId: data.idDispositivo || data.deviceId,
      });
    });

    // Evento: Dispositivo conectado
    socket.on('dispositivo:conectado', (data: any) => {
      addNotification({
        type: 'info',
        title: 'Dispositivo Conectado',
        message: `El dispositivo ${data.idDispositivo || data.deviceId} se ha conectado`,
        deviceId: data.idDispositivo || data.deviceId,
      });
    });

    // Evento: Umbral de consumo excedido
    socket.on('consumo:umbral_excedido', (data: any) => {
      addNotification({
        type: 'warning',
        title: 'Consumo Elevado',
        message: `El consumo ha excedido el umbral: ${data.valor || data.value}kW`,
        severity: 'high',
        deviceId: data.dispositivoId || data.deviceId,
      });
    });

    // Evento: Notificación genérica
    socket.on('notification', (data: any) => {
      addNotification({
        type: data.type || 'info',
        title: data.title || 'Notificación',
        message: data.message || '',
        severity: data.severity,
        deviceId: data.deviceId,
        actionUrl: data.actionUrl,
      });
    });

    return () => {
      socket.off('alerta:nueva');
      socket.off('alerta:resuelta');
      socket.off('dispositivo:desconectado');
      socket.off('dispositivo:conectado');
      socket.off('consumo:umbral_excedido');
      socket.off('notification');
    };
  }, [socket, addNotification]);

  // Contador de no leídas
  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    connectionState: state,
    reconnect,
    soundEnabled,
    setSoundEnabled,
  };
}

export default useNotifications;
