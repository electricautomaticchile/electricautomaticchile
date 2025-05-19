/**
 * Sistema de logs para la aplicación con niveles y formateado
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// Configuración global de logging
const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'production' 
  ? LOG_LEVELS.INFO 
  : LOG_LEVELS.DEBUG;

// Colores para consola
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

class Logger {
  private module: string;
  private logLevel: number;

  constructor(module: string, logLevel = DEFAULT_LOG_LEVEL) {
    this.module = module;
    this.logLevel = logLevel;
  }

  // Formatear mensaje de log con timestamp y módulo
  private format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.module}] ${message}`;
  }

  // Logs para objetos complejos
  private formatData(data: any): string {
    if (typeof data === 'object') {
      try {
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return String(data);
      }
    }
    return String(data);
  }

  // Métodos públicos para diferentes niveles de log
  debug(message: string, data?: any): void {
    if (this.logLevel <= LOG_LEVELS.DEBUG) {
      const logMessage = this.format('DEBUG', message);
      console.debug(`${COLORS.blue}${logMessage}${COLORS.reset}`);
      if (data !== undefined) {
        console.debug(this.formatData(data));
      }
    }
  }

  info(message: string, data?: any): void {
    if (this.logLevel <= LOG_LEVELS.INFO) {
      const logMessage = this.format('INFO', message);
      console.info(`${COLORS.green}${logMessage}${COLORS.reset}`);
      if (data !== undefined) {
        console.info(this.formatData(data));
      }
    }
  }

  warn(message: string, data?: any): void {
    if (this.logLevel <= LOG_LEVELS.WARN) {
      const logMessage = this.format('WARN', message);
      console.warn(`${COLORS.yellow}${logMessage}${COLORS.reset}`);
      if (data !== undefined) {
        console.warn(this.formatData(data));
      }
    }
  }

  error(message: string, error?: any): void {
    if (this.logLevel <= LOG_LEVELS.ERROR) {
      const logMessage = this.format('ERROR', message);
      console.error(`${COLORS.red}${logMessage}${COLORS.reset}`);
      
      if (error) {
        if (error instanceof Error) {
          console.error(`${COLORS.red}${error.message}${COLORS.reset}`);
          console.error(`${COLORS.red}${error.stack}${COLORS.reset}`);
        } else {
          console.error(this.formatData(error));
        }
      }
    }
  }

  // Método para errores críticos que siempre deben ser registrados
  critical(message: string, error?: any): void {
    const logMessage = this.format('CRITICAL', message);
    console.error(`${COLORS.magenta}${logMessage}${COLORS.reset}`);
    
    if (error) {
      if (error instanceof Error) {
        console.error(`${COLORS.magenta}${error.message}${COLORS.reset}`);
        console.error(`${COLORS.magenta}${error.stack}${COLORS.reset}`);
      } else {
        console.error(this.formatData(error));
      }
    }

    // En producción, aquí podríamos enviar notificaciones o registrar en sistemas externos
    if (process.env.NODE_ENV === 'production') {
      try {
        // Aquí podrías implementar envío a sistemas como CloudWatch, Sentry, etc.
        this.sendToMonitoringSystem(message, error);
      } catch (e) {
        console.error(`Error enviando alerta: ${e}`);
      }
    }
  }

  // Método para enviar a sistemas de monitoreo externos (implementar según necesidad)
  private sendToMonitoringSystem(message: string, data?: any): void {
    // Implementación para conectar con sistema de monitoreo
    // Ejemplo: fetch a webhook, envío a CloudWatch, etc.
  }
}

// Crear y exportar instancias del logger para diferentes módulos
export const createLogger = (module: string): Logger => {
  return new Logger(module);
};

// Ejemplos de uso por módulo
export const dbLogger = createLogger('database');
export const apiLogger = createLogger('api');
export const authLogger = createLogger('auth');

export default Logger; 