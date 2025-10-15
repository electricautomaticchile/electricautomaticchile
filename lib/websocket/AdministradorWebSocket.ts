/**
 * AdministradorWebSocket - Clase para gestionar conexiones WebSocket
 * 
 * Responsabilidades:
 * - Gestionar el ciclo de vida de la conexión Socket.IO
 * - Manejar la autenticación con JWT
 * - Implementar lógica de reconexión con retroceso exponencial
 * - Gestionar listeners de eventos
 * - Proveer estado de conexión
 * - Mantener conexión activa mediante heartbeat
 */

import { io, Socket } from 'socket.io-client';
import type { EstadoConexion, OpcionesWebSocket } from './tipos';
import { wsLogger } from './logger';

export class AdministradorWebSocket {
  private socket: Socket | null = null;
  private intentosReconexion: number = 0;
  private maxIntentosReconexion: number;
  private retrasoReconexion: number;
  private retrasoReconexionMax: number;
  private url: string;
  private opciones: OpcionesWebSocket;
  private estadoActual: EstadoConexion = 'desconectado';
  private tokenActual: string | null = null;
  
  // Heartbeat
  private intervaloHeartbeat: NodeJS.Timeout | null = null;
  private timeoutHeartbeat: NodeJS.Timeout | null = null;
  private tiempoIntervaloHeartbeat: number;
  private tiempoTimeoutHeartbeat: number;
  
  // Callbacks de estado
  private callbacksEstado: Map<string, ((estado: EstadoConexion) => void)[]> = new Map();
  
  // Delays de reconexión con retroceso exponencial
  private readonly delaysReconexion = [1000, 2000, 5000, 10000, 30000]; // ms

  constructor(url: string, opciones?: Partial<OpcionesWebSocket>) {
    this.url = url;
    this.opciones = {
      url,
      conectarAutomaticamente: opciones?.conectarAutomaticamente ?? false,
      reconexion: opciones?.reconexion ?? true,
      intentosReconexion: opciones?.intentosReconexion ?? 5,
      retrasoReconexion: opciones?.retrasoReconexion ?? 1000,
      retrasoReconexionMax: opciones?.retrasoReconexionMax ?? 30000,
      timeout: opciones?.timeout ?? 20000,
      intervaloHeartbeat: opciones?.intervaloHeartbeat ?? 25000,
      timeoutHeartbeat: opciones?.timeoutHeartbeat ?? 60000,
    };
    
    this.maxIntentosReconexion = this.opciones.intentosReconexion!;
    this.retrasoReconexion = this.opciones.retrasoReconexion!;
    this.retrasoReconexionMax = this.opciones.retrasoReconexionMax!;
    this.tiempoIntervaloHeartbeat = this.opciones.intervaloHeartbeat!;
    this.tiempoTimeoutHeartbeat = this.opciones.timeoutHeartbeat!;
  }

  /**
   * Conectar al servidor WebSocket con autenticación JWT
   */
  async conectar(token: string): Promise<void> {
    if (this.socket?.connected) {
      wsLogger.logAdvertencia('Intento de conectar cuando ya está conectado');
      return;
    }

    this.tokenActual = token;
    this.cambiarEstado('conectando');
    wsLogger.logIntentoConexion({ url: this.url });

    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.url, {
          auth: {
            token,
          },
          transports: ['websocket', 'polling'],
          timeout: this.opciones.timeout,
          reconnection: false, // Manejamos reconexión manualmente
        });

        this.configurarEventosConexion(resolve, reject);
        this.configurarHeartbeat();
      } catch (error) {
        this.cambiarEstado('desconectado');
        wsLogger.logErrorConexion(error as Error, { url: this.url });
        reject(error);
      }
    });
  }

  /**
   * Desconectar del servidor WebSocket
   */
  desconectar(): void {
    if (!this.socket) {
      return;
    }

    wsLogger.logInfo('Desconectando WebSocket manualmente');
    
    // Limpiar heartbeat
    this.limpiarHeartbeat();
    
    // Desconectar socket
    this.socket.disconnect();
    this.socket.removeAllListeners();
    this.socket = null;
    
    // Reiniciar estado
    this.intentosReconexion = 0;
    this.tokenActual = null;
    this.cambiarEstado('desconectado');
  }

  /**
   * Escuchar un evento específico
   */
  escuchar<T = any>(evento: string, callback: (datos: T) => void): void {
    if (!this.socket) {
      wsLogger.logAdvertencia('No hay socket disponible para escuchar evento', { evento });
      return;
    }

    // Envolver callback con manejo de errores
    const callbackSeguro = (datos: T) => {
      try {
        wsLogger.logEventoRecibido(evento, { datos });
        callback(datos);
      } catch (error) {
        wsLogger.logErrorManejadorEvento(evento, error as Error, { datos });
      }
    };

    this.socket.on(evento, callbackSeguro);
  }

  /**
   * Dejar de escuchar un evento
   */
  dejarDeEscuchar(evento: string, callback?: Function): void {
    if (!this.socket) {
      return;
    }

    if (callback) {
      this.socket.off(evento, callback as any);
    } else {
      this.socket.off(evento);
    }
  }

  /**
   * Emitir un evento al servidor
   */
  emitir(evento: string, datos: any): void {
    if (!this.socket?.connected) {
      wsLogger.logAdvertencia('No conectado. No se puede emitir evento', { evento });
      return;
    }

    try {
      this.socket.emit(evento, datos);
      wsLogger.logEventoEmitido(evento, { datos });
    } catch (error) {
      wsLogger.logErrorManejadorEvento(evento, error as Error, { datos });
    }
  }

  /**
   * Obtener el estado actual de la conexión
   */
  obtenerEstadoConexion(): EstadoConexion {
    return this.estadoActual;
  }

  /**
   * Verificar si está conectado
   */
  estaConectado(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Obtener el socket directo (para casos especiales)
   */
  obtenerSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Suscribirse a cambios de estado
   */
  suscribirseAEstado(id: string, callback: (estado: EstadoConexion) => void): void {
    if (!this.callbacksEstado.has(id)) {
      this.callbacksEstado.set(id, []);
    }
    this.callbacksEstado.get(id)!.push(callback);
  }

  /**
   * Desuscribirse de cambios de estado
   */
  desuscribirseDeEstado(id: string): void {
    this.callbacksEstado.delete(id);
  }

  /**
   * Configurar eventos de conexión
   */
  private configurarEventosConexion(
    resolve: () => void,
    reject: (error: Error) => void
  ): void {
    if (!this.socket) return;

    // Conexión exitosa
    this.socket.on('connect', () => {
      const socketId = this.socket?.id;
      
      if (this.intentosReconexion > 0) {
        wsLogger.logReconexionExitosa(this.intentosReconexion, { socketId });
      } else {
        wsLogger.logConexionExitosa({ socketId });
      }
      
      this.cambiarEstado('conectado');
      this.intentosReconexion = 0;
      resolve();
    });

    // Error de conexión
    this.socket.on('connect_error', (error) => {
      wsLogger.logErrorConexion(error, { 
        intentoReconexion: this.intentosReconexion,
        url: this.url 
      });
      this.cambiarEstado('desconectado');
      
      if (this.opciones.reconexion && this.intentosReconexion < this.maxIntentosReconexion) {
        this.manejarReconexion();
      } else {
        if (this.intentosReconexion >= this.maxIntentosReconexion) {
          wsLogger.logMaxIntentosAlcanzado(this.maxIntentosReconexion);
        }
        reject(new Error(`Error de conexión: ${error.message}`));
      }
    });

    // Desconexión
    this.socket.on('disconnect', (reason) => {
      wsLogger.logDesconexion(reason, { socketId: this.socket?.id });
      this.cambiarEstado('desconectado');
      this.limpiarHeartbeat();
      
      // Reconectar automáticamente si no fue desconexión manual
      if (reason !== 'io client disconnect' && this.opciones.reconexion) {
        this.manejarReconexion();
      }
    });

    // Error de autenticación
    this.socket.on('error', (error: any) => {
      if (error.type === 'UnauthorizedError' || error.message?.includes('authentication')) {
        wsLogger.logErrorAutenticacion(error, { socketId: this.socket?.id });
        this.cambiarEstado('desconectado');
        reject(new Error('Error de autenticación'));
      } else {
        wsLogger.logErrorRed(error, { socketId: this.socket?.id });
      }
    });
  }

  /**
   * Manejar reconexión con retroceso exponencial
   */
  private manejarReconexion(): void {
    if (this.intentosReconexion >= this.maxIntentosReconexion) {
      wsLogger.logMaxIntentosAlcanzado(this.maxIntentosReconexion);
      this.cambiarEstado('desconectado');
      return;
    }

    this.cambiarEstado('reconectando');
    this.intentosReconexion++;

    const delay = this.calcularDelayReconexion(this.intentosReconexion);
    
    wsLogger.logIntentoReconexion(this.intentosReconexion, delay, {
      maxIntentos: this.maxIntentosReconexion,
    });

    setTimeout(() => {
      if (this.tokenActual) {
        this.conectar(this.tokenActual).catch((error) => {
          wsLogger.logReconexionFallida(this.intentosReconexion, error as Error);
        });
      }
    }, delay);
  }

  /**
   * Calcular delay de reconexión con retroceso exponencial y jitter
   */
  private calcularDelayReconexion(intento: number): number {
    // Obtener delay base según el intento
    const indice = Math.min(intento - 1, this.delaysReconexion.length - 1);
    const delayBase = this.delaysReconexion[indice];
    
    // Agregar jitter aleatorio (0-1000ms) para evitar thundering herd
    const jitter = Math.random() * 1000;
    
    // Asegurar que no exceda el máximo
    return Math.min(delayBase + jitter, this.retrasoReconexionMax);
  }

  /**
   * Configurar sistema de heartbeat (ping/pong)
   */
  private configurarHeartbeat(): void {
    if (!this.socket) return;

    // Limpiar heartbeat anterior si existe
    this.limpiarHeartbeat();

    // Enviar ping cada 25 segundos
    this.intervaloHeartbeat = setInterval(() => {
      if (this.socket?.connected) {
        const tiempoInicio = Date.now();
        
        this.socket.emit('ping', { timestamp: tiempoInicio });
        
        // Configurar timeout para detectar desconexión
        this.timeoutHeartbeat = setTimeout(() => {
          wsLogger.logHeartbeatTimeout({ socketId: this.socket?.id });
          this.socket?.disconnect();
        }, this.tiempoTimeoutHeartbeat);
      }
    }, this.tiempoIntervaloHeartbeat);

    // Escuchar respuesta pong
    this.socket.on('pong', (data: { timestamp: number }) => {
      // Limpiar timeout ya que recibimos respuesta
      if (this.timeoutHeartbeat) {
        clearTimeout(this.timeoutHeartbeat);
        this.timeoutHeartbeat = null;
      }
      
      // Calcular latencia
      const latencia = Date.now() - data.timestamp;
      wsLogger.logHeartbeat(latencia, { socketId: this.socket?.id });
    });
  }

  /**
   * Limpiar timers de heartbeat
   */
  private limpiarHeartbeat(): void {
    if (this.intervaloHeartbeat) {
      clearInterval(this.intervaloHeartbeat);
      this.intervaloHeartbeat = null;
    }
    
    if (this.timeoutHeartbeat) {
      clearTimeout(this.timeoutHeartbeat);
      this.timeoutHeartbeat = null;
    }
  }

  /**
   * Cambiar estado y notificar a suscriptores
   */
  private cambiarEstado(nuevoEstado: EstadoConexion): void {
    if (this.estadoActual === nuevoEstado) {
      return;
    }

    const estadoAnterior = this.estadoActual;
    this.estadoActual = nuevoEstado;
    
    wsLogger.logCambioEstado(estadoAnterior, nuevoEstado, { 
      socketId: this.socket?.id 
    });

    // Notificar a todos los suscriptores
    this.callbacksEstado.forEach((callbacks) => {
      callbacks.forEach((callback) => {
        try {
          callback(nuevoEstado);
        } catch (error) {
          wsLogger.logErrorManejadorEvento('cambio_estado', error as Error, {
            estadoAnterior,
            estadoNuevo: nuevoEstado,
          });
        }
      });
    });
  }
}
