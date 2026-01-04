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
