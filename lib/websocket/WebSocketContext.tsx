"use client";

/**
 * WebSocketContext - Context API para gestionar la conexión WebSocket global
 * 
 * Responsabilidades:
 * - Proveer instancia de WebSocket a toda la aplicación
 * - Gestionar estado global de conexión
 * - Manejar cambios de autenticación
 * - Exponer estado de conexión
 */

import { createContext } from 'react';
import type { Socket } from 'socket.io-client';
import type { EstadoConexion } from './tipos';

/**
 * Interfaz del valor del contexto WebSocket
 * Define qué datos y métodos están disponibles para los consumidores
 */
export interface ValorContextoWebSocket {
  /** Instancia del socket Socket.IO (null si no está conectado) */
  socket: Socket | null;
  
  /** Indica si el socket está conectado actualmente */
  estaConectado: boolean;
  
  /** Estado actual de la conexión */
  estadoConexion: EstadoConexion;
  
  /** Último error ocurrido (null si no hay errores) */
  ultimoError: Error | null;
  
  /** Número de intentos de reconexión realizados */
  intentosReconexion: number;
  
  /** Latencia actual de la conexión en ms (null si no está disponible) */
  latencia: number | null;
  
  /** Función para forzar una reconexión manual */
  reconectar: () => void;
  
  /** Función para desconectar manualmente */
  desconectar: () => void;
}

/**
 * Contexto de WebSocket
 * Usar con useContext(ContextoWebSocket) o mejor aún, con el hook useWebSocket
 */
export const ContextoWebSocket = createContext<ValorContextoWebSocket | null>(null);

/**
 * Nombre para display en DevTools
 */
ContextoWebSocket.displayName = 'ContextoWebSocket';
