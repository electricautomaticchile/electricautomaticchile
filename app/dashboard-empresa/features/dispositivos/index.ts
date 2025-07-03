// Componente principal
export { DispositivosActivos } from "./DispositivosActivos";

// Subcomponentes
export { DispositivosActivosStats } from "./DispositivosActivosStats";
export { DispositivosActivosAcciones } from "./DispositivosActivosAcciones";
export { DispositivosActivosTabla } from "./DispositivosActivosTabla";
export { DispositivosActivosReducido } from "./DispositivosActivosReducido";

// Componentes de iconos y utilidades
export {
  BateriaIcon,
  EstadoDispositivo,
  IconoConexion,
  NivelSenal,
  NivelBateria,
  TemperaturaIndicador,
  BadgeEstado,
} from "./DispositivosActivosIconos";

// Hook personalizado
export { useDispositivosActivos } from "./useDispositivosActivos";

// Tipos e interfaces
export type {
  Dispositivo,
  ResumenDispositivos,
  DispositivosActivosProps,
  FiltrosDispositivos,
  ControlDispositivoPayload,
  DispositivoCardProps,
  DispositivosStatsProps,
  DispositivosTablaProps,
  DispositivosAccionesProps,
  DispositivosReducidoProps,
  WebSocketDeviceData,
  AutoUpdateConfig,
  EstadoConexion,
  AccionControl,
  ConfiguracionAlertas,
} from "./types";

// Configuraciones y constantes
export {
  CONFIGURACION_ALERTAS,
  AUTO_UPDATE_CONFIG,
  TABS_DISPOSITIVOS,
  ACCIONES_DISPOSITIVO,
  TIPOS_CONEXION,
  ESTADOS_DISPOSITIVO,
  generarDispositivosSimulados,
  COLORES_BATERIA,
  COLORES_SENAL,
  OPCIONES_ORDENAMIENTO,
  MENSAJES,
  REFRESH_CONFIG,
} from "./config";
