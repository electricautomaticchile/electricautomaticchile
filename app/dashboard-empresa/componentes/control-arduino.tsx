// Archivo de retrocompatibilidad para el componente Control Arduino
// Redirige al nuevo módulo refactorizado

export { 
  ControlArduino,
  // Subcomponentes disponibles para uso individual
  ControlArduinoEstado,
  ControlArduinoAcciones,
  ControlArduinoStats,
  ControlArduinoReducido,
  // Hooks disponibles
  useControlArduino,
  useControlArduinoSimple,
  useArduinoStatus,
  // Tipos exportados
  type ControlArduinoProps,
  type ArduinoStatus,
  type StatsData
} from './control-arduino/index';

// Exportación por defecto para retrocompatibilidad
export { ControlArduino as default } from './control-arduino/index';
