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

export interface CrearEmpresaResponse {
  success: boolean;
  message?: string;
  data: IEmpresa;
  credenciales: {
    numeroCliente: string;
    correo: string;
    password: string;
    passwordTemporal: boolean;
    mensaje: string;
  };
  error?: string;
  errors?: string[];
}

export interface ResetearPasswordEmpresaResponse {
  success: boolean;
  message?: string;
  data: IEmpresa;
  nuevaPassword: string;
  error?: string;
  errors?: string[];
}
