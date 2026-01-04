import { useEffect } from 'react';
import { useWebSocket } from '@/lib/websocket/useWebSocket';

type WebSocketEventHandler = (data: any) => void;

export function useWebSocketEvents(
  eventType: string,
  handler: WebSocketEventHandler,
  dependencies: any[] = []
) {
  const { socket } = useWebSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(eventType, handler);

    return () => {
      socket.off(eventType, handler);
    };
  }, [socket, eventType, handler, ...dependencies]);
}

export function useWebSocketAlerts(onAlert: (alert: any) => void) {
  useWebSocketEvents('alert', onAlert);
}

export function useWebSocketNotifications(onNotification: (notification: any) => void) {
  useWebSocketEvents('notification', onNotification);
}

export function useWebSocketDeviceUpdates(onDeviceUpdate: (device: any) => void) {
  useWebSocketEvents('device_update', onDeviceUpdate);
}

export function useWebSocketConsumption(onConsumption: (data: any) => void) {
  useWebSocketEvents('consumption', onConsumption);
}
