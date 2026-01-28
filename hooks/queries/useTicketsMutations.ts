"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsService } from "@/lib/api/ticketsService";
import { useToast } from "@/components/ui/use-toast";

export function useCreateTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => ticketsService.crearTicket(data),
    onMutate: async (newTicket) => {
      await queryClient.cancelQueries({ queryKey: ["tickets"] });

      const previousTickets = queryClient.getQueryData(["tickets"]);

      queryClient.setQueryData(["tickets"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: [
            {
              ...newTicket,
              _id: "temp-" + Date.now(),
              estado: "abierto",
              fechaCreacion: new Date().toISOString(),
            },
            ...old.data,
          ],
        };
      });

      return { previousTickets };
    },
    onError: (err, newTicket, context) => {
      if (context?.previousTickets) {
        queryClient.setQueryData(["tickets"], context.previousTickets);
      }
      toast({
        title: "Error",
        description: "No se pudo crear el ticket",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Ticket creado",
        description: "Tu solicitud se registró exitosamente",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useUpdateTicketEstado() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: "abierto" | "en-proceso" | "resuelto" | "cerrado" }) =>
      ticketsService.actualizarEstado(id, estado),
    onMutate: async ({ id, estado }) => {
      await queryClient.cancelQueries({ queryKey: ["tickets"] });
      await queryClient.cancelQueries({ queryKey: ["ticket", id] });

      const previousTickets = queryClient.getQueryData(["tickets"]);
      const previousTicket = queryClient.getQueryData(["ticket", id]);

      queryClient.setQueryData(["tickets"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((ticket: any) =>
            ticket._id === id ? { ...ticket, estado } : ticket
          ),
        };
      });

      queryClient.setQueryData(["ticket", id], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: { ...old.data, estado },
        };
      });

      return { previousTickets, previousTicket };
    },
    onError: (err, variables, context) => {
      if (context?.previousTickets) {
        queryClient.setQueryData(["tickets"], context.previousTickets);
      }
      if (context?.previousTicket) {
        queryClient.setQueryData(["ticket", variables.id], context.previousTicket);
      }
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del ticket",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Estado actualizado",
        description: "El estado del ticket se actualizó exitosamente",
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] });
    },
  });
}

export function useAddTicketRespuesta() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, respuesta }: { id: string; respuesta: any }) =>
      ticketsService.agregarRespuesta(id, respuesta),
    onMutate: async ({ id, respuesta }) => {
      await queryClient.cancelQueries({ queryKey: ["ticket", id] });

      const previousTicket = queryClient.getQueryData(["ticket", id]);

      queryClient.setQueryData(["ticket", id], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            respuestas: [
              ...(old.data.respuestas || []),
              {
                _id: "temp-" + Date.now(),
                mensaje: respuesta.mensaje,
                fecha: new Date().toISOString(),
              },
            ],
          },
        };
      });

      return { previousTicket };
    },
    onError: (err, variables, context) => {
      if (context?.previousTicket) {
        queryClient.setQueryData(["ticket", variables.id], context.previousTicket);
      }
      toast({
        title: "Error",
        description: "No se pudo agregar la respuesta",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Respuesta agregada",
        description: "Tu respuesta se registró exitosamente",
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}
