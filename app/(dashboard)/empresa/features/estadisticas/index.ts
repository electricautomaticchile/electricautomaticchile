// Componente principal
export { EstadisticasConsumo } from './EstadisticasConsumo';

// Subcomponentes
export { EstadisticasConsumoStats } from './EstadisticasConsumoStats';
export { EstadisticasConsumoAcciones } from './EstadisticasConsumoAcciones';
export { EstadisticasConsumoCharts } from './EstadisticasConsumoCharts';
export { EstadisticasConsumoReducido } from './EstadisticasConsumoReducido';

// Hook personalizado
export { useEstadisticasConsumo } from './useEstadisticasConsumo';

// Tipos e interfaces principales
export type {
  DatoConsumo,
  EstadisticasResumen,
  EstadisticasConsumoProps,
  EstadoExportacion,
  TipoExportacion,
  FormatoExportacion,
  EstadisticasStatsProps,
  EstadisticasChartsProps,
  EstadisticasAccionesProps,
  EstadisticasReducidoProps,
  TooltipData
} from './types';

// Configuraciones
export {
  COLORES,
  PERIODOS_DISPONIBLES,
  ESTADISTICAS_RESUMEN_DEFAULT,
  generarDatosConsumo,
  MENSAJES,
  CONFIG_ACTUALIZACION,
  UNIDADES
} from './config';
