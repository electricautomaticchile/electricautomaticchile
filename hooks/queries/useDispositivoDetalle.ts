"use client";

import { useQuery } from "@tanstack/react-query";
import { dispositivosService } from "@/lib/api/services/dispositivosService";

export function useDispositivoDetalle(dispositivoId: string | null) {
  return useQuery({
    queryKey: ["dispositivo", "detalle", dispositivoId],
    queryFn: async () => {
      if (!dispositivoId) return null;
      const response = await dispositivosService.obtenerDispositivo(dispositivoId);
      return response.data;
    },
    enabled: !!dispositivoId,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}

export function useDispositivosDetalles(dispositivoIds: string[]) {
  return useQuery({
    queryKey: ["dispositivos", "detalles", dispositivoIds],
    queryFn: async () => {
      if (dispositivoIds.length === 0) return new Map();
      
      const promesas = dispositivoIds.map(async (id) => {
        try {
          const response = await dispositivosService.obtenerDispositivo(id);
          if (response.success && response.data?.ultimaLectura) {
            return {
              id,
              consumo: response.data.ultimaLectura.energy || 0,
              costo: response.data.ultimaLectura.cost || 0,
            };
          }
        } catch (error) {
          return null;
        }
      });

      const resultados = await Promise.all(promesas);
      const mapa = new Map();
      
      resultados.forEach((resultado) => {
        if (resultado) {
          mapa.set(resultado.id, {
            consumo: resultado.consumo,
            costo: resultado.costo,
          });
        }
      });

      return mapa;
    },
    enabled: dispositivoIds.length > 0,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}
