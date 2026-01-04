import { useState, useEffect } from 'react';
import { dashboardService, EstadisticasDashboard } from '@/lib/api/services/dashboardService';
import { useWebSocketEvents } from './useWebSocketEvents';

export function useDashboardStats() {
  const [stats, setStats] = useState<EstadisticasDashboard>({
    clientesActivos: 0,
    clientesTotales: 0,
    dispositivosActivos: 0,
    dispositivosTotales: 0,
    alertasActivas: 0,
    ticketsPendientes: 0,
    consumoTotal: 0,
    consumoHoy: 0,
  });
  const [loading, setLoading] = useState(true);

  const cargarEstadisticas = async () => {
    try {
      const data = await dashboardService.obtenerEstadisticas();
      setStats(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  useWebSocketEvents('alert', () => {
    cargarEstadisticas();
  });

  useWebSocketEvents('device_update', () => {
    cargarEstadisticas();
  });

  useWebSocketEvents('notification', () => {
    cargarEstadisticas();
  });

  return { stats, loading, recargar: cargarEstadisticas };
}
