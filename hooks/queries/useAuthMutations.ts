"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ensureCSRFToken } from "@/lib/utils/csrf";

export function useCambiarPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      const csrfToken = await ensureCSRFToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/cambiar-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          passwordActual: currentPassword,
          passwordNuevo: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al cambiar contraseña');
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña se cambió exitosamente",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar la contraseña",
        variant: "destructive",
      });
    },
  });
}
