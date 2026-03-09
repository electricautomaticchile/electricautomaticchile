"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/api/services/dashboardService";
import { dashboardClienteService } from "@/lib/api/services/dashboardClienteService";

export function useDashboardEmpresa() {
  return useQuery({
    queryKey: ["dashboard", "empresa"],
    queryFn: () => dashboardService.obtenerEstadisticas(),
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useDashboardCliente() {
  return useQuery({
    queryKey: ["dashboard", "cliente"],
    queryFn: () => dashboardClienteService.obtenerResumen(),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}

export function useDashboardClienteTodo() {
  return useQuery({
    queryKey: ["dashboard", "cliente", "todo"],
    queryFn: () => dashboardClienteService.obtenerTodo(),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}

export function useConsumoCliente() {
  return useQuery({
    queryKey: ["consumo", "cliente"],
    queryFn: () => dashboardClienteService.obtenerConsumo(),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}
