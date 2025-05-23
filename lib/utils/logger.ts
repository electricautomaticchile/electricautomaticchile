/**
 * Sistema de logging centralizado y seguro
 * Solo registra información en desarrollo y usa niveles apropiados
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Debug - Solo en desarrollo
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`🔍 [DEBUG] ${message}`, context || '');
    }
  }

  /**
   * Info - Solo en desarrollo 
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`ℹ️ [INFO] ${message}`, context || '');
    }
  }

  /**
   * Warning - En todos los entornos
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`⚠️ [WARN] ${message}`, context || '');
  }

  /**
   * Error - En todos los entornos
   */
  error(message: string, error?: Error | LogContext): void {
    if (error instanceof Error) {
      console.error(`❌ [ERROR] ${message}`, {
        error: error.message,
        stack: this.isDevelopment ? error.stack : undefined
      });
    } else {
      console.error(`❌ [ERROR] ${message}`, error || '');
    }
  }

  /**
   * Logging de seguridad - Siempre se registra
   */
  security(message: string, context?: LogContext): void {
    console.warn(`🔒 [SECURITY] ${message}`, context || '');
  }

  /**
   * Logging de autenticación - Solo eventos importantes
   */
  auth(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`🔐 [AUTH] ${message}`, context || '');
    }
  }

  /**
   * Logging de base de datos - Solo errores en producción
   */
  database(level: LogLevel, message: string, context?: LogContext): void {
    switch (level) {
      case 'debug':
      case 'info':
        if (this.isDevelopment) {
          console.log(`🗄️ [DB] ${message}`, context || '');
        }
        break;
      case 'warn':
        console.warn(`🗄️ [DB] ${message}`, context || '');
        break;
      case 'error':
        console.error(`🗄️ [DB] ${message}`, context || '');
        break;
    }
  }

  /**
   * Logging de API - Solo en desarrollo excepto errores
   */
  api(level: LogLevel, message: string, context?: LogContext): void {
    switch (level) {
      case 'debug':
      case 'info':
        if (this.isDevelopment) {
          console.log(`🌐 [API] ${message}`, context || '');
        }
        break;
      case 'warn':
        console.warn(`🌐 [API] ${message}`, context || '');
        break;
      case 'error':
        console.error(`🌐 [API] ${message}`, context || '');
        break;
    }
  }

  /**
   * Logging de archivos - Solo eventos importantes
   */
  file(level: LogLevel, message: string, context?: LogContext): void {
    switch (level) {
      case 'debug':
      case 'info':
        if (this.isDevelopment) {
          console.log(`📁 [FILE] ${message}`, context || '');
        }
        break;
      case 'warn':
        console.warn(`📁 [FILE] ${message}`, context || '');
        break;
      case 'error':
        console.error(`📁 [FILE] ${message}`, context || '');
        break;
    }
  }

  /**
   * Success - Solo en desarrollo
   */
  success(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`✅ [SUCCESS] ${message}`, context || '');
    }
  }

  /**
   * Sanitiza contexto para evitar logging de datos sensibles
   */
  private sanitizeContext(context: LogContext): LogContext {
    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'authorization',
      'credit_card', 'ssn', 'rut', 'access_token', 'refresh_token'
    ];

    const sanitized = { ...context };

    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}

// Instancia singleton
export const logger = new Logger();

// Exportar para compatibilidad
export default logger; 