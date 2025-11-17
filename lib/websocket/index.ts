/**
 * Módulo WebSocket - Exportaciones principales
 */

export { AdministradorWebSocket } from './AdministradorWebSocket';
export { ContextoWebSocket } from './WebSocketContext';
export { ProveedorWebSocket } from './ProveedorWebSocket';
export { useWebSocket } from './useWebSocket';
export type { ValorContextoWebSocket } from './WebSocketContext';
export type { RetornoUseWebSocket } from './useWebSocket';
export type {
  EstadoConexion,
  OpcionesWebSocket,
  ActualizacionVoltajeDispositivo,
  ActualizacionCorrienteDispositivo,
  ActualizacionPotenciaDispositivo,
  ActualizacionConexionDispositivo,
  AlertaIoT,
  ResultadoComandoHardware,
  NotificacionData,
  ActualizacionSensorHardware,
  ActualizacionReleHardware,
} from './tipos';

// Exportar manejadores de eventos
export * from './manejadores';

// Exportar utilidades de rendimiento
export {
  debounce,
  throttle,
  throttleRAF,
  createEventBuffer,
  createDebouncedEventHandler,
  createThrottledUIHandler,
  createBatchProcessor,
} from './performanceUtils';
export type { EventBufferConfig, EventEntry } from './performanceUtils';

// Exportar hooks optimizados
export {
  useWebSocketThrottled,
  useWebSocketHistory,
  useWebSocketAggregated,
  useWebSocketLatest,
  useWebSocketBatched,
  useWebSocketConditional,
} from './optimizedHooks';

// Componentes optimizados eliminados (no se usaban)

// Exportar gestión de memoria
export {
  MemoryManager,
  getMemoryManager,
  resetMemoryManager,
  useListenerCleanup,
} from './memoryManager';
export type { MemoryManagerConfig } from './memoryManager';
