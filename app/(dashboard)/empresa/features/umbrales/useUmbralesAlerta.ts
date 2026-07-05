"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";

// Umbrales de alerta configurables por empresa. Consume el backend:
//   GET /api/umbrales-alerta  → umbrales actuales (o defaults si no hay config)
//   PUT /api/umbrales-alerta  → guarda los umbrales (CSRF lo agrega el axios)
// El backend resuelve la empresa desde el JWT, por eso no se envía empresaId.
export interface UmbralesAlerta {
  voltajeMin: number;
  voltajeMax: number;
  corrienteMax: number;
  consumoMax: number;
  esDefault: boolean;
  updatedAt?: string;
}

// Coinciden con los defaults del backend (200-240V, >50A, >100 kWh).
export const UMBRALES_DEFAULT: UmbralesAlerta = {
  voltajeMin: 200,
  voltajeMax: 240,
  corrienteMax: 50,
  consumoMax: 100,
  esDefault: true,
};

export function useUmbralesAlerta() {
  const { toast } = useToast();
  const [umbrales, setUmbrales] = useState<UmbralesAlerta>(UMBRALES_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/umbrales-alerta");
      if (data) {
        setUmbrales({ ...UMBRALES_DEFAULT, ...data });
      }
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron cargar los umbrales de alerta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const actualizar = useCallback((cambios: Partial<UmbralesAlerta>) => {
    setUmbrales((prev) => ({ ...prev, ...cambios }));
  }, []);

  const restaurarDefaults = useCallback(() => {
    setUmbrales({ ...UMBRALES_DEFAULT, esDefault: true });
  }, []);

  const guardar = useCallback(async () => {
    if (umbrales.voltajeMin >= umbrales.voltajeMax) {
      toast({
        title: "Datos inválidos",
        description: "El voltaje mínimo debe ser menor que el máximo.",
        variant: "destructive",
      });
      return;
    }
    const valores = [
      umbrales.voltajeMin,
      umbrales.voltajeMax,
      umbrales.corrienteMax,
      umbrales.consumoMax,
    ];
    if (valores.some((v) => !(v > 0) || Number.isNaN(v))) {
      toast({
        title: "Datos inválidos",
        description: "Todos los umbrales deben ser números mayores que 0.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { data } = await apiClient.put("/api/umbrales-alerta", {
        voltajeMin: umbrales.voltajeMin,
        voltajeMax: umbrales.voltajeMax,
        corrienteMax: umbrales.corrienteMax,
        consumoMax: umbrales.consumoMax,
      });
      if (data) {
        setUmbrales({ ...UMBRALES_DEFAULT, ...data });
      }
      toast({
        title: "✅ Umbrales guardados",
        description: "Se actualizaron los umbrales de alerta de tu empresa.",
      });
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message || "Intenta nuevamente.";
      toast({
        title: "Error al guardar",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [umbrales, toast]);

  return { umbrales, loading, saving, actualizar, guardar, restaurarDefaults };
}
