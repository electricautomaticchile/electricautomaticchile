import { BaseApiService } from "../utils/baseService";
import { ApiResponse, IUsuario } from "../types";

export class UsuariosService extends BaseApiService {
  async obtenerUsuarios(): Promise<ApiResponse<IUsuario[]>> {
    return this.makeRequest<IUsuario[]>("/usuarios");
  }

  async obtenerUsuario(id: string): Promise<ApiResponse<IUsuario>> {
    return this.makeRequest<IUsuario>(`/usuarios/${id}`);
  }

  async crearUsuario(datos: Partial<IUsuario>): Promise<ApiResponse<IUsuario>> {
    return this.makeRequest<IUsuario>("/usuarios", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  }

  async actualizarUsuario(
    id: string,
    datos: Partial<IUsuario>
  ): Promise<ApiResponse<IUsuario>> {
    return this.makeRequest<IUsuario>(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    });
  }

  async eliminarUsuario(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/usuarios/${id}`, {
      method: "DELETE",
    });
  }
}

// Exportar instancia única del servicio
export const usuariosService = new UsuariosService();
