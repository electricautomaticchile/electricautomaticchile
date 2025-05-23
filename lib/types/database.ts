/**
 * Tipos TypeScript estrictos para entidades de base de datos
 */

import { Document, Types } from 'mongoose';

// ==================== TIPOS BASE ====================

export interface BaseDocument {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimestampFields {
  createdAt: Date;
  updatedAt: Date;
}

// ==================== USUARIO/CLIENTE ====================

export type UserRole = 'admin' | 'superadmin' | 'empresa' | 'cliente';

export interface IUser extends BaseDocument {
  numeroCliente: string;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  rut?: string;
  direccion?: string;
  password?: string;
  passwordTemporal?: string;
  role: UserRole;
  esActivo: boolean;
  fechaRegistro: Date;
  fechaActivacion?: Date;
  ultimoAcceso?: Date;
  planSeleccionado?: string;
  montoMensual?: number;
  notas?: string;
  imagen?: string;
}

export type UserDocument = IUser & Document;

// ==================== FORMULARIO DE CONTACTO ====================

export type TipoServicio = 'instalacion' | 'mantenimiento' | 'consulta' | 'otro';
export type EstadoFormulario = 'pendiente' | 'revisado' | 'cotizado' | 'aprobado' | 'rechazado';

export interface IContactForm extends BaseDocument {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  mensaje: string;
  tipoServicio: TipoServicio;
  terminosAceptados: boolean;
  estado: EstadoFormulario;
  fecha: Date;
  monto?: number;
  comentarios?: string;
  metadatos?: {
    ip?: string;
    userAgent?: string;
    origin?: string;
    timestamp?: Date;
  };
}

export type ContactFormDocument = IContactForm & Document;

// ==================== DISPOSITIVOS ====================

export type EstadoDispositivo = 'activo' | 'inactivo' | 'mantenimiento' | 'error';
export type TipoDispositivo = 'sensor' | 'actuador' | 'controlador' | 'monitor';

export interface IDevice extends BaseDocument {
  name: string;
  type: TipoDispositivo;
  location: string;
  status: EstadoDispositivo;
  lastUpdate: Date;
  configuration: Record<string, any>;
  metadata?: Record<string, any>;
  owner?: Types.ObjectId;
}

export type DeviceDocument = IDevice & Document;

// ==================== MENSAJES ====================

export interface IMensaje extends BaseDocument {
  emisor: Types.ObjectId;
  receptor: Types.ObjectId;
  asunto: string;
  contenido: string;
  leido: boolean;
  fechaEnvio: Date;
  fechaLectura?: Date;
  conversacionId?: Types.ObjectId;
  esRespuesta: boolean;
  mensajeOriginal?: Types.ObjectId;
  adjuntos: string[];
}

export type MensajeDocument = IMensaje & Document;

// ==================== NOTIFICACIONES ====================

export type TipoNotificacion = 'info' | 'exito' | 'alerta' | 'error';
export type PrioridadNotificacion = 'baja' | 'media' | 'alta' | 'critica';

export interface INotificacion extends BaseDocument {
  tipo: TipoNotificacion;
  titulo: string;
  descripcion: string;
  destinatario: Types.ObjectId;
  creador: Types.ObjectId;
  prioridad: PrioridadNotificacion;
  fecha: Date;
  leida: boolean;
  fechaLectura?: Date;
  enlace?: string;
  accion?: string;
}

export type NotificacionDocument = INotificacion & Document;

// ==================== DOCUMENTOS ====================

export type TipoDocumento = 'contrato' | 'factura' | 'certificado' | 'manual' | 'reporte' | 'imagen' | 'otro';
export type EntidadRelacionada = 'usuario' | 'proyecto' | 'dispositivo' | 'cotizacion' | 'orden';

export interface IDocumento extends BaseDocument {
  nombre: string;
  descripcion?: string;
  tipoDocumento: TipoDocumento;
  tipoArchivo: string;
  tamaño: number;
  url: string;
  s3Key: string;
  entidadRelacionada: EntidadRelacionada;
  referenciaId: string;
  entidadModelo: string;
  esPublico: boolean;
  fechaSubida: Date;
  fechaExpiracion?: Date;
  usuario: string;
  etiquetas: string[];
  metadatos?: Record<string, any>;
}

export type DocumentoDocument = IDocumento & Document;

// ==================== ACTIVIDAD/LOGS ====================

export type SeveridadActividad = 'baja' | 'media' | 'alta' | 'critica';
export type ResultadoActividad = 'exitoso' | 'fallido' | 'pendiente';

export interface IRegistroActividad extends BaseDocument {
  usuario: string;
  empresa?: string;
  accion: string;
  modulo: string;
  descripcion: string;
  timestamp: Date;
  severidad: SeveridadActividad;
  resultado: ResultadoActividad;
  metadatos?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

export type RegistroActividadDocument = IRegistroActividad & Document;

// ==================== TIPOS DE REQUEST/RESPONSE ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    pagination?: PaginationInfo;
    timestamp: string;
    version: string;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchFilters {
  query?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: string;
  type?: string;
  [key: string]: any;
}

// ==================== TIPOS DE CONFIGURACIÓN ====================

export interface DatabaseConfig {
  maxPoolSize: number;
  minPoolSize: number;
  maxIdleTimeMS: number;
  serverSelectionTimeoutMS: number;
  socketTimeoutMS: number;
}

export interface SecurityConfig {
  rateLimiting: {
    windowMs: number;
    maxRequests: number;
  };
  cors: {
    origins: string[];
    credentials: boolean;
  };
  headers: Record<string, string>;
}

// ==================== UTILIDADES DE TIPOS ====================

export type CreateInput<T extends BaseDocument> = Omit<T, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateInput<T extends BaseDocument> = Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>>;

export type PopulatedDocument<T extends Document, P extends keyof T> = Omit<T, P> & {
  [K in P]: T[K] extends Types.ObjectId ? UserDocument : T[K];
};

export interface PopulateOptions {
  path: string;
  select?: string;
  model?: string;
  match?: any;
} 