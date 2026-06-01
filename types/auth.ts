import { ICliente } from "./cliente";
import { IEmpresa } from "./empresa";

export type UserRole = "cliente" | "empresa" | "EMPRESA_ADMIN" | "EMPRESA_OPERADOR" | "EMPRESA_SOPORTE" | "EMPRESA_FINANCIERO";
export type UserType = "cliente" | "empresa" | "usuario_empresa";

export interface AuthUser {
  id: string;
  _id?: string;
  name: string;
  nombre?: string;
  email: string;
  correo?: string;
  numeroCliente?: string;
  telefono?: string;
  role: UserRole;
  type: UserType;
  tipoUsuario?: string;
  isActive: boolean;
  activo?: boolean;
  empresaId?: string;
  lastLogin?: Date;
}

export interface AuthResponse {
  user: AuthUser;
  token?: never;
  refreshToken?: never;
  requiereCambioPassword?: boolean;
}

export interface LoginCredentials {
  numeroCliente: string;
  password: string;
}

export interface RegisterCredentials {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
}

// Union type para representar cualquier usuario del sistema
export type Usuario = ICliente | IEmpresa;
