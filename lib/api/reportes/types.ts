// Interfaces principales para el sistema de reportes

export interface IFiltrosReporte {
  // Filtros generales
  formato?: "excel" | "csv";
  fechaDesde?: string;
  fechaHasta?: string;

  // Filtros específicos para clientes
  empresaId?: string;
  activo?: boolean;
  tipoCliente?: string;
  ciudad?: string;

  // Filtros específicos para empresas
  estado?: string;
  region?: string;

  // Filtros específicos para cotizaciones
  servicio?: string;

  // Filtros específicos para estadísticas y consumo
  subtipo?: "mensual" | "diario" | "horario" | "equipamiento" | "area";
  periodo?: string;

  // Filtros técnicos para vista previa y límites
  limit?: number;
  preview?: boolean;
}

export interface IConfigReporte {
  titulo: string;
  tipo:
    | "clientes"
    | "empresas"
    | "cotizaciones"
    | "dispositivos"
    | "estadisticas"
    | "consumo-sectorial";
  formato: "excel" | "csv";
  filtros?: IFiltrosReporte;
  empresaId?: string;
}

export interface IProgressCallback {
  (progress: { step: string; percentage: number; message: string }): void;
}

export interface IProgressState {
  step:
    | "init"
    | "request"
    | "connecting"
    | "processing"
    | "download"
    | "complete"
    | "error";
  percentage: number;
  message: string;
  startTime?: Date;
  estimatedTime?: number;
  currentOperation?: string;
}

export interface ICSVColumn {
  key: string;
  header?: string;
  type?: "string" | "number" | "date" | "currency" | "boolean";
  formatter?: (value: any) => string;
}

export interface IReporteResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    nombreArchivo: string;
    tamaño: number;
    tiempoGeneracion: number;
    registros: number;
  };
}
