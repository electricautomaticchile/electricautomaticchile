import { useQuery } from '@tanstack/react-query';

interface EstadisticasCliente {
  consumoMensual: number;
  costoMensual: number;
  dispositivosActivos: number;
}

interface DashboardClienteResumen {
  estadisticas: EstadisticasCliente;
}

export function useDashboardClienteResumen(enabled: boolean = true) {
  return useQuery({
    queryKey: ['dashboard', 'cliente', 'resumen'],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/dashboard/cliente/resumen`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar resumen del cliente');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al cargar datos');
      }

      return data.data as DashboardClienteResumen;
    },
    enabled,
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 5000,
  });
}
