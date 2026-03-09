import { BaseApiService } from "../utils/baseService";
import { ApiResponse } from "../types";

export interface ResumenCliente {
  cliente: {
    nombre: string;
    numeroCliente: string;
    correo: string;
    telefono?: string;
    direccion?: string;
    imagenPerfil?: string;
    passwordTemporal: boolean;
  };
  estadisticas: {
    dispositivosActivos: number;
    dispositivosTotal: number;
    consumoMensual: number;
    costoMensual: number;
    boletasPendientes: number;
    ultimaLectura?: any;
  };
}

export interface DispositivoCliente {
  _id: string;
  numeroDispositivo: string;
  tipo: string;
  estado: string;
  ubicacion?: string;
  ultimaLectura?: {
    valor: number;
    fecha: string;
  };
}

export interface ConsumoCliente {
  consumoTotal: number;
  costoTotal: number;
  historial: Array<{
    fecha: string;
    consumo: number;
    costo: number;
  }>;
}

export interface BoletaCliente {
  _id: string;
  id?: string;
  numeroFactura: string;
  periodo: string;
  fechaEmision: string;
  fechaVencimiento: string;
  fechaPago?: string;
  monto: number;
  estado: string;
  consumo: number;
}

export interface DashboardClienteTodo {
  resumen: ResumenCliente;
  dispositivos: DispositivoCliente[];
  consumo: ConsumoCliente;
  boletas: BoletaCliente[];
}

export class DashboardClienteService extends BaseApiService {
  async obtenerTodo(): Promise<ApiResponse<DashboardClienteTodo>> {
    return this.makeRequest<DashboardClienteTodo>("/dashboard/cliente");
  }

  async obtenerResumen(): Promise<ApiResponse<ResumenCliente>> {
    return this.makeRequest<ResumenCliente>("/dashboard/cliente/resumen");
  }

  async obtenerDispositivos(): Promise<ApiResponse<DispositivoCliente[]>> {
    return this.makeRequest<DispositivoCliente[]>("/dashboard/cliente/dispositivos");
  }

  async obtenerConsumo(): Promise<ApiResponse<ConsumoCliente>> {
    return this.makeRequest<ConsumoCliente>("/dashboard/cliente/consumo");
  }

  async obtenerPerfil(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>("/dashboard/cliente/perfil");
  }

  async obtenerBoletas(): Promise<ApiResponse<BoletaCliente[]>> {
    return this.makeRequest<BoletaCliente[]>("/dashboard/cliente/boletas");
  }

  async actualizarPerfil(datos: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>("/dashboard/cliente/perfil", {
      method: "PUT",
      body: JSON.stringify(datos),
    });
  }
}

export const dashboardClienteService = new DashboardClienteService();
