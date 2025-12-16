import { ICliente } from "./cliente";
import { IEmpresa } from "./empresa";

export type UserRole = "cliente" | "empresa";
export type UserType = "cliente" | "empresa";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  type: UserType;
  isActive: boolean;
  lastLogin?: Date;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  requiereCambioPassword?: boolean;
}

export interface LoginCredentials {
  email: string;
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
