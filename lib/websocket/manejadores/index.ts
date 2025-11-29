/**
 * Índice de Manejadores de Eventos WebSocket
 * 
 * Este archivo exporta todos los manejadores de eventos y proporciona
 * una función conveniente para registrar todos los manejadores a la vez.
 */

// Exportar manejadores IoT
export {
  manejarActualizacionVoltaje,
  manejarActualizacionCorriente,
  manejarActualizacionPotencia,
  manejarActualizacionConexion,
  manejarAlertaIoT,
  registrarManejadoresIoT,
  obtenerUltimasActualizacionesDispositivo,
  obtenerAlertasActivas,
} from './manejadoresIoT';

// Exportar manejadores de notificaciones
export {
  manejarNotificacionRecibida,
  manejarNotificacionLeida,
  registrarManejadoresNotificaciones,
  actualizarContadorNotificaciones,
  obtenerTodasNotificaciones,
  obtenerNotificacionesNoLeidas,
  obtenerNotificacionesLeidas,
  obtenerContadorNoLeidas,
  marcarNotificacionComoLeida,
  marcarTodasComoLeidas,
  limpiarNotificacionesAntiguas,
  useContadorNotificaciones,
} from './manejadoresNotificaciones';

// Exportar tipos de notificaciones
export type { NotificacionRecibida, NotificacionLeida } from './manejadoresNotificaciones';

// Exportar manejadores de hardware
export {
  manejarResultadoComando,
  manejarActualizacionSensor,
  manejarActualizacionRele,
  registrarManejadoresHardware,
  obtenerLecturasSensoresDispositivo,
  obtenerUltimaLecturaSensor,
  obtenerEstadoRelesDispositivo,
  obtenerEstadoRele,
  obtenerHistorialComandos,
  obtenerEstadisticasComandos,
  enviarComandoDispositivo,
  controlarRele,
  solicitarLecturaSensor,
} from './manejadoresHardware';

/**
 * Registrar todos los manejadores de eventos WebSocket
 * 
 * Esta función registra todos los manejadores de eventos (IoT, notificaciones, hardware)
 * en el socket proporcionado.
 * 
 * @param escuchar - Función para escuchar eventos del socket
 * 
 * @example
 * ```typescript
 * import { registrarTodosLosManejadores } from '@/lib/websocket/manejadores';
 * 
 * const socket = new AdministradorWebSocket(url);
 * registrarTodosLosManejadores(socket.escuchar.bind(socket));
 * ```
 */
export function registrarTodosLosManejadores(
  escuchar: <T>(evento: string, callback: (datos: T) => void) => void
): void {

  // Importar funciones de registro
  const { registrarManejadoresIoT } = require('./manejadoresIoT');
  const { registrarManejadoresNotificaciones } = require('./manejadoresNotificaciones');
  const { registrarManejadoresHardware } = require('./manejadoresHardware');

  // Registrar todos los manejadores
  registrarManejadoresIoT(escuchar);
  registrarManejadoresNotificaciones(escuchar);
  registrarManejadoresHardware(escuchar);

}

/**
 * Limpiar todos los eventos antiguos del store
 * 
 * Esta función limpia eventos antiguos de todos los tipos para liberar memoria.
 */
export function limpiarEventosAntiguos(): void {

  // Importar función de limpieza
  const { limpiarNotificacionesAntiguas } = require('./manejadoresNotificaciones');

  // Limpiar notificaciones antiguas
  limpiarNotificacionesAntiguas();

}
