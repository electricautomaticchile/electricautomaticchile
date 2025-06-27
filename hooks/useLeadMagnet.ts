import { useState, useCallback } from "react";
import { apiService } from "@/lib/api/apiService";

interface LeadMagnetData {
  email: string;
  nombre?: string;
  empresa?: string;
}

interface UseLeadMagnetReturn {
  loading: boolean;
  success: boolean;
  error: string | null;
  sendLeadMagnet: (data: LeadMagnetData) => Promise<boolean>;
  reset: () => void;
}

export const useLeadMagnet = (): UseLeadMagnetReturn => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendLeadMagnet = useCallback(
    async (data: LeadMagnetData): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Validaciones básicas del lado cliente
        if (!data.email) {
          throw new Error("El email es requerido");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          throw new Error("El formato del email no es válido");
        }

        // Llamar a la nueva API del backend
        const response = await apiService.enviarLeadMagnet(data);

        if (response.success) {
          setSuccess(true);

          // Opcional: Tracking para analytics
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "lead_magnet_download", {
              event_category: "engagement",
              event_label: "PDF Download",
              custom_parameters: {
                email: data.email,
                empresa: data.empresa || "No especificada",
              },
            });
          }

          return true;
        } else {
          throw new Error(response.message || "Error al enviar el informe");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error("Error en lead magnet:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setLoading(false);
    setSuccess(false);
    setError(null);
  }, []);

  return {
    loading,
    success,
    error,
    sendLeadMagnet,
    reset,
  };
};

// Hook adicional para obtener estadísticas (solo para admins)
export const useLeadMagnetStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.obtenerEstadisticasLeads();

      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || "Error al cargar estadísticas");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error cargando estadísticas de leads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    loadStats,
  };
};
