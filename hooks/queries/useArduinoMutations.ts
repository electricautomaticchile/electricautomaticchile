import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ArduinoCommandResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export function useArduinoCommand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comando: string) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/arduino/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ command: comando }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar comando');
      }

      const data = await response.json();
      return data as ArduinoCommandResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispositivos'] });
      queryClient.invalidateQueries({ queryKey: ['dispositivo-detalle'] });
    },
  });
}
