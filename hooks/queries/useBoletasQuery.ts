import { useQuery } from '@tanstack/react-query';
import { baseService } from '@/lib/api/utils/baseService';

export interface Boleta {
  id: string;
  _id?: string;
  clienteId: string;
  empresaId?: string;
  dispositivoId?: string;
  monto: number;
  periodo: string;
  mes?: number;
  anio?: number;
  consumoKwh: number;
  estado: 'pendiente' | 'por_vencer' | 'vencido' | 'pagado';
  fechaCreacion: string;
  fechaVencimiento?: string;
  fechaPago?: string;
  motivoCorte?: string;
  // Alias para compatibilidad con componentes existentes
  numeroBoleta?: string;
  fechaEmision?: string;
}

export interface DeudaResumen {
  boletasPendientes: number;
  boletasVencidas: number;
  montoTotal: number;
  montoVencido: number;
  proximoVencimiento?: string;
  nivelAlerta: 'normal' | 'advertencia' | 'critico' | 'corte';
}

// Normaliza la boleta del backend al formato esperado por los componentes
function normalizarBoleta(b: any): Boleta {
  return {
    ...b,
    id: b.id || b._id,
    _id: b.id || b._id,
    numeroBoleta: b.numeroBoleta || `BOL-${(b.id || b._id || '').slice(-8).toUpperCase()}`,
    fechaEmision: b.fechaEmision || b.fechaCreacion,
    // Normalizar estado: el backend usa 'pagado', los componentes esperaban 'pagada'
    estado: b.estado === 'pagado' ? 'pagado' : b.estado,
  };
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
      const boletas = (response.data as any[]) || [];
      return boletas.map(normalizarBoleta) as Boleta[];
    },
    enabled: !!clienteId,
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useResumenDeuda(clienteId: string | null) {
  return useQuery({
    queryKey: ['boletas', 'resumen-deuda', clienteId],
    queryFn: async () => {
      if (!clienteId) throw new Error('Cliente ID requerido');
      const response = await baseService.get(`/boletas/cliente/${clienteId}/resumen-deuda`);
      if (!response.success) {
        throw new Error(response.message || 'Error al cargar resumen');
      }
      return response.data as DeudaResumen;
    },
    enabled: !!clienteId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
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
      return normalizarBoleta(response.data) as Boleta;
    },
    enabled: !!boletaId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
