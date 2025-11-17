import { baseService } from "./utils/baseService";

export interface HistorialConsumoData {
  _id: string;
  clienteId: string;
  dispositivoId: string;
  timestamp: string;
  potenciaActiva: number;
  energia: number;
  voltaje?: number;
  corriente?: number;
  factorPotencia?: number;
  costo?: number;
  tarifaKwh?: number;
  numeroDispositivo?: string;
  ubicacion?: string;
}

export interface HistorialAgregado {
  _id: {
    periodo: string;
    dispositivoId: string;
  };
  timestamp: string;
  timestampFinal: string;
  potenciaPromedio: number;
  potenciaMaxima: number;
  potenciaMinima: number;
  energiaInicial: number;
  energiaFinal: number;
  energiaTotal: number;
  costoInicial: number;
  costoFinal: number;
  costoTotal: number;
  voltaje?: number;
  corriente?: number;
  factorPotencia?: number;
  numeroMuestras: number;
}

export interface EstadisticasConsumo {
  consumoTotal: number;
  costoTotal: number;
  potenciaPromedio: number;
  potenciaMaxima: number;
  potenciaMinima: number;
  voltajePromedio?: number;
  corrientePromedio?: number;
  factorPotenciaPromedio?: number;
  numeroMuestras: number;
}

class HistorialConsumoService {
  /**
   * Obtener historial de consumo
   */
  async obtenerHistorial(
    clienteId: string,
    opciones: {
      desde?: Date;
      hasta?: Date;
      dispositivoId?: string;
      limite?: number;
      agregacion?: "minuto" | "hora" | "dia" | "mes";
    } = {}
  ) {
    const params = new URLSearchParams();
    
    if (opciones.desde) {
      params.append("desde", opciones.desde.toISOString());
    }
    if (opciones.hasta) {
      params.append("hasta", opciones.hasta.toISOString());
    }
    if (opciones.dispositivoId) {
      params.append("dispositivoId", opciones.dispositivoId);
    }
    if (opciones.limite) {
      params.append("limite", opciones.limite.toString());
    }
    if (opciones.agregacion) {
      params.append("agregacion", opciones.agregacion);
    }

    return baseService.get<HistorialConsumoData[] | HistorialAgregado[]>(
      `/historial-consumo/${clienteId}?${params.toString()}`
    );
  }

  /**
   * Obtener estadísticas de consumo
   */
  async obtenerEstadisticas(
    clienteId: string,
    desde?: Date,
    hasta?: Date
  ) {
    const params = new URLSearchParams();
    
    if (desde) {
      params.append("desde", desde.toISOString());
    }
    if (hasta) {
      params.append("hasta", hasta.toISOString());
    }

    return baseService.get<EstadisticasConsumo>(
      `/historial-consumo/${clienteId}/estadisticas?${params.toString()}`
    );
  }

  /**
   * Generar datos de prueba (solo desarrollo)
   */
  async generarDatosPrueba(
    dispositivoId: string,
    clienteId: string,
    numeroDispositivo: string
  ) {
    return baseService.post("/historial-consumo/prueba/generar", {
      dispositivoId,
      clienteId,
      numeroDispositivo,
    });
  }
}

export const historialConsumoService = new HistorialConsumoService();
