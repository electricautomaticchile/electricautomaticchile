// Interfaces para el componente de alertas del sistema

export interface AlertasSistemaProps {
  reducida?: boolean;
}

// Tipos de alerta del sistema
export type TipoAlerta = "error" | "advertencia" | "informacion" | "exito";
export type EstadoFiltro = "todos" | "no_leidas" | "leidas";

// Interface para alertas (extendiendo la del hook useNotifications)
export interface AlertaSistema {
  id: string;
  tipo: TipoAlerta;
  mensaje: string;
  fecha: string;
  hora: string;
  dispositivo?: string;
  ubicacion?: string;
  importante: boolean;
  leida: boolean;
}

// Props para subcomponentes
export interface AlertasSistemaStatsProps {
  resumen: ResumenAlertas;
  loading?: boolean;
}

export interface AlertasSistemaAccionesProps {
  isConnected: boolean;
  busqueda: string;
  onBusquedaChange: (busqueda: string) => void;
  onSimularAlerta: () => void;
  onMarcarTodasLeidas: () => void;
  resumenAlertas: ResumenAlertas;
  loading?: boolean;
}

export interface AlertasSistemaFiltrosProps {
  filtroTipo: string;
  filtroEstado: string;
  onFiltroTipoChange: (tipo: string) => void;
  onFiltroEstadoChange: (estado: string) => void;
  resumenAlertas: ResumenAlertas;
}

export interface AlertasSistemaListaProps {
  alertas: AlertaSistema[];
  alertaExpandida: string | null;
  loading?: boolean;
  onToggleAlerta: (id: string) => void;
  onAsignarAlerta: (id: string) => void;
  onResolverAlerta: (id: string) => void;
  onMarcarComoVista: (id: string) => void;
  onEliminarAlerta: (id: string) => void;
  busqueda: string;
}

export interface AlertasSistemaReducidoProps {
  alertas: AlertaSistema[];
  resumen: ResumenAlertas;
  loading?: boolean;
}

export interface AlertasSistemaIconosProps {
  IconoAlerta: React.ComponentType<{ tipo: string }>;
  BadgeTipo: React.ComponentType<{ tipo: string }>;
}

// Interface para el resumen de alertas
export interface ResumenAlertas {
  total: number;
  errorCritico: number;
  advertencia: number;
  informacion: number;
  exito: number;
  noLeidas: number;
  importantes: number;
  resueltas: number;
}

// Configuración de colores para tipos de alerta
export interface ColoresAlerta {
  error: {
    icon: string;
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
  advertencia: {
    icon: string;
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
  informacion: {
    icon: string;
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
  exito: {
    icon: string;
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
}

// Estados de carga para diferentes secciones
export interface EstadosCarga {
  alertas: boolean;
  accion: boolean;
  simulacion: boolean;
}

// Configuración de filtros
export interface ConfiguracionFiltros {
  tipos: Array<{
    value: string;
    label: string;
    variant: string;
    className?: string;
  }>;
  estados: Array<{
    value: string;
    label: string;
    showCount?: boolean;
  }>;
}

// Mensajes del sistema
export interface MensajesAlerta {
  simulacionExitosa: string;
  asignacionExitosa: string;
  resolucionExitosa: string;
  eliminacionExitosa: string;
  errorGeneral: string;
  sinAlertas: string;
  sinResultados: string;
}

// Configuración de simulación de alertas
export interface ConfiguracionSimulacion {
  tipos: TipoAlerta[];
  mensajes: string[];
  ubicaciones: string[];
  dispositivos: {
    prefijo: string;
    rangoNumerico: [number, number];
  };
}

// Props para acciones de alerta individual
export interface AccionesAlertaProps {
  alerta: AlertaSistema;
  onAsignar: (id: string) => void;
  onResolver: (id: string) => void;
  onMarcarVista: (id: string) => void;
  onEliminar: (id: string) => void;
}

// Estadísticas agregadas
export interface EstadisticasAgregadas {
  alertasPorDia: number;
  promedioResolucion: number; // en horas
  tiempoRespuesta: number; // en minutos
  dispositivosAfectados: number;
}
