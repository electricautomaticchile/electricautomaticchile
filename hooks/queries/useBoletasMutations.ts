import { useMutation, useQueryClient } from '@tanstack/react-query';
import { baseService } from '@/lib/api/utils/baseService';

interface ConfirmarPagoData {
  boletaId: string;
  estado: string;
  fechaPago: string;
  servicioRepuesto: boolean;
  mensaje: string;
}

interface ConfirmarPagoResponse {
  success: boolean;
  message?: string;
  data?: ConfirmarPagoData;
  servicioRestablecido?: boolean;
  boletasVencidasRestantes?: number;
}

export function usePagarBoleta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boletaId: string): Promise<ConfirmarPagoResponse> => {
      const response = await baseService.post(`/boletas/${boletaId}/confirmar-pago`, {});
      const data = response.data as ConfirmarPagoData | undefined;
      return {
        success: response.success,
        message: response.message || data?.mensaje,
        servicioRestablecido: data?.servicioRepuesto,
        data,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boletas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'cliente'] });
    },
  });
}

export function useDescargarBoletaPDF() {
  return useMutation({
    mutationFn: async ({ boletaId, numeroBoleta }: { boletaId: string; numeroBoleta: string }) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

      // credentials: 'include' envía la cookie auth_token automáticamente
      const response = await fetch(`${apiUrl}/api/boletas/${boletaId}/pdf`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error al descargar PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boleta-${numeroBoleta}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    },
  });
}
