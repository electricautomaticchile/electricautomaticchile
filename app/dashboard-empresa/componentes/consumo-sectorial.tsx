// Exportar desde el componente refactorizado
export { ConsumoSectorial } from "./consumo-sectorial/ConsumoSectorial";

// También exportar componentes adicionales si es necesario
export { ConsumoSectorialReducido } from "./consumo-sectorial/ConsumoSectorialReducido";
export { useConsumoSectorial } from "./consumo-sectorial/useConsumoSectorial";

// Exportar tipos para compatibilidad
export type {
  ConsumoSectorialProps,
  DatoSector,
} from "./consumo-sectorial/types";
