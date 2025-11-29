'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface UseWebSocketOptions {
    url: string;
    autoConnect?: boolean;
    reconnection?: boolean;
    maxReconnectionAttempts?: number;
    reconnectionDelay?: number;
    reconnectionDelayMax?: number;
    jitterFactor?: number; // 0-1, añade variación aleatoria al delay
    onConnect?: () => void;
    onDisconnect?: (reason: string) => void;
    onError?: (error: Error) => void;
    onReconnectAttempt?: (attempt: number) => void;
    onReconnectFailed?: () => void;
}

interface WebSocketState {
    connected: boolean;
    connecting: boolean;
    reconnecting: boolean;
    reconnectAttempts: number;
    error: Error | null;
}

/**
 * Hook de WebSocket con Backoff Exponencial
 * 
 * Implementa reconexión inteligente con:
 * - Backoff exponencial (delays crecientes)
 * - Jitter (variación aleatoria para evitar thundering herd)
 * - Límite de reintentos
 * - Estado de conexión reactivo
 * 
 * @example
 * const { socket, state, connect, disconnect } = useWebSocket({
 *   url: 'http://localhost:5000',
 *   reconnection: true,
 *   maxReconnectionAttempts: 10
 * });
 * 
 * useEffect(() => {
 *   if (socket) {
 *     socket.on('message', handleMessage);
 *     return () => socket.off('message', handleMessage);
 *   }
 * }, [socket]);
 */
export function useWebSocket(options: UseWebSocketOptions) {
    const {
        url,
        autoConnect = true,
        reconnection = true,
        maxReconnectionAttempts = 10,
        reconnectionDelay = 1000,
        reconnectionDelayMax = 30000,
        jitterFactor = 0.3,
        onConnect,
        onDisconnect,
        onError,
        onReconnectAttempt,
        onReconnectFailed,
    } = options;

    const socketRef = useRef<Socket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);

    const [state, setState] = useState<WebSocketState>({
        connected: false,
        connecting: false,
        reconnecting: false,
        reconnectAttempts: 0,
        error: null,
    });

    /**
     * Calcular delay con backoff exponencial y jitter
     */
    const calculateReconnectDelay = useCallback(
        (attemptNumber: number): number => {
            // Backoff exponencial: delay * 2^attempt
            // Ejemplo: 1s, 2s, 4s, 8s, 16s, 30s (max)
            const exponentialDelay = Math.min(
                reconnectionDelay * Math.pow(2, attemptNumber),
                reconnectionDelayMax
            );

            // Añadir jitter (variación aleatoria ±30%)
            const jitter = exponentialDelay * jitterFactor;
            const randomOffset = (Math.random() - 0.5) * 2 * jitter;

            return Math.max(0, Math.floor(exponentialDelay + randomOffset));
        },
        [reconnectionDelay, reconnectionDelayMax, jitterFactor]
    );

    /**
     * Limpiar timeout de reconexión
     */
    const clearReconnectTimeout = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
    }, []);

    /**
     * Intentar reconectar con backoff exponencial
     */
    const scheduleReconnect = useCallback(() => {
        if (!reconnection) return;
        if (reconnectAttemptsRef.current >= maxReconnectionAttempts) {
            setState((prev) => ({
                ...prev,
                reconnecting: false,
                error: new Error('Max reconnection attempts reached'),
            }));
            onReconnectFailed?.();
            return;
        }

        const delay = calculateReconnectDelay(reconnectAttemptsRef.current);
        reconnectAttemptsRef.current++;

        setState((prev) => ({
            ...prev,
            reconnecting: true,
            reconnectAttempts: reconnectAttemptsRef.current,
        }));

        onReconnectAttempt?.(reconnectAttemptsRef.current);

        clearReconnectTimeout();
        reconnectTimeoutRef.current = setTimeout(() => {
            if (socketRef.current) {
                socketRef.current.connect();
            }
        }, delay);
    }, [
        reconnection,
        maxReconnectionAttempts,
        calculateReconnectDelay,
        clearReconnectTimeout,
        onReconnectAttempt,
        onReconnectFailed,
    ]);

    /**
     * Conectar al servidor WebSocket
     */
    const connect = useCallback(() => {
        if (socketRef.current?.connected) {
            return;
        }

        setState((prev) => ({ ...prev, connecting: true, error: null }));

        try {
            const socket = io(url, {
                autoConnect: false,
                reconnection: false, // Manejamos la reconexión manualmente
                transports: ['websocket', 'polling'],
            });

            // Event: Conectado
            socket.on('connect', () => {
                reconnectAttemptsRef.current = 0;
                clearReconnectTimeout();
                setState({
                    connected: true,
                    connecting: false,
                    reconnecting: false,
                    reconnectAttempts: 0,
                    error: null,
                });
                onConnect?.();
            });

            // Event: Desconectado
            socket.on('disconnect', (reason) => {
                setState((prev) => ({
                    ...prev,
                    connected: false,
                    connecting: false,
                }));
                onDisconnect?.(reason);

                // Reconectar automáticamente si no fue desconexión intencional
                if (
                    reason !== 'io client disconnect' &&
                    reason !== 'io server disconnect'
                ) {
                    scheduleReconnect();
                }
            });

            // Event: Error de conexión
            socket.on('connect_error', (error) => {
                setState((prev) => ({
                    ...prev,
                    connected: false,
                    connecting: false,
                    error,
                }));
                onError?.(error);

                // Programar reconexión
                scheduleReconnect();
            });

            // Event: Error general
            socket.on('error', (error) => {
                const err = error instanceof Error ? error : new Error(String(error));
                setState((prev) => ({ ...prev, error: err }));
                onError?.(err);
            });

            socketRef.current = socket;
            socket.connect();
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            setState((prev) => ({
                ...prev,
                connecting: false,
                error: err,
            }));
            onError?.(err);
        }
    }, [url, onConnect, onDisconnect, onError, scheduleReconnect, clearReconnectTimeout]);

    /**
     * Desconectar del servidor
     */
    const disconnect = useCallback(() => {
        clearReconnectTimeout();
        reconnectAttemptsRef.current = 0;

        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current.removeAllListeners();
            socketRef.current = null;
        }

        setState({
            connected: false,
            connecting: false,
            reconnecting: false,
            reconnectAttempts: 0,
            error: null,
        });
    }, [clearReconnectTimeout]);

    /**
     * Reconectar manualmente (resetea contador)
     */
    const reconnect = useCallback(() => {
        reconnectAttemptsRef.current = 0;
        disconnect();
        setTimeout(() => connect(), 100);
    }, [connect, disconnect]);

    /**
     * Auto-conectar al montar si está habilitado
     */
    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [autoConnect]); // Solo ejecutar en mount/unmount

    return {
        socket: socketRef.current,
        state,
        connect,
        disconnect,
        reconnect,
    };
}

export default useWebSocket;
