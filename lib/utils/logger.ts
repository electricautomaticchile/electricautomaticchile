// Logger centralizado para el frontend
export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  data?: Record<string, unknown>;
}

class Logger {
  private isProduction = process.env.NODE_ENV === "production";
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private shouldLog(level: LogLevel): boolean {
    if (this.isProduction) {
      // En producción, solo loggear errores
      return level === "error";
    }
    return true;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);

    // Mantener solo los últimos maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: string
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : "";
    return `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}`;
  }

  debug(
    message: string,
    context?: string,
    data?: Record<string, unknown>
  ): void {
    if (!this.shouldLog("debug")) return;

    const entry: LogEntry = {
      level: "debug",
      message,
      timestamp: new Date(),
      context,
      data,
    };

    this.addLog(entry);

    if (!this.isProduction) {
      console.debug(this.formatMessage("debug", message, context), data || "");
    }
  }

  info(
    message: string,
    context?: string,
    data?: Record<string, unknown>
  ): void {
    if (!this.shouldLog("info")) return;

    const entry: LogEntry = {
      level: "info",
      message,
      timestamp: new Date(),
      context,
      data,
    };

    this.addLog(entry);

    if (!this.isProduction) {
      console.info(this.formatMessage("info", message, context), data || "");
    }
  }

  warn(
    message: string,
    context?: string,
    data?: Record<string, unknown>
  ): void {
    if (!this.shouldLog("warn")) return;

    const entry: LogEntry = {
      level: "warn",
      message,
      timestamp: new Date(),
      context,
      data,
    };

    this.addLog(entry);

    if (!this.isProduction) {
      console.warn(this.formatMessage("warn", message, context), data || "");
    }
  }

  error(
    message: string,
    context?: string,
    data?: Record<string, unknown>
  ): void {
    const entry: LogEntry = {
      level: "error",
      message,
      timestamp: new Date(),
      context,
      data,
    };

    this.addLog(entry);

    // Los errores siempre se loggean, incluso en producción
    console.error(this.formatMessage("error", message, context), data || "");

    // En producción, enviar errores a servicio de monitoreo
    if (this.isProduction) {
      this.sendToMonitoring(entry);
    }
  }

  private async sendToMonitoring(entry: LogEntry): Promise<void> {
    try {
      // Aquí se podría integrar con servicios como Sentry, LogRocket, etc.
      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Silenciosamente fallar si no se puede enviar el log
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  getLogsSummary(): Record<LogLevel, number> {
    return this.logs.reduce(
      (summary, log) => {
        summary[log.level]++;
        return summary;
      },
      { debug: 0, info: 0, warn: 0, error: 0 }
    );
  }
}

// Instancia singleton del logger
export const logger = new Logger();

// Funciones de conveniencia
export const logDebug = (
  message: string,
  context?: string,
  data?: Record<string, unknown>
) => logger.debug(message, context, data);

export const logInfo = (
  message: string,
  context?: string,
  data?: Record<string, unknown>
) => logger.info(message, context, data);

export const logWarn = (
  message: string,
  context?: string,
  data?: Record<string, unknown>
) => logger.warn(message, context, data);

export const logError = (
  message: string,
  context?: string,
  data?: Record<string, unknown>
) => logger.error(message, context, data);
