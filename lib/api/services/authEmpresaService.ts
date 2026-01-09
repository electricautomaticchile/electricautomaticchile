import { apiClient } from '../client';
import type { LoginEmpresaRequest, LoginEmpresaResponse } from '@/types/usuario-empresa';

export const authEmpresaService = {
  async login(data: LoginEmpresaRequest): Promise<LoginEmpresaResponse> {
    const response = await apiClient.post('/api/auth/login/empresa', data);
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
};
