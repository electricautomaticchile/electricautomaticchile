import { BaseApiService } from "../utils/baseService";
import { ApiResponse, ISuperusuario, ICrearSuperusuario } from "../types";

export class SuperusuariosService extends BaseApiService {
  async obtenerSuperusuarios(): Promise<ApiResponse<ISuperusuario[]>> {
    return this.makeRequest<ISuperusuario[]>("/superusuarios");
  }

  async crearSuperusuario(datos: ICrearSuperusuario): Promise<
    ApiResponse<{
      data: ISuperusuario;
      credenciales: {
        numeroCliente: string;
        correo: string;
        mensaje: string;
      };
    }>
  > {
    return this.makeRequest("/superusuarios", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  }

  async obtenerEstadisticasSuperusuarios(): Promise<
    ApiResponse<{
      total: number;
      activos: number;
      ultimos: ISuperusuario[];
    }>
  > {
    return this.makeRequest("/superusuarios/estadisticas");
  }
}

// Exportar instancia única del servicio
export const superusuariosService = new SuperusuariosService();
