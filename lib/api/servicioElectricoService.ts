import { baseService } from "./utils/baseService";

export interface EstadoServicio {
  _id: string;
  clienteId: string;
  estadoServicio: "activo" | "cortado" | "suspendido";
  boletasPendientes: number;
  boletasPagadas: number;
  montoDeuda: number;
  ultimaActualizacion: string;
  puedeRestablecer: boolean;
  motivoCorte?: string;
  historialCambios: HistorialCambio[];
}

export interface HistorialCambio {
  fecha: string;
  estadoAnterior: string;
  estadoNuevo: string;
  realizadoPor: string;
  motivo?: string;
}

class ServicioElectricoService {
  /**
   * Obtener estado del servicio de un cliente
   */
  async obtenerEstado(clienteId: string) {
    return baseService.get<EstadoServicio>(
      `/servicio-electrico/${clienteId}`
    );
  }

  /**
   * Cliente: Restablecer servicio (con restricciones)
   */
  async restablecerServicioCliente(clienteId: string) {
    return baseService.post<EstadoServicio>(
      `/servicio-electrico/${clienteId}/restablecer`,
      {}
    );
  }

  /**
   * Empresa: Cortar servicio
   */
  async cortarServicio(clienteId: string, motivo?: string) {
    return baseService.post<EstadoServicio>(
      `/servicio-electrico/${clienteId}/cortar`,
      { motivo }
    );
  }

  /**
   * Empresa: Restablecer servicio (sin restricciones)
   */
  async restablecerServicioEmpresa(clienteId: string, motivo?: string) {
    return baseService.post<EstadoServicio>(
      `/servicio-electrico/${clienteId}/restablecer-empresa`,
      { motivo }
    );
  }

  /**
   * Actualizar estado de pagos
   */
  async actualizarEstadoPagos(
    clienteId: string,
    data: {
      boletasPendientes?: number;
      boletasPagadas?: number;
      montoDeuda?: number;
    }
  ) {
    return baseService.put<EstadoServicio>(
      `/servicio-electrico/${clienteId}/pagos`,
      data
    );
  }

  /**
   * Obtener historial de cambios
   */
  async obtenerHistorial(clienteId: string) {
    return baseService.get<HistorialCambio[]>(
      `/servicio-electrico/${clienteId}/historial`
    );
  }
}

export const servicioElectricoService = new ServicioElectricoService();
