"use client";

/**
 * useWebSocket - Hook personalizado para integración WebSocket en componentes React
 * 
 * Responsabilidades:
 * - Proveer acceso fácil a WebSocket en componentes
 * - Manejar suscripciones de eventos con limpieza automática
 * - Proveer métodos de emisión tipados
 * - Gestionar listeners específicos del componente
 * 
 * @example
 * // Uso básico - solo acceso al socket
 * const { socket, estaConectado } = useWebSocket();
 * 
 * @example
 * // Con listener automático
 * useWebSocket('dispositivo:actualizacion_potencia', (datos) => {
 * });
 * 
 * @example
 * // Con métodos de emisión
 * const { emitir, escuchar } = useWebSocket();
 * emitir('comando:ejecutar', { id: '123' });
 */

import { useContext, useEffect, useRef, useId } from 'react';
import type { Socket } from 'socket.io-client';
import { ContextoWebSocket } from './WebSocketContext';
import type { EstadoConexion } from './tipos';
import { getMemoryManager } from './memoryManager';

/**
 * Interfaz del valor de retorno del hook useWebSocket
 */
export interface RetornoUseWebSocket {
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
  
  /**
   * Emitir un evento al servidor WebSocket
   * @param evento - Nombre del evento a emitir
   * @param datos - Datos a enviar con el evento
   */
  emitir: (evento: string, datos: any) => void;
  
  /**
   * Escuchar un evento específico del servidor
   * @param evento - Nombre del evento a escuchar
   * @param callback - Función a ejecutar cuando se recibe el evento
   */
  escuchar: <T = any>(evento: string, callback: (datos: T) => void) => void;
  
  /**
   * Dejar de escuchar un evento específico
   * @param evento - Nombre del evento
   * @param callback - Callback específico a remover (opcional)
   */
  dejarDeEscuchar: (evento: string, callback?: Function) => void;
  
  /**
   * Función para forzar una reconexión manual
   */
  reconectar: () => void;
  
  /**
   * Función para desconectar manualmente
   */
  desconectar: () => void;
}

/**
 * Hook useWebSocket
 * 
 * Provee acceso al contexto WebSocket y opcionalmente maneja
 * la suscripción automática a eventos con limpieza.
 * 
 * @param evento - (Opcional) Nombre del evento a escuchar automáticamente
 * @param callback - (Opcional) Callback a ejecutar cuando se recibe el evento
 * @returns Objeto con socket, estado de conexión y métodos helper
 * 
 * @throws Error si se usa fuera del ProveedorWebSocket
 */
export function useWebSocket<T = any>(
  evento?: string,
  callback?: (datos: T) => void
): RetornoUseWebSocket {
  // Consumir el contexto WebSocket
  const contexto = useContext(ContextoWebSocket);
  
  // Validar que el hook se use dentro del Provider
  if (!contexto) {
    throw new Error(
      'useWebSocket debe ser usado dentro de un ProveedorWebSocket. ' +
      'Asegúrate de envolver tu aplicación con <ProveedorWebSocket>.'
    );
  }
  
  // Extraer valores del contexto
  const {
    socket,
    estaConectado,
    estadoConexion,
    ultimoError,
    intentosReconexion,
    latencia,
    reconectar,
    desconectar,
  } = contexto;
  
  // Generate unique component ID for memory tracking
  const componentId = useId();
  const memoryManager = getMemoryManager();
  
  // Usar ref para mantener referencia estable del callback
  // Esto evita re-suscripciones innecesarias cuando el callback cambia
  const callbackRef = useRef(callback);
  
  // Actualizar ref cuando el callback cambia
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Manejar suscripción automática a eventos (si se proporcionan)
  useEffect(() => {
    // Solo suscribirse si hay evento, callback y socket disponible
    if (!evento || !callbackRef.current || !socket) {
      return;
    }
    
    // Wrapper del callback que usa la ref para tener siempre la versión más reciente
    const wrappedCallback = (datos: T) => {
      if (callbackRef.current) {
        try {
          callbackRef.current(datos);
        } catch (error) {
        }
      }
    };
    
    // Registrar listener
    socket.on(evento, wrappedCallback);
    
    // Track listener in memory manager
    memoryManager.registerListener(evento, wrappedCallback, componentId);
    
    
    // Cleanup: remover listener cuando el componente se desmonta o cambia el evento
    return () => {
      socket.off(evento, wrappedCallback);
      memoryManager.unregisterListener(evento, wrappedCallback);
    };
  }, [evento, socket, componentId, memoryManager]);
  
  // Cleanup all component listeners on unmount
  useEffect(() => {
    return () => {
      memoryManager.unregisterComponentListeners(componentId);
    };
  }, [componentId, memoryManager]);
  
  // Métodos helper
  
  /**
   * Emitir un evento al servidor
   */
  const emitir = (evento: string, datos: any): void => {
    if (!socket) {
      return;
    }
    
    if (!estaConectado) {
      return;
    }
    
    socket.emit(evento, datos);
  };
  
  /**
   * Escuchar un evento específico
   */
  const escuchar = <T = any>(evento: string, callback: (datos: T) => void): void => {
    if (!socket) {
      return;
    }
    
    socket.on(evento, callback);
  };
  
  /**
   * Dejar de escuchar un evento
   */
  const dejarDeEscuchar = (evento: string, callback?: Function): void => {
    if (!socket) {
      return;
    }
    
    if (callback) {
      socket.off(evento, callback as any);
    } else {
      socket.off(evento);
    }
  };
  
  // Retornar interfaz del hook
  return {
    socket,
    estaConectado,
    estadoConexion,
    ultimoError,
    intentosReconexion,
    latencia,
    emitir,
    escuchar,
    dejarDeEscuchar,
    reconectar,
    desconectar,
  };
}
