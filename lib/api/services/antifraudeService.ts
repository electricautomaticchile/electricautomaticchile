import { baseService } from '../utils/baseService';

export interface Anomalia {
  id: string;
  dispositivoId: string;
  clienteId: string;
  numeroDispositivo: string;
  nombreCliente: string;
  tipoAnomalia: string;
  severidad: 'low' | 'medium' | 'high' | 'critical';
  descripcion: string;
  valorEsperado?: number;
  valorDetectado?: number;
  porcentaje?: number;
  fechaDeteccion: string;
  estado: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  evidencia?: Record<string, any>;
  notasInvestigacion?: string;
  asignadoA?: string;
}

export interface EstadisticasAntifraude {
  totalAnomalias: number;
  anomaliasCriticas: number;
  fraudesConfirmados: number;
  tasaDeteccion: number;
  ahorroEstimado: number;
  tiempoPromedioResolucion: number;
  porTipo: Record<string, number>;
}

export const antifraudeService = {
  detectarAnomalias: async (): Promise<Anomalia[]> => {
    const response = await baseService.get<Anomalia[]>('/antifraude/anomalias');
    return response.data || [];
  },

  obtenerEstadisticas: async (): Promise<EstadisticasAntifraude> => {
    const response = await baseService.get<EstadisticasAntifraude>('/antifraude/estadisticas');
    return response.data || {
      totalAnomalias: 0,
      anomaliasCriticas: 0,
      fraudesConfirmados: 0,
      tasaDeteccion: 0,
      ahorroEstimado: 0,
      tiempoPromedioResolucion: 0,
      porTipo: {},
    };
  },
};
