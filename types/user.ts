export type UserRole =
  | "admin"
  | "user"
  | "client"
  | "superadmin"
  | "cliente"
  | "empresa";
export type UserType =
  | "admin"
  | "client"
  | "company"
  | "superadmin"
  | "cliente"
  | "empresa";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  type: UserType;
  isActive: boolean;
  lastLogin?: Date;
}

// Para mantener compatibilidad con el backend
export interface IUsuario extends UserProfile {
  _id?: string; // Campo legacy
  nombre?: string; // Campo legacy
  numeroCliente?: string; // Campo legacy
  tipoUsuario?: string; // Campo legacy
  activo?: boolean; // Campo legacy
  fechaCreacion?: string; // Campo legacy
  ultimoAcceso?: string; // Campo legacy
}

export type AuthResponse = {
  user: UserProfile;
  token: string;
  refreshToken: string;
};
