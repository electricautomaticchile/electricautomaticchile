// Componentes de Layout
export { EncabezadoEmpresa as Header } from "./layout/header";
export { EncabezadoEmpresa } from "./layout/header";
export { BarraNavegacionLateral as Navigation } from "./layout/navigation";
export { BarraNavegacionLateral } from "./layout/navigation";

// Re-exportar features para mantener compatibilidad
export { AlertasSistema } from "../features/alertas";
export { DispositivosActivos } from "../features/dispositivos";
export { EstadisticasConsumo } from "../features/estadisticas";
export { ConfiguracionEmpresa } from "../features/configuracion";
export { ControlArduino } from "../features/control";

// Exportar componentes de clientes
export * from "../features/clientes";
