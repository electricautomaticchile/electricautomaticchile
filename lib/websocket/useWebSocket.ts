'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface WSMessage {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
  clienteId?: string;
}

interface UseNativeWSOptions {
  enabled?: boolean;
  onMessage?: (msg: WSMessage) => void;
}

export function useWebSocket(options: UseNativeWSOptions = {}) {
  const { enabled = true, onMessage } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intentionalCloseRef = useRef(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const [connected, setConnected] = useState(false);

  const getToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    const raw = document.cookie
      .split('; ')
      .find((c) => c.startsWith('auth_token='))
      ?.split('=')[1];
    return raw ? decodeURIComponent(raw) : null;
  }, []);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    // Ya conectado o conectando
    if (wsRef.current && wsRef.current.readyState <= WebSocket.OPEN) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const wsUrl = apiUrl.replace(/^http/, 'ws') + '/api/ws/connect';

    intentionalCloseRef.current = false;
    // Conectar sin token en URL — el backend lee la cookie auth_token automáticamente
    // (las cookies se envían automáticamente en conexiones WS del mismo origen)
    // Si hay token disponible lo pasamos como fallback
    const token = getToken();
    const fullUrl = token ? `${wsUrl}?token=${token}` : wsUrl;
    const ws = new WebSocket(fullUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);
        onMessageRef.current?.(msg);
      } catch {}
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
      // Solo reconectar si no fue cierre intencional
      if (!intentionalCloseRef.current) {
        reconnectRef.current = setTimeout(connect, 5000);
      }
    };

    ws.onerror = () => {
      // onclose se dispara después, ahí manejamos reconexión
    };
  }, [getToken]);

  useEffect(() => {
    if (!enabled) return;

    // Pequeño delay para evitar el doble-mount de StrictMode
    const timer = setTimeout(connect, 100);

    return () => {
      clearTimeout(timer);
      intentionalCloseRef.current = true;
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
      // Cerrar solo si está abierto
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, [enabled, connect]);

  return { connected };
}
