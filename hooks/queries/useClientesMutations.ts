"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientesService } from "@/lib/api/services/clientesService";
import { useToast } from "@/components/ui/use-toast";

export function useCreateCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => clientesService.crearCliente(data),
    onMutate: async (newCliente) => {
      await queryClient.cancelQueries({ queryKey: ["clientes"] });
      
      const previousClientes = queryClient.getQueryData(["clientes"]);
      
      queryClient.setQueryData(["clientes"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: [...old.data, { ...newCliente, _id: "temp-" + Date.now() }],
        };
      });

      return { previousClientes };
    },
    onError: (err, newCliente, context) => {
      if (context?.previousClientes) {
        queryClient.setQueryData(["clientes"], context.previousClientes);
      }
      toast({
        title: "Error",
        description: "No se pudo crear el cliente",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Cliente creado",
        description: "El cliente se creó exitosamente",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
}

export function useUpdateCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      clientesService.actualizarCliente(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["clientes"] });
      await queryClient.cancelQueries({ queryKey: ["cliente", id] });

      const previousClientes = queryClient.getQueryData(["clientes"]);
      const previousCliente = queryClient.getQueryData(["cliente", id]);

      queryClient.setQueryData(["clientes"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((cliente: any) =>
            cliente._id === id ? { ...cliente, ...data } : cliente
          ),
        };
      });

      queryClient.setQueryData(["cliente", id], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: { ...old.data, ...data },
        };
      });

      return { previousClientes, previousCliente };
    },
    onError: (err, variables, context) => {
      if (context?.previousClientes) {
        queryClient.setQueryData(["clientes"], context.previousClientes);
      }
      if (context?.previousCliente) {
        queryClient.setQueryData(["cliente", variables.id], context.previousCliente);
      }
      toast({
        title: "Error",
        description: "No se pudo actualizar el cliente",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Cliente actualizado",
        description: "Los cambios se guardaron exitosamente",
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["cliente", variables.id] });
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => clientesService.eliminarCliente(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["clientes"] });

      const previousClientes = queryClient.getQueryData(["clientes"]);

      queryClient.setQueryData(["clientes"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((cliente: any) => cliente._id !== id),
        };
      });

      return { previousClientes };
    },
    onError: (err, id, context) => {
      if (context?.previousClientes) {
        queryClient.setQueryData(["clientes"], context.previousClientes);
      }
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Cliente eliminado",
        description: "El cliente se eliminó exitosamente",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
}
