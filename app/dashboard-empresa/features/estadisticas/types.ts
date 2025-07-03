// Interfaces para el componente de estadísticas de consumo
export interface DatoConsumo {
  periodo: string;
  consumo: number;
  costo?: number;
  eficiencia?: number;
}

export interface EstadisticasResumen {
  consumoMensual: number;
  variacionMensual: number;
  consumoAnual: number;
  variacionAnual: number;
  pico: {
    valor: number;
    fecha: string;
    hora: string;
  };
  horarioPico: string;
  eficienciaEnergetica: number;
  costoMensual: number;
  ahorroPotencial: number;
}

export interface EstadisticasConsumoProps {
  reducida?: boolean;
}

// Estados de exportación
export interface EstadoExportacion {
  estado: "idle" | "generando" | "descargando" | "completado" | "error";
  progreso: {
    step: string;
    percentage: number;
    message: string;
  };
  mostrarModal: boolean;
}

// Tipos de exportación
export type TipoExportacion = "mensual" | "diario" | "horario";
export type FormatoExportacion = "excel" | "csv";

// Props para componentes hijos
export interface EstadisticasStatsProps {
  resumen: EstadisticasResumen;
  periodoSeleccionado: string;
  loading?: boolean;
}

export interface EstadisticasChartsProps {
  datos: DatoConsumo[];
  loading?: boolean;
  tipoGrafico?: "linea" | "area" | "barras" | "pie";
}

export interface EstadisticasExportacionProps {
  estadoExportacion: EstadoExportacion;
  onExportar: (
    tipo: TipoExportacion,
    formato?: FormatoExportacion
  ) => Promise<void>;
  onCerrarModal: () => void;
  loading?: boolean;
}

export interface EstadisticasAccionesProps {
  periodoSeleccionado: string;
  onPeriodoChange: (periodo: string) => void;
  onExportar: (
    tipo: TipoExportacion,
    formato?: FormatoExportacion
  ) => Promise<void>;
  estadoExportacion: EstadoExportacion;
  loading?: boolean;
}

export interface EstadisticasReducidoProps {
  datos: DatoConsumo[];
  resumen: EstadisticasResumen;
  loading?: boolean;
}

// Configuración de gráficos
export interface ConfiguracionGrafico {
  tipo: "linea" | "area" | "barras" | "pie";
  color: string;
  gradiente?: string[];
  mostrarTooltip?: boolean;
  mostrarLeyenda?: boolean;
  alturaMinima?: number;
}

// Filtros y configuraciones
export interface FiltrosEstadisticas {
  periodo: string;
  subtipo: TipoExportacion;
  fechaInicio?: string;
  fechaFin?: string;
  incluirCostos?: boolean;
  incluirEficiencia?: boolean;
}

// Configuración de exportación
export interface ConfiguracionExportacion {
  formato: FormatoExportacion;
  filtros: FiltrosEstadisticas;
  titulo: string;
  incluirGraficos?: boolean;
  incluirResumen?: boolean;
  template?: string;
}

// Tipos para datos agregados
export interface DatosAgregados {
  totalConsumo: number;
  promedioConsumo: number;
  picoConsumo: number;
  valleConsumo: number;
  tendencia: "creciente" | "decreciente" | "estable";
  eficienciaPromedio: number;
  costoTotal: number;
}

// Períodos disponibles
export interface PeriodoDisponible {
  value: string;
  label: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

// Tipos para tooltips personalizados
export interface TooltipData {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DatoConsumo;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

// Configuración de colores para gráficos
export interface ColoresGrafico {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  gradient: string[];
}

// Estados de carga específicos
export interface EstadosCarga {
  datos: boolean;
  exportacion: boolean;
  configuracion: boolean;
}

// Tipos para análisis de tendencias
export interface AnalisisTendencia {
  direccion: "up" | "down" | "stable";
  porcentaje: number;
  significancia: "alta" | "media" | "baja";
  proyeccion?: {
    proximoMes: number;
    confianza: number;
  };
}

// Configuración de alertas
export interface AlertasConsumo {
  picoElevado: {
    umbral: number;
    activa: boolean;
  };
  eficienciaBaja: {
    umbral: number;
    activa: boolean;
  };
  costoElevado: {
    umbral: number;
    activa: boolean;
  };
  consumoAnomalo: {
    desviacion: number;
    activa: boolean;
  };
}
