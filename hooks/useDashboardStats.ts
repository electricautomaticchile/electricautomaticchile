import { useState, useEffect } from 'react';
import { dashboardService, EstadisticasDashboard } from '@/lib/api/services/dashboardService';

export function useDashboardStats() {
  const [stats, setStats] = useState<EstadisticasDashboard>({
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
    
    const interval = setInterval(() => {
      cargarEstadisticas();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, recargar: cargarEstadisticas };
}
