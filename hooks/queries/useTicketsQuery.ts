"use client";

import { useQuery } from "@tanstack/react-query";
import { ticketsService } from "@/lib/api/ticketsService";

export function useTickets(filtros?: any) {
  return useQuery({
    queryKey: ["tickets", filtros],
    queryFn: () => ticketsService.obtenerTickets(filtros),
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => ticketsService.obtenerTicketPorId(id),
    enabled: !!id,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });
}
