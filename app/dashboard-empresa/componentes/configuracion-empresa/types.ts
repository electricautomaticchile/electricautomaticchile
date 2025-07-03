// Interfaces para el componente de configuración de empresa

export interface ConfiguracionEmpresaProps {
  className?: string;
}

// Datos de la empresa
export interface DatosEmpresa {
  nombreEmpresa: string;
  razonSocial: string;
  rut: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  contactoPrincipal: ContactoPrincipal;
}

// Contacto principal de la empresa
export interface ContactoPrincipal {
  nombre: string;
  cargo: string;
  telefono: string;
  correo: string;
}

// Configuración de notificaciones
export interface ConfiguracionNotificaciones {
  emailHabilitadas: boolean;
  notificacionesFacturacion: boolean;
  notificacionesConsumo: boolean;
  notificacionesAlertas: boolean;
}

// Estados de carga
export interface EstadosCarga {
  loading: boolean;
  saving: boolean;
  loadingNotificaciones: boolean;
  savingNotificaciones: boolean;
}

// Props para subcomponentes
export interface ConfiguracionFormProps {
  datosEmpresa: DatosEmpresa;
  onDatosChange: (datos: Partial<DatosEmpresa>) => void;
  loading?: boolean;
  saving?: boolean;
}

export interface ConfiguracionContactoProps {
  contactoPrincipal: ContactoPrincipal;
  onContactoChange: (contacto: Partial<ContactoPrincipal>) => void;
  loading?: boolean;
  saving?: boolean;
}

export interface ConfiguracionNotificacionesProps {
  configuracion: ConfiguracionNotificaciones;
  onConfiguracionChange: (config: Partial<ConfiguracionNotificaciones>) => void;
  loading?: boolean;
  saving?: boolean;
  onGuardar: () => Promise<void>;
}

export interface ConfiguracionEstadosProps {
  loading: boolean;
  empresaId?: string;
  error?: string;
  onReintentarLogin: () => void;
}

export interface ConfiguracionAccionesProps {
  saving: boolean;
  onGuardar: () => Promise<void>;
  onRecargar: () => void;
  loading?: boolean;
}

// Hook de configuración
export interface UseConfiguracionEmpresaConfig {
  empresaId?: string;
  autoSave?: boolean;
  validateData?: boolean;
}

export interface UseConfiguracionEmpresaReturn {
  // Estados
  datosEmpresa: DatosEmpresa;
  configuracionNotificaciones: ConfiguracionNotificaciones;
  estados: EstadosCarga;
  empresaId?: string;
  error?: string;

  // Acciones
  actualizarDatos: (datos: Partial<DatosEmpresa>) => void;
  actualizarContacto: (contacto: Partial<ContactoPrincipal>) => void;
  actualizarNotificaciones: (
    config: Partial<ConfiguracionNotificaciones>
  ) => void;
  guardarDatos: () => Promise<void>;
  guardarNotificaciones: () => Promise<void>;
  recargarDatos: () => Promise<void>;

  // Estados derivados
  isLoading: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  isValid: boolean;
}

// Datos para actualizar empresa en API
export interface DatosActualizacionEmpresa {
  nombreEmpresa?: string;
  razonSocial?: string;
  rut?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  region?: string;
  contactoPrincipal?: ContactoPrincipal;
  configuraciones?: {
    notificaciones: boolean;
    tema: "claro" | "oscuro";
    maxUsuarios: number;
  };
}

// Respuesta de la API
export interface RespuestaEmpresa {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

// Configuración de validación
export interface ReglasValidacion {
  nombreEmpresa: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  rut: {
    required: boolean;
    pattern: RegExp;
  };
  correo: {
    required: boolean;
    pattern: RegExp;
  };
  telefono: {
    required: boolean;
    pattern: RegExp;
  };
}

// Datos por defecto
export interface DatosDefecto {
  empresa: DatosEmpresa;
  notificaciones: ConfiguracionNotificaciones;
  estados: EstadosCarga;
}

// Configuración de tabs
export interface TabConfiguracion {
  value: string;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
  enabled: boolean;
}

// Hook useEmpresaId
export interface UseEmpresaIdReturn {
  empresaId?: string;
  loading: boolean;
  error?: string;
  userData?: any;
  tokenData?: any;
}

// Fuente de autenticación
export type FuenteAuth = "localStorage" | "token" | "context" | "none";

export interface DatosAutenticacion {
  empresaId?: string;
  fuente: FuenteAuth;
  userData?: any;
  tokenData?: any;
  valid: boolean;
}

// Eventos del sistema
export interface EventoConfiguracion {
  tipo: "carga" | "guardado" | "error" | "validacion";
  timestamp: Date;
  datos: any;
  usuario?: string;
  accion?: string;
}

// Configuración de formularios
export interface ConfigFormulario {
  autoSave: boolean;
  validateOnChange: boolean;
  saveDelay: number;
  showUnsavedWarning: boolean;
}

// Estado de validación de campos
export interface EstadoValidacion {
  field: string;
  isValid: boolean;
  error?: string;
  warning?: string;
}

// Configuración de empresa extendida
export interface ConfiguracionEmpresaExtendida {
  basica: DatosEmpresa;
  notificaciones: ConfiguracionNotificaciones;
  preferencias: {
    tema: "claro" | "oscuro";
    idioma: "es" | "en";
    timezone: string;
  };
  seguridad: {
    autenticacion2FA: boolean;
    sesionTimeout: number;
    passwordPolicy: any;
  };
}

// Historial de cambios
export interface HistorialCambio {
  campo: string;
  valorAnterior: any;
  valorNuevo: any;
  timestamp: Date;
  usuario: string;
}

// Configuración de backup
export interface ConfiguracionBackup {
  habilitado: boolean;
  frecuencia: "diaria" | "semanal" | "mensual";
  retencion: number;
  ubicacion: string;
}

// Tipos de notificación
export type TipoNotificacion = "email" | "sms" | "push" | "webhook";

// Configuración avanzada de notificaciones
export interface ConfiguracionNotificacionesAvanzada {
  tipos: Record<TipoNotificacion, boolean>;
  horarios: {
    inicio: string;
    fin: string;
    zonaHoraria: string;
  };
  frecuencia: {
    inmediata: boolean;
    resumen: "diario" | "semanal" | "mensual";
  };
  filtros: {
    nivel: "todas" | "importantes" | "criticas";
    categorias: string[];
  };
}
