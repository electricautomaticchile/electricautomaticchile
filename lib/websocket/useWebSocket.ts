'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getWebSocketUrl } from './wsUrl';

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

export interface RetornoUseWebSocket {
  connected: boolean;
  estaConectado: boolean;
  estadoConexion: string;
  latencia: number | null;
  intentosReconexion: number;
  ultimoError: Error | null;
  reconectar: () => void;
}

export function useWebSocket(options: UseNativeWSOptions = {}): RetornoUseWebSocket {
  const { enabled = true, onMessage } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intentionalCloseRef = useRef(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const [connected, setConnected] = useState(false);
  const [latencia, setLatencia] = useState<number | null>(null);
  const [intentosReconexion, setIntentosReconexion] = useState(0);
  const [ultimoError, setUltimoError] = useState<Error | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pingTimestampRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    // Ya conectado o conectando
    if (wsRef.current && wsRef.current.readyState <= WebSocket.OPEN) return;

    // WebSocket Hub independiente (servicio websocket-electric).
    // El ALB enruta /ws/* a este servicio; en local usa el puerto 8081.
    const wsUrl = getWebSocketUrl();

    intentionalCloseRef.current = false;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
      // Medir latencia cada 10s
      pingIntervalRef.current = setInterval(() => {
        pingTimestampRef.current = Date.now();
        ws.send(JSON.stringify({ type: 'ping' }));
      }, 10000);
    };

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);
        if (msg.type === 'pong' && pingTimestampRef.current) {
          setLatencia(Date.now() - pingTimestampRef.current);
          pingTimestampRef.current = null;
        }
        onMessageRef.current?.(msg);
      } catch {}
    };

    ws.onclose = () => {
      setConnected(false);
      setLatencia(null);
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      wsRef.current = null;
      // Solo reconectar si no fue cierre intencional
      if (!intentionalCloseRef.current) {
        setIntentosReconexion((n) => n + 1);
        reconnectRef.current = setTimeout(connect, 5000);
      }
    };

    ws.onerror = () => {
      setUltimoError(new Error('WebSocket error'));
    };
  }, []);

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
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      // Cerrar solo si está abierto
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, [enabled, connect]);

  const estadoConexion = connected
    ? 'conectado'
    : reconnectRef.current
    ? 'reconectando'
    : 'desconectado';

  const reconectar = useCallback(() => {
    intentionalCloseRef.current = true;
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    wsRef.current = null;
    setIntentosReconexion(0);
    setUltimoError(null);
    intentionalCloseRef.current = false;
    connect();
  }, [connect]);

  return { connected, estaConectado: connected, estadoConexion, latencia, intentosReconexion, ultimoError, reconectar };
}
