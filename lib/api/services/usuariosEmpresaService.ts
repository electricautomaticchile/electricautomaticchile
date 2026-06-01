import { apiClient } from '../client';
import type { 
  UsuarioEmpresa, 
  CrearUsuarioEmpresaRequest, 
  ActualizarUsuarioEmpresaRequest 
} from '@/types/usuario-empresa';

export const usuariosEmpresaService = {
  async obtenerTodos(): Promise<UsuarioEmpresa[]> {
    const response = await apiClient.get('/api/usuarios-empresa');
    return response.data;
  },

  async obtenerPorId(id: string): Promise<UsuarioEmpresa> {
    const response = await apiClient.get(`/api/usuarios-empresa/${id}`);
    return response.data;
  },

  async crear(data: CrearUsuarioEmpresaRequest): Promise<UsuarioEmpresa> {
    const response = await apiClient.post('/api/usuarios-empresa', data);
    return response.data;
  },

  async actualizar(id: string, data: ActualizarUsuarioEmpresaRequest): Promise<UsuarioEmpresa> {
    const response = await apiClient.put(`/api/usuarios-empresa/${id}`, data);
    return response.data;
  },

  async eliminar(id: string): Promise<void> {
    await apiClient.delete(`/api/usuarios-empresa/${id}`);
  },
};
