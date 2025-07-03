// Interfaces para el componente de consumo sectorial
export interface DatoSector {
  nombre: string;
  consumo: number;
  porcentaje: number;
  costo: number;
  tendencia: number;
  color: string;
}

export interface ConsumoSectorialProps {
  reducida?: boolean;
}

export interface EstadoExportacion {
  estado: "idle" | "generando" | "descargando" | "completado" | "error";
  progreso: {
    step: string;
    percentage: number;
    message: string;
  };
  mostrarModal: boolean;
}

export type TipoExportacion = "equipamiento" | "area" | "horario";

export interface ConfiguracionExportacion {
  formato: "excel" | "csv" | "pdf";
  filtros: {
    periodo: string;
    subtipo: TipoExportacion;
  };
  titulo: string;
}

// Interfaces para los datos base de simulación
export interface DatoBase {
  nombre: string;
  base: number;
  variacion: number;
}

// Props para tooltips
export interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}
