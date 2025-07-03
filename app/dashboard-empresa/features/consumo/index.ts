// Exportar el componente principal
export { ConsumoSectorial } from "./ConsumoSectorial";

// Exportar subcomponentes
export { ConsumoSectorialAcciones } from "./ConsumoSectorialAcciones";
export { ConsumoSectorialTabs } from "./ConsumoSectorialTabs";
export { ConsumoSectorialEstadisticas } from "./ConsumoSectorialEstadisticas";
export { ConsumoSectorialReducido } from "./ConsumoSectorialReducido";

// Exportar componentes de gráficos
export {
  PieChartPrincipal,
  PieChartReducido,
  BarChartConsumo,
  RadialChartConsumo,
  HorizontalBarChart,
} from "./ConsumoSectorialCharts";

// Exportar tooltips
export {
  CustomPieTooltip,
  CustomBarTooltip,
  CustomRadialTooltip,
} from "./ConsumoSectorialTooltips";

// Exportar hooks
export { useConsumoSectorial } from "./useConsumoSectorial";

// Exportar tipos y configuraciones
export type {
  DatoSector,
  ConsumoSectorialProps,
  EstadoExportacion,
  TipoExportacion,
  ConfiguracionExportacion,
  DatoBase,
  TooltipProps,
} from "./types";

export {
  SECTOR_COLORS,
  AREA_COLORS,
  HORARIO_COLORS,
  SECTORES_BASE,
  AREAS_BASE,
  FRANJAS_BASE,
  PERIODOS_DISPONIBLES,
  CHART_CONFIG,
} from "./config";
