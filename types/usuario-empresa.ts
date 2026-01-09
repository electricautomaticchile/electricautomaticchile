export interface UsuarioEmpresa {
  id: string;
  empresaId: string;
  nombre: string;
  email: string;
  role: RoleEmpresa;
  telefono?: string;
  cargo?: string;
  activo: boolean;
  passwordTemporal: boolean;
  ultimoAcceso?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export type RoleEmpresa = 
  | 'EMPRESA_ADMIN' 
  | 'EMPRESA_OPERADOR' 
  | 'EMPRESA_SOPORTE' 
  | 'EMPRESA_FINANCIERO';

export interface PermisosModulo {
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
  exportar: boolean;
}

export interface PermisosRole {
  clientes: PermisosModulo;
  dispositivos: PermisosModulo;
  alertas: PermisosModulo;
  boletas: PermisosModulo;
  tickets: PermisosModulo;
  reportes: PermisosModulo;
  configuracion: PermisosModulo;
  usuarios: PermisosModulo;
}

export interface LoginEmpresaRequest {
  email: string;
  password: string;
}

export interface LoginEmpresaResponse {
  token: string;
  refreshToken: string;
  user: {
    _id: string;
    nombre: string;
    correo: string;
    role: RoleEmpresa;
    empresaId: string;
    activo: boolean;
    tipoCliente: string;
  };
  permisos: PermisosRole;
}

export interface CrearUsuarioEmpresaRequest {
  nombre: string;
  email: string;
  role: RoleEmpresa;
  telefono?: string;
  cargo?: string;
}

export interface ActualizarUsuarioEmpresaRequest {
  nombre?: string;
  telefono?: string;
  cargo?: string;
  role?: RoleEmpresa;
  activo?: boolean;
}
