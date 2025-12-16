// Exportar todos los servicios
export { authService } from "./authService";
export { cotizacionesService } from "./cotizacionesService";
export { clientesService } from "./clientesService";
export { dispositivosService } from "./dispositivosService";
export { estadisticasService } from "./estadisticasService";
export { leadMagnetService } from "./leadMagnetService";
export { empresasService } from "./empresasService";
export { default as ImagenPerfilService } from "./imagenPerfilService";
export { alertasService } from "./alertasService";

// Re-exportar todos los tipos
export * from "../types";

// Re-exportar las utilidades si es necesario
export { TokenManager } from "../utils/tokenManager";
export { API_URL, API_BASE_URL, API_VERSION } from "../utils/config";
