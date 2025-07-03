// Exportaciones centralizadas del módulo Configuración Empresa

// Componente principal
export { ConfiguracionEmpresa } from "./ConfiguracionEmpresa";

// Subcomponentes especializados
export {
  ConfiguracionForm,
  ConfiguracionFormReducido,
} from "./ConfiguracionForm";
export {
  ConfiguracionContacto,
  ConfiguracionContactoCompacto,
  ConfiguracionContactoVisualizacion,
} from "./ConfiguracionContacto";
export {
  ConfiguracionNotificaciones,
  ConfiguracionNotificacionesCompacto,
} from "./ConfiguracionNotificaciones";
export {
  ConfiguracionEstados,
  ConfiguracionEstadoCarga,
  ConfiguracionEstadoGuardando,
  ConfiguracionExito,
  ConfiguracionError,
} from "./ConfiguracionEstados";

// Hooks personalizados
export { useConfiguracionEmpresa } from "./hooks/useConfiguracionEmpresa";
export {
  useEmpresaId,
  useEmpresaIdSimple,
  useEmpresaIdValidated,
} from "./hooks/useEmpresaId";

// Tipos e interfaces (sin conflicto de nombres)
export type {
  ConfiguracionEmpresaProps,
  DatosEmpresa,
  ContactoPrincipal,
  EstadosCarga,
  ConfiguracionFormProps,
  ConfiguracionContactoProps,
  ConfiguracionNotificacionesProps,
  ConfiguracionEstadosProps,
  UseConfiguracionEmpresaReturn,
  UseEmpresaIdReturn,
  DatosActualizacionEmpresa,
  EstadoValidacion,
  TabConfiguracion,
} from "./types";

// Alias para el tipo de configuración de notificaciones
export type { ConfiguracionNotificaciones as TipoConfiguracionNotificaciones } from "./types";

// Configuraciones y constantes
export {
  DATOS_EMPRESA_DEFAULT,
  NOTIFICACIONES_DEFAULT,
  ESTADOS_CARGA_DEFAULT,
  VALIDACION_REGLAS,
  CAMPOS_EMPRESA,
  CAMPOS_CONTACTO,
  TABS_CONFIGURACION,
  MENSAJES_SISTEMA,
  REGIONES_CHILE,
  TIPOS_NOTIFICACIONES,
  VALIDADORES,
  FORMATEADORES,
  DEBUG_CONFIG,
} from "./config";

// Re-exportación del componente principal para retrocompatibilidad
export { ConfiguracionEmpresa as default } from "./ConfiguracionEmpresa";
