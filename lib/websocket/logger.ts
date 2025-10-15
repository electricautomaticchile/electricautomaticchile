/**
 * Logger especializado para eventos WebSocket
 * 
 * Proporciona logging estructurado para:
 * - Conexiones y desconexiones
 * - Errores de autenticación
 * - Errores de red
 * - Eventos recibidos/emitidos
 * - Métricas de rendimiento
 */

import { logger, type LogLevel } from '../utils/logger';
import type { EstadoConexion } from './tipos';

export interface WebSocketLogContext {
  socketId?: string;
  userId?: string;
  intentoReconexion?: number;
  latencia?: number;
  evento?: string;
  error?: Error | string;
  [key: string]: any;
}

export class WebSocketLogger {
  private context: string = 'WebSocket';
  private metricas: {
    conexionesExitosas: number;
    conexionesFallidas: number;
    reconexionesExitosas: number;
    reconexionesFallidas: number;
    eventosRecibidos: number;
    eventosEmitidos: number;
    errores: number;
  } = {
    conexionesExitosas: 0,
    conexionesFallidas: 0,
    reconexionesExitosas: 0,
    reconexionesFallidas: 0,
    eventosRecibidos: 0,
    eventosEmitidos: 0,
    errores: 0,
  };

  /**
   * Loggear conexión exitosa
   */
  logConexionExitosa(contexto?: WebSocketLogContext): void {
    this.metricas.conexionesExitosas++;
    logger.info(
      'Conexión WebSocket establecida exitosamente',
      this.context,
      {
        ...contexto,
        metrica: 'conexion_exitosa',
        totalConexiones: this.metricas.conexionesExitosas,
      }
    );
  }

  /**
   * Loggear intento de conexión
   */
  logIntentoConexion(contexto?: WebSocketLogContext): void {
    logger.debug(
      'Intentando conectar WebSocket',
      this.context,
      {
        ...contexto,
        metrica: 'intento_conexion',
      }
    );
  }

  /**
   * Loggear error de conexión
   */
  logErrorConexion(error: Error | string, contexto?: WebSocketLogContext): void {
    this.metricas.conexionesFallidas++;
    this.metricas.errores++;
    
    const errorMsg = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logger.error(
      `Error de conexión WebSocket: ${errorMsg}`,
      this.context,
      {
        ...contexto,
        error: errorMsg,
        stack: errorStack,
        metrica: 'error_conexion',
        totalErrores: this.metricas.errores,
      }
    );
  }

  /**
   * Loggear desconexión
   */
  logDesconexion(razon: string, contexto?: WebSocketLogContext): void {
    logger.info(
      `WebSocket desconectado: ${razon}`,
      this.context,
      {
        ...contexto,
        razon,
        metrica: 'desconexion',
      }
    );
  }

  /**
   * Loggear intento de reconexión
   */
  logIntentoReconexion(intento: number, delay: number, contexto?: WebSocketLogContext): void {
    logger.warn(
      `Intentando reconectar WebSocket (intento ${intento})`,
      this.context,
      {
        ...contexto,
        intentoReconexion: intento,
        delayMs: delay,
        metrica: 'intento_reconexion',
      }
    );
  }

  /**
   * Loggear reconexión exitosa
   */
  logReconexionExitosa(intento: number, contexto?: WebSocketLogContext): void {
    this.metricas.reconexionesExitosas++;
    logger.info(
      `WebSocket reconectado exitosamente después de ${intento} intentos`,
      this.context,
      {
        ...contexto,
        intentoReconexion: intento,
        metrica: 'reconexion_exitosa',
        totalReconexiones: this.metricas.reconexionesExitosas,
      }
    );
  }

  /**
   * Loggear reconexión fallida
   */
  logReconexionFallida(intento: number, error: Error | string, contexto?: WebSocketLogContext): void {
    this.metricas.reconexionesFallidas++;
    this.metricas.errores++;
    
    const errorMsg = error instanceof Error ? error.message : error;
    
    logger.error(
      `Reconexión WebSocket fallida (intento ${intento}): ${errorMsg}`,
      this.context,
      {
        ...contexto,
        intentoReconexion: intento,
        error: errorMsg,
        metrica: 'reconexion_fallida',
        totalReconexionesFallidas: this.metricas.reconexionesFallidas,
      }
    );
  }

  /**
   * Loggear máximo de intentos alcanzado
   */
  logMaxIntentosAlcanzado(intentos: number, contexto?: WebSocketLogContext): void {
    this.metricas.errores++;
    logger.error(
      `Máximo de intentos de reconexión alcanzado (${intentos})`,
      this.context,
      {
        ...contexto,
        intentosReconexion: intentos,
        metrica: 'max_intentos_alcanzado',
      }
    );
  }

  /**
   * Loggear error de autenticación
   */
  logErrorAutenticacion(error: Error | string, contexto?: WebSocketLogContext): void {
    this.metricas.errores++;
    
    const errorMsg = error instanceof Error ? error.message : error;
    
    logger.error(
      `Error de autenticación WebSocket: ${errorMsg}`,
      this.context,
      {
        ...contexto,
        error: errorMsg,
        metrica: 'error_autenticacion',
        tipoError: 'autenticacion',
      }
    );
  }

  /**
   * Loggear error de red
   */
  logErrorRed(error: Error | string, contexto?: WebSocketLogContext): void {
    this.metricas.errores++;
    
    const errorMsg = error instanceof Error ? error.message : error;
    
    logger.error(
      `Error de red WebSocket: ${errorMsg}`,
      this.context,
      {
        ...contexto,
        error: errorMsg,
        metrica: 'error_red',
        tipoError: 'red',
      }
    );
  }

  /**
   * Loggear evento recibido
   */
  logEventoRecibido(evento: string, contexto?: WebSocketLogContext): void {
    this.metricas.eventosRecibidos++;
    logger.debug(
      `Evento WebSocket recibido: ${evento}`,
      this.context,
      {
        ...contexto,
        evento,
        metrica: 'evento_recibido',
        totalEventosRecibidos: this.metricas.eventosRecibidos,
      }
    );
  }

  /**
   * Loggear evento emitido
   */
  logEventoEmitido(evento: string, contexto?: WebSocketLogContext): void {
    this.metricas.eventosEmitidos++;
    logger.debug(
      `Evento WebSocket emitido: ${evento}`,
      this.context,
      {
        ...contexto,
        evento,
        metrica: 'evento_emitido',
        totalEventosEmitidos: this.metricas.eventosEmitidos,
      }
    );
  }

  /**
   * Loggear error en manejador de evento
   */
  logErrorManejadorEvento(evento: string, error: Error | string, contexto?: WebSocketLogContext): void {
    this.metricas.errores++;
    
    const errorMsg = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logger.error(
      `Error en manejador de evento '${evento}': ${errorMsg}`,
      this.context,
      {
        ...contexto,
        evento,
        error: errorMsg,
        stack: errorStack,
        metrica: 'error_manejador_evento',
        tipoError: 'manejador',
      }
    );
  }

  /**
   * Loggear heartbeat
   */
  logHeartbeat(latencia: number, contexto?: WebSocketLogContext): void {
    logger.debug(
      `Heartbeat WebSocket - Latencia: ${latencia}ms`,
      this.context,
      {
        ...contexto,
        latencia,
        metrica: 'heartbeat',
      }
    );
  }

  /**
   * Loggear timeout de heartbeat
   */
  logHeartbeatTimeout(contexto?: WebSocketLogContext): void {
    this.metricas.errores++;
    logger.warn(
      'Timeout de heartbeat WebSocket - Conexión perdida',
      this.context,
      {
        ...contexto,
        metrica: 'heartbeat_timeout',
        tipoError: 'timeout',
      }
    );
  }

  /**
   * Loggear cambio de estado
   */
  logCambioEstado(estadoAnterior: EstadoConexion, estadoNuevo: EstadoConexion, contexto?: WebSocketLogContext): void {
    logger.info(
      `Estado WebSocket: ${estadoAnterior} → ${estadoNuevo}`,
      this.context,
      {
        ...contexto,
        estadoAnterior,
        estadoNuevo,
        metrica: 'cambio_estado',
      }
    );
  }

  /**
   * Loggear advertencia
   */
  logAdvertencia(mensaje: string, contexto?: WebSocketLogContext): void {
    logger.warn(
      mensaje,
      this.context,
      {
        ...contexto,
        metrica: 'advertencia',
      }
    );
  }

  /**
   * Loggear información general
   */
  logInfo(mensaje: string, contexto?: WebSocketLogContext): void {
    logger.info(
      mensaje,
      this.context,
      {
        ...contexto,
        metrica: 'info',
      }
    );
  }

  /**
   * Obtener métricas actuales
   */
  obtenerMetricas() {
    return { ...this.metricas };
  }

  /**
   * Reiniciar métricas
   */
  reiniciarMetricas(): void {
    this.metricas = {
      conexionesExitosas: 0,
      conexionesFallidas: 0,
      reconexionesExitosas: 0,
      reconexionesFallidas: 0,
      eventosRecibidos: 0,
      eventosEmitidos: 0,
      errores: 0,
    };
  }

  /**
   * Obtener resumen de métricas
   */
  obtenerResumenMetricas(): string {
    const m = this.metricas;
    return `WebSocket Metrics: Conexiones=${m.conexionesExitosas}/${m.conexionesFallidas}, Reconexiones=${m.reconexionesExitosas}/${m.reconexionesFallidas}, Eventos=${m.eventosRecibidos}/${m.eventosEmitidos}, Errores=${m.errores}`;
  }
}

// Instancia singleton del logger WebSocket
export const wsLogger = new WebSocketLogger();
