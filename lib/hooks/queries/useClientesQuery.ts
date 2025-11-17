import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { clientesService } from "@/lib/api/services/clientesService";
import { ICliente, ApiResponse } from "@/lib/api/types";

// Query Keys para mejor organización del caché
export const clientesKeys = {
  all: ["clientes"] as const,
  lists: () => [...clientesKeys.all, "list"] as const,
  list: (params?: any) => [...clientesKeys.lists(), params] as const,
  details: () => [...clientesKeys.all, "detail"] as const,
  detail: (id: string) => [...clientesKeys.details(), id] as const,
  stats: () => [...clientesKeys.all, "stats"] as const,
} as const;

// Interfaz para parámetros de búsqueda
interface ClientesQueryParams {
  page?: number;
  limit?: number;
  tipoCliente?: string;
  ciudad?: string;
  busqueda?: string;
  estado?: string;
}

// Hook para obtener lista de clientes
export function useClientesQuery(
  params?: ClientesQueryParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<ICliente[]>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: clientesKeys.list(params),
    queryFn: () => clientesService.obtenerClientes(params),
    staleTime: 1000 * 60 * 2, // 2 minutos para listas
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
    ...options,
  });
}

// Hook para obtener un cliente específico
export function useClienteQuery(
  id: string,
  options?: Omit<UseQueryOptions<ApiResponse<ICliente>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: clientesKeys.detail(id),
    queryFn: () => clientesService.obtenerCliente(id),
    enabled: !!id, // Solo ejecutar si tenemos ID
    staleTime: 1000 * 60 * 5, // 5 minutos para detalles
    gcTime: 1000 * 60 * 15, // 15 minutos
    ...options,
  });
}

// Hook para crear cliente
export function useCreateClienteMutation(
  options?: UseMutationOptions<ApiResponse<ICliente>, Error, Partial<ICliente>>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: Partial<ICliente>) =>
      clientesService.crearCliente(datos),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientesKeys.stats() });

      // Optimistic update: agregar el nuevo cliente al caché
      if (data.success && data.data) {
        queryClient.setQueryData(clientesKeys.detail(data.data._id), data);
      }
    },
    onError: (error) => {
      console.error("Error creando cliente:", error);
    },
    ...options,
  });
}

// Hook para actualizar cliente
export function useUpdateClienteMutation(
  options?: UseMutationOptions<
    ApiResponse<ICliente>,
    Error,
    { id: string; datos: Partial<ICliente> },
    { previousCliente: unknown }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, datos }: { id: string; datos: Partial<ICliente> }) =>
      clientesService.actualizarCliente(id, datos),
    onMutate: async ({ id, datos }) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: clientesKeys.detail(id) });

      // Snapshot del valor anterior
      const previousCliente = queryClient.getQueryData(clientesKeys.detail(id));

      // Optimistic update
      queryClient.setQueryData(clientesKeys.detail(id), (old: any) => {
        if (old?.success && old?.data) {
          return {
            ...old,
            data: { ...old.data, ...datos },
          };
        }
        return old;
      });

      return { previousCliente };
    },
    onError: (err, variables, context) => {
      // Revertir optimistic update
      if (context?.previousCliente) {
        queryClient.setQueryData(
          clientesKeys.detail(variables.id),
          context.previousCliente
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Siempre invalidar para asegurar sincronización
      queryClient.invalidateQueries({
        queryKey: clientesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
    },
    ...options,
  });
}

// Hook para eliminar cliente
export function useDeleteClienteMutation(
  options?: UseMutationOptions<
    ApiResponse,
    Error,
    string,
    { previousCliente: unknown; previousLists: [readonly unknown[], unknown][] }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientesService.eliminarCliente(id),
    onMutate: async (id) => {
      // Cancelar queries relacionadas
      await queryClient.cancelQueries({ queryKey: clientesKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: clientesKeys.lists() });

      // Snapshot para rollback
      const previousCliente = queryClient.getQueryData(clientesKeys.detail(id));
      const previousLists = queryClient.getQueriesData({
        queryKey: clientesKeys.lists(),
      });

      // Optimistic update: remover de listas
      queryClient.setQueriesData(
        { queryKey: clientesKeys.lists() },
        (old: any) => {
          if (old?.success && old?.data && Array.isArray(old.data)) {
            return {
              ...old,
              data: old.data.filter((cliente: ICliente) => cliente._id !== id),
            };
          }
          return old;
        }
      );

      // Remover detalle del caché
      queryClient.removeQueries({ queryKey: clientesKeys.detail(id) });

      return { previousCliente, previousLists };
    },
    onError: (error, id, context) => {
      // Restaurar estado anterior
      if (context?.previousCliente) {
        queryClient.setQueryData(
          clientesKeys.detail(id),
          context.previousCliente
        );
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (data, id) => {
      // Asegurar que el cliente se remueva del caché
      queryClient.removeQueries({ queryKey: clientesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientesKeys.stats() });
    },
    ...options,
  });
}

// Hook principal que combina todo (compatible con el hook anterior)
export function useClientes(params?: ClientesQueryParams) {
  const clientesQuery = useClientesQuery(params);
  const createMutation = useCreateClienteMutation();
  const updateMutation = useUpdateClienteMutation();
  const deleteMutation = useDeleteClienteMutation();

  return {
    // Datos de la query principal
    clientes: clientesQuery.data?.data || [],
    loading: clientesQuery.isLoading,
    error: clientesQuery.error?.message || clientesQuery.data?.error || null,
    isError: clientesQuery.isError,
    isFetching: clientesQuery.isFetching,
    isRefetching: clientesQuery.isRefetching,

    // Métodos de manipulación
    obtenerClientes: (newParams?: ClientesQueryParams) => {
      // Si hay nuevos parámetros, invalidar y refetch con esos parámetros
      if (newParams !== undefined) {
        return clientesQuery.refetch();
      }
      return clientesQuery.refetch();
    },

    crear: createMutation.mutateAsync,
    actualizar: (id: string, datos: Partial<ICliente>) =>
      updateMutation.mutateAsync({ id, datos }),
    eliminar: deleteMutation.mutateAsync,

    // Estados de las mutaciones
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Métodos de utilidad
    refetch: clientesQuery.refetch,
  };
}

// Hook para estadísticas de clientes
export function useClientesStats(
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: clientesKeys.stats(),
    queryFn: async () => {
      // Esta función se podría conectar a un endpoint de estadísticas
      // Por ahora calculamos localmente
      const clientesResponse = await clientesService.obtenerClientes();

      if (!clientesResponse.success || !clientesResponse.data) {
        throw new Error("Error al obtener estadísticas");
      }

      const clientes = clientesResponse.data;

      return {
        total: clientes.length,
        activos: clientes.filter((c) => c.activo).length,
        inactivos: clientes.filter((c) => !c.activo).length,
        empresas: clientes.filter((c) => c.tipoCliente === "empresa").length,
        particulares: clientes.filter((c) => c.tipoCliente === "particular")
          .length,
        ingresosMensuales: 0, // Campo removido del modelo
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 15, // 15 minutos
    ...options,
  });
}
