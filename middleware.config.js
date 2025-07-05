/**
 * Configuración de middleware para AWS Amplify
 * Este archivo es reconocido por Amplify para configurar el comportamiento del middleware SSR
 */
module.exports = {
  // Configuración de timeouts
  timeouts: {
    // Timeout para todo el proceso en milisegundos (2 minutos)
    global: 120000,
    // Timeout para solicitudes HTTP individuales en milisegundos (1.5 minutos)
    request: 90000,
    // Timeout específico para subida de archivos (2 minutos)
    upload: 120000
  },
  // Configuración de caché
  cache: {
    // Estrategia de caché para páginas SSR
    strategy: 'default',
    // Tiempo de vida de la caché en segundos
    ttl: 60,
  },
  // Configuración de registros
  logging: {
    // Nivel de registro (debug, info, warn, error)
    level: 'info',
    // Formato de registro (json o text)
    format: 'json',
  },
  // Configuraciones avanzadas
  advanced: {
    // Número máximo de solicitudes concurrentes
    maxConcurrentRequests: 100,
    // Si se debe registrar información de rendimiento
    enablePerformanceLogging: true,
    // Límite de tamaño de carga aumentado para archivos (20MB)
    bodyParserLimit: '20mb',
    // Configuración específica para cargas de archivos
    fileUploads: {
      // Habilitar manejo mejorado de archivos
      enabled: true,
      // Tamaño máximo de archivo individual (15MB)
      maxFileSize: 15728640,
      // Tamaño máximo total de todos los archivos en una solicitud
      maxTotalSize: 20971520
    }
  }
};