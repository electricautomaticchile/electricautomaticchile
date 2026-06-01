import { baseService } from '../utils/baseService';

export interface EstadisticasDashboard {
  clientesActivos: number;
  clientesTotales: number;
  dispositivosActivos: number;
  dispositivosTotales: number;
  alertasActivas: number;
  ticketsPendientes: number;
  boletasPendientes: number;
  consumoTotal: number;
  consumoHoy: number;
  ingresosMensuales: number;
}

export const dashboardService = {
  obtenerEstadisticas: async (): Promise<EstadisticasDashboard> => {
    const response = await baseService.get<EstadisticasDashboard>('/dashboard/estadisticas');
    return response.data || {
      clientesActivos: 0,
      clientesTotales: 0,
      dispositivosActivos: 0,
      dispositivosTotales: 0,
      alertasActivas: 0,
      ticketsPendientes: 0,
      boletasPendientes: 0,
      consumoTotal: 0,
      consumoHoy: 0,
      ingresosMensuales: 0,
    };
  },
};
