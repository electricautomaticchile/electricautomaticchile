// Re-exportar desde la nueva estructura modular manteniendo compatibilidad
export {
  RegistroClientes as default,
  RegistroClientes,
} from "./registro-clientes/index";

// Tipos y interfaces para compatibilidad hacia atrás
export type {
  RegistroClientesProps,
  Cliente,
  PlanServicio,
  CotizacionInicial,
  FormularioCliente,
  ValidacionFormulario,
} from "./registro-clientes/index";

// Hook principal para uso externo
export { useRegistroClientes } from "./registro-clientes/index";

// Configuraciones importantes para uso externo
export {
  PLANES_SERVICIO,
  MENSAJES,
  API_ENDPOINTS,
} from "./registro-clientes/index";
