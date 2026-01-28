import { useQuery } from '@tanstack/react-query';
import { baseService } from '@/lib/api/utils/baseService';

interface Boleta {
  _id: string;
  clienteId: string;
  numeroBoleta: string;
  monto: number;
  fechaEmision: Date;
  fechaVencimiento: Date;
  estado: 'pendiente' | 'pagada' | 'vencida';
  consumoKwh: number;
  periodo: string;
  fechaPago?: Date;
}

export function useBoletasCliente(clienteId: string | null) {
  return useQuery({
    queryKey: ['boletas', 'cliente', clienteId],
    queryFn: async () => {
      if (!clienteId) throw new Error('Cliente ID requerido');
      
      const response = await baseService.get(`/boletas/cliente/${clienteId}`);
      if (!response.success) {
        throw new Error(response.message || 'Error al cargar boletas');
      }
      return response.data as Boleta[];
    },
    enabled: !!clienteId,
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useBoleta(boletaId: string | null) {
  return useQuery({
    queryKey: ['boletas', boletaId],
    queryFn: async () => {
      if (!boletaId) throw new Error('Boleta ID requerido');
      
      const response = await baseService.get(`/boletas/${boletaId}`);
      if (!response.success) {
        throw new Error(response.message || 'Error al cargar boleta');
      }
      return response.data as Boleta;
    },
    enabled: !!boletaId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
