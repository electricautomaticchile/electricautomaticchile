import { useMutation, useQueryClient } from '@tanstack/react-query';
import { baseService } from '@/lib/api/utils/baseService';

interface PagarBoletaResponse {
  success: boolean;
  message?: string;
  servicioRestablecido?: boolean;
  boletasVencidasRestantes?: number;
}

export function usePagarBoleta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boletaId: string) => {
      const response = await baseService.put(`/boletas/${boletaId}/pagar`, {});
      return response as PagarBoletaResponse;
    },
    onSuccess: (data, boletaId) => {
      queryClient.invalidateQueries({ queryKey: ['boletas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'cliente'] });
    },
  });
}

export function useDescargarBoletaPDF() {
  return useMutation({
    mutationFn: async ({ boletaId, numeroBoleta }: { boletaId: string; numeroBoleta: string }) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/boletas/${boletaId}/pdf`);

      if (!response.ok) {
        throw new Error('Error al descargar PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${numeroBoleta}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    },
  });
}
