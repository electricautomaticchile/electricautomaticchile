"use client";
import { useState, useEffect } from "react";
import CoordinadorElectricoService from "@/lib/api/coordinadorService";

interface SistemaResumen {
  demanda: {
    promedio: number;
    maximo: number;
    total: number;
  };
  generacion: {
    total: number;
    ernc: number;
    porcentajeERNC: number;
  };
  costoMarginal: {
    promedio: number;
  };
  embalses: {
    cotaPromedio: number;
    cantidad: number;
  };
  fecha: string;
}

interface UseCoordinadorDataReturn {
  data: SistemaResumen | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCoordinadorData = (
  fecha?: string
): UseCoordinadorDataReturn => {
  const [data, setData] = useState<SistemaResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coordinadorService = new CoordinadorElectricoService();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const resumen = await coordinadorService.getResumenSistema(fecha);
      setData(resumen);
    } catch (err) {
      console.error("Error fetching coordinador data:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");

      // Datos de fallback para desarrollo/demo
      setData({
        demanda: {
          promedio: 8245,
          maximo: 9832,
          total: 197880,
        },
        generacion: {
          total: 201450,
          ernc: 89652,
          porcentajeERNC: 44.5,
        },
        costoMarginal: {
          promedio: 127.5,
        },
        embalses: {
          cotaPromedio: 652.3,
          cantidad: 12,
        },
        fecha: new Date().toISOString().split("T")[0],
      });
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fecha]);

  return { data, loading, error, refetch };
};
