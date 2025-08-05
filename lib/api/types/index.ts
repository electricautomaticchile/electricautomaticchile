// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Tipos para Cotizaciones
export interface ICotizacion {
  _id: string;
  numero?: string;
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  servicio:
    | "cotizacion_reposicion"
    | "cotizacion_monitoreo"
    | "cotizacion_mantenimiento"
    | "cotizacion_completa";
  plazo?: "urgente" | "pronto" | "normal" | "planificacion";
  mensaje: string;
  archivoUrl?: string;
  archivo?: string;
  archivoTipo?: string;
  estado:
    | "pendiente"
    | "en_revision"
    | "cotizando"
    | "cotizada"
    | "aprobada"
    | "rechazada"
    | "convertida_cliente";
  prioridad: "baja" | "media" | "alta" | "critica";
  titulo?: string;
  descripcion?: string;
  items?: Array<{
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
  subtotal?: number;
  iva?: number;
  total?: number;
  validezDias?: number;
  condicionesPago?: string;
  clienteId?: string;
  asignadoA?: string;
  fechaCreacion: string;
  fechaActualizacion?: string;
  fechaCotizacion?: string;
  fechaAprobacion?: string;
  fechaConversion?: string;
  notas?: string;
}

// Tipos para Clientes
export interface ICliente {
  _id: string;
  nombre: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  rut?: string;
  tipoCliente?: "particular" | "empresa";
  empresa?: string;
  numeroCliente?: string;
  role?: string;
  esActivo?: boolean;
  activo?: boolean;
  passwordTemporal?: string;
  planSeleccionado?: string;
  montoMensual?: number;
  fechaRegistro?: string;
  fechaActivacion?: string;
  ultimoAcceso?: string;
  notas?: string;
}

import { UserRole, UserType } from "@/types/user";

// Tipos para Usuarios
export interface IUsuario {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  type: UserType;
  isActive: boolean;
  lastLogin?: Date;
}

// Tipos para Superusuarios
export interface ISuperusuario {
  _id: string;
  nombre: string;
  correo: string;
  telefono?: string;
  numeroCliente: string;
  role: "superadmin";
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion?: string;
  ultimoAcceso?: string;
  configuraciones?: {
    notificaciones: boolean;
    tema: "claro" | "oscuro";
  };
}

export interface ICrearSuperusuario {
  nombre: string;
  correo: string;
  password: string;
  telefono?: string;
  configuraciones?: {
    notificaciones?: boolean;
    tema?: "claro" | "oscuro";
  };
}

// Tipos para Empresas
export interface IEmpresa {
  _id: string;
  nombreEmpresa: string;
  razonSocial: string;
  rut: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  contactoPrincipal: {
    nombre: string;
    cargo: string;
    telefono: string;
    correo: string;
  };
  numeroCliente: string;
  passwordTemporal: boolean;
  estado: "activo" | "suspendido" | "inactivo";
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  ultimoAcceso?: Date;
  fechaActivacion?: Date;
  fechaSuspension?: Date;
  motivoSuspension?: string;
  configuraciones?: {
    notificaciones: boolean;
    tema: "claro" | "oscuro";
    maxUsuarios: number;
  };
}

export interface ICrearEmpresa {
  nombreEmpresa: string;
  razonSocial: string;
  rut: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  contactoPrincipal: {
    nombre: string;
    cargo: string;
    telefono: string;
    correo: string;
  };
  configuraciones?: {
    notificaciones?: boolean;
    tema?: "claro" | "oscuro";
    maxUsuarios?: number;
  };
}

export interface IActualizarEmpresa {
  nombreEmpresa?: string;
  razonSocial?: string;
  rut?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  region?: string;
  contactoPrincipal?: {
    nombre?: string;
    cargo?: string;
    telefono?: string;
    correo?: string;
  };
  estado?: "activo" | "suspendido" | "inactivo";
  motivoSuspension?: string;
  passwordTemporal?: boolean;
  configuraciones?: {
    notificaciones?: boolean;
    tema?: "claro" | "oscuro";
    maxUsuarios?: number;
  };
}

// Interfaz especializada para la respuesta de crear empresa
export interface CrearEmpresaResponse {
  success: boolean;
  message?: string;
  data: IEmpresa;
  credenciales: Credenciales;
  error?: string;
  errors?: string[];
}

interface Credenciales {
  numeroCliente: string;
  correo: string;
  password: string;
  passwordTemporal: boolean;
  mensaje: string;
}

// Interfaz especializada para resetear password de empresa
export interface ResetearPasswordEmpresaResponse {
  success: boolean;
  message?: string;
  data: IEmpresa;
  nuevaPassword: string;
  error?: string;
  errors?: string[];
}

// Tipos para Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: IUsuario;
  token: string;
  refreshToken: string;
  requiereCambioPassword?: boolean;
}
