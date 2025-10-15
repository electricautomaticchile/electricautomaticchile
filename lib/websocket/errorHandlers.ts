/**
 * Manejadores de errores para WebSocket
 * 
 * Proporciona funciones especializadas para manejar diferentes tipos de errores:
 * - Errores de autenticación
 * - Errores de red
 * - Errores de eventos
 */

import { wsLogger } from './logger';
import { TokenManager } from '../api/utils/tokenManager';

/**
 * Tipos de errores WebSocket
 */
export enum TipoErrorWebSocket {
  AUTENTICACION = 'autenticacion',
  RED = 'red',
  TIMEOUT = 'timeout',
  EVENTO = 'evento',
  DESCONOCIDO = 'desconocido',
}

/**
 * Interfaz para errores WebSocket estructurados
 */
export interface ErrorWebSocket {
  tipo: TipoErrorWebSocket;
  mensaje: string;
  error: Error | string;
  recuperable: boolean;
  accionRecomendada: string;
}

/**
 * Detectar el tipo de error
 */
export function detectarTipoError(error: any): TipoErrorWebSocket {
  if (!error) {
    return TipoErrorWebSocket.DESCONOCIDO;
  }

  const errorMsg = error.message || error.toString().toLowerCase();
  const errorType = error.type?.toLowerCase() || '';

  // Errores de autenticación
  if (
    errorType === 'unauthorizederror' ||
    errorMsg.includes('authentication') ||
    errorMsg.includes('unauthorized') ||
    errorMsg.includes('jwt') ||
    errorMsg.includes('token') ||
    errorMsg.includes('forbidden') ||
    error.status === 401 ||
    error.status === 403
  ) {
    return TipoErrorWebSocket.AUTENTICACION;
  }

  // Errores de timeout
  if (
    errorMsg.includes('timeout') ||
    errorMsg.includes('timed out') ||
    error.code === 'ETIMEDOUT'
  ) {
    return TipoErrorWebSocket.TIMEOUT;
  }

  // Errores de red
  if (
    errorMsg.includes('network') ||
    errorMsg.includes('connection') ||
    errorMsg.includes('econnrefused') ||
    errorMsg.includes('enotfound') ||
    error.code === 'ECONNREFUSED' ||
    error.code === 'ENOTFOUND' ||
    error.code === 'ENETUNREACH'
  ) {
    return TipoErrorWebSocket.RED;
  }

  return TipoErrorWebSocket.DESCONOCIDO;
}

/**
 * Clasificar error y obtener información estructurada
 */
export function clasificarError(error: any): ErrorWebSocket {
  const tipo = detectarTipoError(error);
  const mensaje = error.message || error.toString();

  switch (tipo) {
    case TipoErrorWebSocket.AUTENTICACION:
      return {
        tipo,
        mensaje: 'Error de autenticación',
        error,
        recuperable: false,
        accionRecomendada: 'Iniciar sesión nuevamente',
      };

    case TipoErrorWebSocket.RED:
      return {
        tipo,
        mensaje: 'Error de conexión de red',
        error,
        recuperable: true,
        accionRecomendada: 'Verificar conexión a internet',
      };

    case TipoErrorWebSocket.TIMEOUT:
      return {
        tipo,
        mensaje: 'Tiempo de espera agotado',
        error,
        recuperable: true,
        accionRecomendada: 'Reintentar conexión',
      };

    case TipoErrorWebSocket.EVENTO:
      return {
        tipo,
        mensaje: 'Error procesando evento',
        error,
        recuperable: true,
        accionRecomendada: 'El evento será ignorado',
      };

    default:
      return {
        tipo: TipoErrorWebSocket.DESCONOCIDO,
        mensaje: mensaje || 'Error desconocido',
        error,
        recuperable: true,
        accionRecomendada: 'Reintentar operación',
      };
  }
}

/**
 * Manejar error de autenticación
 * 
 * Acciones:
 * - Loggear el error
 * - Limpiar tokens
 * - Retornar información para redirigir al login
 */
export function manejarErrorAutenticacion(
  error: any,
  contexto?: Record<string, any>
): {
  debeRedirigir: boolean;
  rutaRedireccion: string;
  mensajeUsuario: string;
} {
  wsLogger.logErrorAutenticacion(error, contexto);

  // Limpiar tokens de autenticación
  try {
    TokenManager.clearTokens();
    wsLogger.logInfo('Tokens de autenticación limpiados', { razon: 'error_autenticacion' });
  } catch (clearError) {
    wsLogger.logErrorRed('Error al limpiar tokens', { error: clearError as Error });
  }

  return {
    debeRedirigir: true,
    rutaRedireccion: '/auth/login',
    mensajeUsuario: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  };
}

/**
 * Manejar error de red
 * 
 * Acciones:
 * - Loggear el error
 * - Determinar si debe reconectar automáticamente
 * - Retornar información para mostrar al usuario
 */
export function manejarErrorRed(
  error: any,
  contexto?: Record<string, any>
): {
  debeReintentar: boolean;
  mensajeUsuario: string;
  mostrarReconexionManual: boolean;
} {
  wsLogger.logErrorRed(error, contexto);

  const errorClasificado = clasificarError(error);

  return {
    debeReintentar: errorClasificado.recuperable,
    mensajeUsuario: 'Problemas de conexión. Reintentando automáticamente...',
    mostrarReconexionManual: true,
  };
}

/**
 * Manejar error en manejador de evento
 * 
 * Acciones:
 * - Loggear el error
 * - No crashear la aplicación
 * - Retornar información para debugging
 */
export function manejarErrorEvento(
  evento: string,
  error: any,
  datos?: any
): {
  errorCapturado: boolean;
  debeNotificarUsuario: boolean;
  mensajeUsuario?: string;
} {
  wsLogger.logErrorManejadorEvento(evento, error, { datos });

  // Determinar si es un error crítico que debe notificarse al usuario
  const esCritico = error.message?.includes('critical') || error.severity === 'high';

  return {
    errorCapturado: true,
    debeNotificarUsuario: esCritico,
    mensajeUsuario: esCritico
      ? 'Ocurrió un error al procesar datos en tiempo real'
      : undefined,
  };
}

/**
 * Wrapper seguro para ejecutar callbacks con manejo de errores
 */
export function ejecutarConManejadorErrores<T>(
  callback: () => T,
  contexto: {
    operacion: string;
    evento?: string;
    datos?: any;
  }
): T | null {
  try {
    return callback();
  } catch (error) {
    const errorClasificado = clasificarError(error);

    wsLogger.logErrorManejadorEvento(
      contexto.operacion || 'operacion_desconocida',
      error as Error,
      contexto
    );

    // No lanzar el error, retornar null para no crashear la app
    return null;
  }
}

/**
 * Crear mensaje de error amigable para el usuario
 */
export function crearMensajeUsuario(error: any): string {
  const errorClasificado = clasificarError(error);

  const mensajes: Record<TipoErrorWebSocket, string> = {
    [TipoErrorWebSocket.AUTENTICACION]:
      'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    [TipoErrorWebSocket.RED]:
      'Problemas de conexión. Verifica tu conexión a internet.',
    [TipoErrorWebSocket.TIMEOUT]:
      'La conexión está tardando más de lo esperado. Reintentando...',
    [TipoErrorWebSocket.EVENTO]:
      'Ocurrió un error al procesar los datos. Intenta nuevamente.',
    [TipoErrorWebSocket.DESCONOCIDO]:
      'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
  };

  return mensajes[errorClasificado.tipo] || mensajes[TipoErrorWebSocket.DESCONOCIDO];
}

/**
 * Determinar si un error debe mostrar notificación al usuario
 */
export function debeNotificarUsuario(error: any): boolean {
  const tipo = detectarTipoError(error);

  // Notificar errores de autenticación y errores críticos
  return (
    tipo === TipoErrorWebSocket.AUTENTICACION ||
    error.severity === 'high' ||
    error.critical === true
  );
}
