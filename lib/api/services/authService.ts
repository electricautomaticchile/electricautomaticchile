import { apiClient } from '../client';

export interface LoginClienteRequest {
  numeroCliente: string;
  password: string;
}

export interface LoginClienteResponse {
  token: string;
  refreshToken: string;
  user: {
    _id: string;
    nombre: string;
    correo: string;
    numeroCliente: string;
    telefono?: string;
    role: string;
    tipoUsuario: string;
    activo: boolean;
    empresaId?: string;
  };
  requiereCambioPassword?: boolean;
}

export const authService = {
  async login(data: LoginClienteRequest): Promise<LoginClienteResponse> {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },

  async cambiarPassword(passwordActual: string, passwordNuevo: string): Promise<void> {
    await apiClient.post('/api/auth/cambiar-password', {
      passwordActual,
      passwordNuevo,
    });
  },

  async solicitarRecuperacion(email: string): Promise<void> {
    await apiClient.post('/api/auth/solicitar-recuperacion', { email });
  },

  async restablecerPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/api/auth/restablecer-password', { token, password });
  },
};
