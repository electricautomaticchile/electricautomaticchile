// Exportaciones centralizadas del módulo Control Arduino

// Componente principal
export { ControlArduino } from "./ControlArduino";

// Subcomponentes especializados
export {
  ControlArduinoEstado,
  ControlArduinoEstadoCompacto,
} from "./ControlArduinoEstado";
export {
  ControlArduinoAcciones,
  ControlArduinoAccionesReducido,
  ControlArduinoHeader,
} from "./ControlArduinoAcciones";
export {
  ControlArduinoStats,
  ControlArduinoStatsReducido,
  ControlArduinoMetricasRapidas,
} from "./ControlArduinoStats";
export {
  ControlArduinoReducido,
  ControlArduinoMini,
  ControlArduinoInline,
  ControlArduinoEsencial,
  ControlArduinoEstadoSolo,
} from "./ControlArduinoReducido";

// Componentes UI especializados
export {
  StatusIcon,
  LedIcon,
  ActionIcon,
  StatsIcon,
  LedStatusBadge,
  ConnectionStatusBadge,
  PhysicalButtonBadge,
  LedVisualIndicator,
  SystemStatusIcon,
  ActivityIndicator,
  ToggleIcon,
  ComprehensiveStatusIndicator,
  ExportIcon,
} from "./ControlArduinoIconos";

// Hooks personalizados
export {
  useControlArduino,
  useControlArduinoSimple,
  useArduinoStatus,
} from "./useControlArduino";

// Tipos e interfaces
export type {
  ControlArduinoProps,
  ArduinoStatus,
  StatsData,
  ControlArduinoEstadoProps,
  ControlArduinoAccionesProps,
  ControlArduinoStatsProps,
  ControlArduinoReducidoProps,
  ControlArduinoIconosProps,
  FlaskResponse,
  ConnectionConfig,
  LoadingStates,
  AutoRefreshConfig,
  LedCommand,
  LedStatus,
  ExportFormat,
  HistoryData,
  PerformanceMetrics,
  NotificationConfig,
  SystemState,
  UseControlArduinoConfig,
  ArduinoEvent,
} from "./types";

// Configuraciones y constantes
export {
  FLASK_CONFIG,
  FLASK_ENDPOINTS,
  DEFAULT_AUTO_REFRESH,
  DEFAULT_ARDUINO_STATUS,
  DEFAULT_STATS_DATA,
  DEFAULT_PERFORMANCE_METRICS,
  DEFAULT_LOADING_STATES,
  SYSTEM_MESSAGES,
  STATUS_COLORS,
  BADGE_CONFIG,
  CONTROL_BUTTONS,
  STATS_CONFIG,
  EXPORT_OPTIONS,
  LAYOUTS,
  TIMEOUTS,
  ANIMATIONS,
  VALIDATORS,
  FORMATTERS,
  DEBUG_CONFIG,
} from "./config";

// Re-exportación del componente principal para retrocompatibilidad
export { ControlArduino as default } from "./ControlArduino";
