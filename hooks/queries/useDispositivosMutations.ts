"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dispositivosService } from "@/lib/api/services/dispositivosService";
import { useToast } from "@/components/ui/use-toast";

export function useCreateDispositivo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => dispositivosService.crearDispositivo(data),
    onMutate: async (newDispositivo) => {
      await queryClient.cancelQueries({ queryKey: ["dispositivos"] });
      
      const previousDispositivos = queryClient.getQueryData(["dispositivos"]);
      
      queryClient.setQueryData(["dispositivos"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: [...old.data, { ...newDispositivo, _id: "temp-" + Date.now() }],
        };
      });

      return { previousDispositivos };
    },
    onError: (err, newDispositivo, context) => {
      if (context?.previousDispositivos) {
        queryClient.setQueryData(["dispositivos"], context.previousDispositivos);
      }
      toast({
        title: "Error",
        description: "No se pudo crear el dispositivo",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Dispositivo creado",
        description: "El dispositivo se creó exitosamente",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dispositivos"] });
    },
  });
}

export function useControlDispositivo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, accion }: { id: string; accion: "shutdown" | "restart" | "toggle" | "on" | "off" }) =>
      dispositivosService.controlarDispositivo(id, accion),
    onMutate: async ({ id, accion }) => {
      await queryClient.cancelQueries({ queryKey: ["dispositivos"] });
      await queryClient.cancelQueries({ queryKey: ["dispositivo", id] });

      const previousDispositivos = queryClient.getQueryData(["dispositivos"]);
      const previousDispositivo = queryClient.getQueryData(["dispositivo", id]);

      return { previousDispositivos, previousDispositivo };
    },
    onError: (err, variables, context) => {
      if (context?.previousDispositivos) {
        queryClient.setQueryData(["dispositivos"], context.previousDispositivos);
      }
      if (context?.previousDispositivo) {
        queryClient.setQueryData(["dispositivo", variables.id], context.previousDispositivo);
      }
      toast({
        title: "Error",
        description: `No se pudo ejecutar la acción`,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Acción ejecutada",
        description: `La acción se ejecutó exitosamente`,
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dispositivos"] });
      queryClient.invalidateQueries({ queryKey: ["dispositivo", variables.id] });
    },
  });
}

export function useAgregarLectura() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, lecturas }: { id: string; lecturas: any[] }) =>
      dispositivosService.agregarLecturaDispositivo(id, lecturas),
    onSuccess: () => {
      toast({
        title: "Lectura agregada",
        description: "La lectura se registró exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo agregar la lectura",
        variant: "destructive",
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dispositivo", variables.id] });
    },
  });
}

export function useAsignarDispositivo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ dispositivoId, clienteId }: { dispositivoId: string; clienteId: string }) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/dispositivos/${dispositivoId}/asignar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ clienteId }),
      });

      if (!response.ok) {
        throw new Error('Error al asignar dispositivo');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispositivos'] });
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: "Dispositivo asignado",
        description: "El dispositivo se asignó exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo asignar el dispositivo",
        variant: "destructive",
      });
    },
  });
}

export function useDesasignarDispositivo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (dispositivoId: string) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/dispositivos/${dispositivoId}/desasignar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al desasignar dispositivo');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispositivos'] });
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: "Dispositivo desasignado",
        description: "El dispositivo se desasignó exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo desasignar el dispositivo",
        variant: "destructive",
      });
    },
  });
}
