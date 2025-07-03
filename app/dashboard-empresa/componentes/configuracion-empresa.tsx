// Archivo de retrocompatibilidad para el componente Configuración Empresa
// Redirige al nuevo módulo refactorizado

export {
  ConfiguracionEmpresa,
  // Subcomponentes disponibles para uso individual
  ConfiguracionForm,
  ConfiguracionContacto,
  ConfiguracionNotificaciones,
  ConfiguracionEstados,
  // Hooks disponibles
  useConfiguracionEmpresa,
  useEmpresaId,
  useEmpresaIdSimple,
  // Tipos exportados
  type ConfiguracionEmpresaProps,
  type DatosEmpresa,
  type ContactoPrincipal,
  type ConfiguracionNotificaciones as TipoConfiguracionNotificaciones,
} from "./configuracion-empresa/index";

// Exportación por defecto para retrocompatibilidad
export { ConfiguracionEmpresa as default } from "./configuracion-empresa/index";
