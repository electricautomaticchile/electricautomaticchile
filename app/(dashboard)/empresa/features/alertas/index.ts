// Componente principal
export { AlertasSistema } from './AlertasSistema';

// Subcomponentes
export { AlertasSistemaStats } from './AlertasSistemaStats';
export { AlertasSistemaAcciones } from './AlertasSistemaAcciones';
export { AlertasSistemaLista } from './AlertasSistemaLista';
export { AlertasSistemaReducido } from './AlertasSistemaReducido';

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

// Tipos
export type {
  AlertasSistemaProps,
  TipoAlerta,
  EstadoFiltro,
  AlertaSistema,
  AlertasSistemaStatsProps,
  AlertasSistemaAccionesProps,
  AlertasSistemaListaProps,
  AlertasSistemaReducidoProps,
  ResumenAlertas,
  ColoresAlerta,
  EstadosCarga,
  MensajesAlerta,
  ConfiguracionSimulacion,
  AccionesAlertaProps,
} from './types';

// Configuraciones
export {
  COLORES_ALERTA,
  MENSAJES_ALERTA,
  CONFIGURACION_SIMULACION,
  RESUMEN_ALERTAS_DEFAULT,
  DESCRIPCIONES_TIPO,
  ETIQUETAS_TIPO,
  generarIdDispositivo,
  generarAlertaAleatoria,
} from './config';
