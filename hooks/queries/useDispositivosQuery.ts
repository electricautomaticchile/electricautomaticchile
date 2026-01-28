"use client";

import { useQuery } from "@tanstack/react-query";
import { dispositivosService } from "@/lib/api/services/dispositivosService";

export function useDispositivos(filtros?: any) {
  return useQuery({
    queryKey: ["dispositivos", filtros],
    queryFn: () => dispositivosService.obtenerDispositivos(filtros),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}

export function useDispositivo(id: string) {
  return useQuery({
    queryKey: ["dispositivo", id],
    queryFn: () => dispositivosService.obtenerDispositivo(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}
