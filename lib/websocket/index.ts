/**
 * Módulo WebSocket - Exportaciones principales
 *
 * NOTA: el stack socket.io (AdministradorWebSocket, ProveedorWebSocket,
 * WebSocketContext) fue eliminado. El backend usa WebSocket nativo (gorilla),
 * así que el cliente oficial es `useWebSocket` de ./useWebSocket.
 */

export { useWebSocket } from './useWebSocket';
export type { RetornoUseWebSocket, WSMessage } from './useWebSocket';
export { getWebSocketUrl, getWebSocketBase, WS_CONNECT_PATH } from './wsUrl';

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

// Manejadores de eventos
export * from './manejadores';

// Utilidades de rendimiento
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

// Hooks optimizados
export {
  useWebSocketThrottled,
  useWebSocketHistory,
  useWebSocketAggregated,
  useWebSocketLatest,
  useWebSocketBatched,
  useWebSocketConditional,
} from './optimizedHooks';

// Gestión de memoria
export {
  MemoryManager,
  getMemoryManager,
  resetMemoryManager,
  useListenerCleanup,
} from './memoryManager';
export type { MemoryManagerConfig } from './memoryManager';
