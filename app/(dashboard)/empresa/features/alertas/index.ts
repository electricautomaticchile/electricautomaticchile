// Componente principal
export { AlertasSistema } from './AlertasSistema';

// Subcomponentes especializados
export { AlertasSistemaStats } from './AlertasSistemaStats';
export { AlertasSistemaAcciones } from './AlertasSistemaAcciones';
export { AlertasSistemaFiltros, FiltrosMovil, FiltrosActivos } from './AlertasSistemaFiltros';
export { AlertasSistemaLista } from './AlertasSistemaLista';
export { AlertasSistemaReducido, AlertasSistemaMiniatura } from './AlertasSistemaReducido';

// Componentes UI especializados
export { 
  IconoAlerta, 
  BadgeTipo, 
  IconoAlertaReducido,
  IndicadorEstado,
  BadgeImportante,
  BadgeTiempoReal
} from './AlertasSistemaIconos';

// Hook personalizado
export { useAlertasSistema } from './useAlertasSistema';

// Tipos e interfaces principales
export type {
  AlertasSistemaProps,
  TipoAlerta,
  EstadoFiltro,
  AlertaSistema,
  AlertasSistemaStatsProps,
  AlertasSistemaAccionesProps,
  AlertasSistemaFiltrosProps,
  AlertasSistemaListaProps,
  AlertasSistemaReducidoProps,
  AlertasSistemaIconosProps,
  ResumenAlertas,
  ColoresAlerta,
  EstadosCarga,
  ConfiguracionFiltros,
  MensajesAlerta,
  ConfiguracionSimulacion,
  AccionesAlertaProps,
  EstadisticasAgregadas
} from './types';

// Configuraciones y constantes
export {
  COLORES_ALERTA,
  CONFIGURACION_FILTROS,
  MENSAJES_ALERTA,
  CONFIGURACION_SIMULACION,
  RESUMEN_ALERTAS_DEFAULT,
  CONFIG_ACTUALIZACION,
  CONFIG_NOTIFICACIONES,
  DESCRIPCIONES_TIPO,
  ETIQUETAS_TIPO,
  generarIdDispositivo,
  generarAlertaAleatoria,
  LAYOUTS,
  ANIMACIONES,
  UMBRALES_CRITICOS,
  CONFIG_ACCESIBILIDAD
} from './config';
