"use client";
import { useState, useEffect, useCallback } from "react";
import { LoadingState, EmptyState } from "@/components/shared";
import { Headphones, MessageSquare } from "lucide-react";
import { useApi } from '@/hooks/useApi';
import { ticketsService, Ticket, EstadisticasTickets } from "@/lib/api/ticketsService";
import { useToast } from "@/components/ui/use-toast";
import { TicketEstadisticas } from "./tickets/TicketEstadisticas";
import { TicketFiltros } from "./tickets/TicketFiltros";
import { TicketLista } from "./tickets/TicketLista";
import { TicketDetalle } from "./tickets/TicketDetalle";
import { formatoEstado, formatoPrioridad } from "./tickets/ticket-utils";

export function GestionTickets() {
  const { user } = useApi();
  const { toast } = useToast();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(
    null
  );
  const [estadisticas, setEstadisticas] = useState<EstadisticasTickets | null>(
    null
  );
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Filtros
  const [filtros, setFiltros] = useState({
    estado: "",
    categoria: "",
    prioridad: "",
    busqueda: "",
  });



  // Obtener ID de la empresa
  const empresaId = (user as any)?._id?.toString() || user?.id?.toString();
  const nombreEmpresa = (user as any)?.nombre || user?.name || "Soporte";

  // Debug
  useEffect(() => {
  }, [empresaId, user]);

  const cargarTickets = useCallback(async () => {
    if (!empresaId) return;

    setCargando(true);
    try {
      const response = await ticketsService.obtenerTickets({
        empresaId,
        estado: filtros.estado || undefined,
        categoria: filtros.categoria || undefined,
        prioridad: filtros.prioridad || undefined,
        limit: 100,
      });


      if (response.success && response.data) {
        // Los tickets están en response.data directamente (es un array)
        let ticketsFiltrados: Ticket[] = Array.isArray(response.data)
          ? response.data
          : [];

        // Filtro de búsqueda local
        if (filtros.busqueda) {
          const busqueda = filtros.busqueda.toLowerCase();
          ticketsFiltrados = ticketsFiltrados.filter(
            (t: Ticket) =>
              t.numeroTicket.toLowerCase().includes(busqueda) ||
              t.asunto.toLowerCase().includes(busqueda) ||
              t.nombreCliente.toLowerCase().includes(busqueda) ||
              t.numeroCliente.toLowerCase().includes(busqueda)
          );
        }

        setTickets(ticketsFiltrados);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  }, [empresaId, filtros, toast]);

  const cargarEstadisticas = useCallback(async () => {
    if (!empresaId) return;

    try {
      const response = await ticketsService.obtenerEstadisticas({ empresaId });
      if (response.success && response.data) {
        setEstadisticas(response.data);
      }
    } catch (error) {
    }
  }, [empresaId]);

  // Cargar tickets y estadísticas
  useEffect(() => {
    if (empresaId) {
      cargarTickets();
      cargarEstadisticas();
    }
  }, [empresaId, cargarTickets, cargarEstadisticas, filtros]);

  const enviarRespuesta = async (mensaje: string) => {
    if (!mensaje.trim() || !ticketSeleccionado) return;

    setEnviando(true);
    try {
      const response = await ticketsService.agregarRespuesta(
        ticketSeleccionado._id,
        {
          autorId: empresaId!,
          autorNombre: nombreEmpresa,
          autorTipo: "soporte",
          mensaje,
        }
      );

      if (response.success && response.data) {
        toast({
          title: "✅ Respuesta enviada",
          description: "La respuesta ha sido enviada al cliente",
        });

        setTicketSeleccionado(response.data);
        cargarTickets();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "No se pudo enviar la respuesta",
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  const cambiarEstado = async (nuevoEstado: string) => {
    if (!ticketSeleccionado) return;

    setEnviando(true);
    try {
      const response = await ticketsService.actualizarEstado(
        ticketSeleccionado._id,
        nuevoEstado as any
      );

      if (response.success && response.data) {
        toast({
          title: "✅ Estado actualizado",
          description: `El ticket ahora está ${formatoEstado(nuevoEstado).label}`,
        });

        setTicketSeleccionado(response.data);
        cargarTickets();
        cargarEstadisticas();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "No se pudo cambiar el estado",
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  const cambiarPrioridad = async (nuevaPrioridad: string) => {
    if (!ticketSeleccionado) return;

    setEnviando(true);
    try {
      const response = await ticketsService.actualizarPrioridad(
        ticketSeleccionado._id,
        nuevaPrioridad as any
      );

      if (response.success && response.data) {
        toast({
          title: "✅ Prioridad actualizada",
          description: `La prioridad ahora es ${formatoPrioridad(nuevaPrioridad).label}`,
        });

        setTicketSeleccionado(response.data);
        cargarTickets();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "No se pudo cambiar la prioridad",
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
            <Headphones className="h-8 w-8 text-orange-600" />
            Gestión de Tickets
          </h2>
          <p className="text-muted-foreground mt-1">
            Administra y responde tickets de soporte
          </p>
        </div>
      </div>

      {estadisticas && <TicketEstadisticas estadisticas={estadisticas} />}

      {ticketSeleccionado ? (
        <TicketDetalle
          ticket={ticketSeleccionado}
          onVolver={() => setTicketSeleccionado(null)}
          onCambiarEstado={cambiarEstado}
          onCambiarPrioridad={cambiarPrioridad}
          onEnviarRespuesta={enviarRespuesta}
          enviando={enviando}
        />
      ) : (
        <div className="space-y-4">
          <TicketFiltros filtros={filtros} onFiltrosChange={setFiltros} />

          {cargando ? (
            <LoadingState message="Cargando tickets..." />
          ) : !tickets || tickets.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No hay tickets"
              description="No hay tickets que coincidan con los filtros aplicados."
            />
          ) : (
            <TicketLista
              tickets={tickets}
              onSeleccionar={setTicketSeleccionado}
            />
          )}
        </div>
      )}
    </div>
  );
}
