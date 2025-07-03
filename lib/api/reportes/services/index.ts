// Servicios especializados de reportes - Orden corregido para evitar problemas de importación

// 1. Exportar clase base
export { BaseReportService } from "./baseReportService";

// 2. Exportar clases de servicios
export { ClientesReportService } from "./clientesReportService";
export { EmpresasReportService } from "./empresasReportService";
export { CotizacionesReportService } from "./cotizacionesReportService";

// 3. Importar instancias después de las clases
import { clientesReportService } from "./clientesReportService";
import { empresasReportService } from "./empresasReportService";
import { cotizacionesReportService } from "./cotizacionesReportService";

// 4. Re-exportar instancias
export {
  clientesReportService,
  empresasReportService,
  cotizacionesReportService,
};

// 5. Objeto con todas las instancias
export const reportServices = {
  clientes: clientesReportService,
  empresas: empresasReportService,
  cotizaciones: cotizacionesReportService,
};

// 6. Exportar tipos y utilidades
export * from "../types";
export * from "../config";
export * from "../utils/downloadUtils";
export * from "../utils/csvUtils";
