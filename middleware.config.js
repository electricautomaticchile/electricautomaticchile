/**
 * Configuración de middleware para AWS Amplify
 * Este archivo es reconocido por Amplify para configurar el comportamiento del middleware SSR
 */
module.exports = {
  // Configuración de timeouts
  timeouts: {
    // Timeout para todo el proceso en milisegundos (30 segundos)
    global: 30000,
    // Timeout para solicitudes HTTP individuales en milisegundos (25 segundos)
    request: 25000,
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
  }
}; 