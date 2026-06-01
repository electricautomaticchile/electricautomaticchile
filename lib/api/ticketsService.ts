import { baseService } from "./utils/baseService";

type TicketEstado = "abierto" | "en-proceso" | "resuelto" | "cerrado";

export interface Ticket {
  id?: string;
  _id: string;
  numeroTicket: string;
  clienteId: string;
  numeroCliente: string;
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente?: string;
  dispositivoId?: string;
  numeroDispositivo?: string;
  nombreDispositivo?: string;
  asunto: string;
  descripcion: string;
  categoria: "tecnico" | "facturacion" | "consulta" | "reclamo";
  prioridad: "baja" | "media" | "alta" | "urgente";
  estado: TicketEstado;
  asignadoA?: string;
  asignadoNombre?: string;
  empresaId?: string;
  respuestas: Respuesta[];
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaCierre?: string;
}

export interface Respuesta {
  _id?: string;
  autorId: string;
  autorNombre: string;
  autorTipo: "cliente" | "soporte" | "empresa";
  mensaje: string;
  archivosAdjuntos?: string[];
  fecha: string;
}

export interface CrearTicketDto {
  clienteId: string;
  asunto: string;
  descripcion: string;
  categoria: "tecnico" | "facturacion" | "consulta" | "reclamo";
  prioridad?: "baja" | "media" | "alta" | "urgente";
  dispositivoId?: string;
}

export interface AgregarRespuestaDto {
  autorId: string;
  autorNombre: string;
  autorTipo: "cliente" | "soporte" | "empresa";
  mensaje: string;
}

export interface FiltrosTickets {
  clienteId?: string;
  empresaId?: string;
  estado?: string;
  categoria?: string;
  prioridad?: string;
  page?: number;
  limit?: number;
}

export interface EstadisticasTickets {
  total: number;
  porEstado: {
    abiertos: number;
    enProceso: number;
    resueltos: number;
    cerrados: number;
  };
  porCategoria: Record<string, number>;
  porPrioridad: Record<string, number>;
}

function normalizarEstadoTicket(estado?: string): TicketEstado {
  if (estado === "en_proceso" || estado === "en-proceso") return "en-proceso";
  if (estado === "resuelto" || estado === "cerrado" || estado === "abierto") return estado;
  return "abierto";
}

function estadoParaBackend(estado: TicketEstado) {
  return estado === "en-proceso" ? "en_proceso" : estado;
}

function normalizarTicket(ticket: any): Ticket {
  const id = ticket?._id || ticket?.id || "";

  return {
    ...ticket,
    id,
    _id: id,
    asunto: ticket?.asunto || ticket?.titulo || "",
    numeroCliente: ticket?.numeroCliente || "",
    nombreCliente: ticket?.nombreCliente || "",
    emailCliente: ticket?.emailCliente || "",
    estado: normalizarEstadoTicket(ticket?.estado),
    respuestas: Array.isArray(ticket?.respuestas)
      ? ticket.respuestas.map((respuesta: any, index: number) => ({
          ...respuesta,
          _id: respuesta?._id || `${id}-respuesta-${index}`,
          autorId: respuesta?.autorId || respuesta?.usuarioId || "",
          autorNombre: respuesta?.autorNombre || "Soporte",
          autorTipo: respuesta?.autorTipo || "soporte",
          fecha: respuesta?.fecha || respuesta?.fechaCreacion || ticket?.fechaCreacion,
        }))
      : [],
    fechaActualizacion: ticket?.fechaActualizacion || ticket?.fechaCreacion,
  };
}

class TicketsService {
  /**
   * Crear un nuevo ticket
   */
  async crearTicket(data: CrearTicketDto) {
    const response = await baseService.post<Ticket>("/tickets", data);
    if (response.data) response.data = normalizarTicket(response.data);
    return response;
  }

  /**
   * Obtener todos los tickets con filtros
   */
  async obtenerTickets(filtros?: FiltrosTickets) {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const query = params.toString();
    const response = await baseService.get<Ticket[]>(
      `/tickets${query ? `?${query}` : ""}`
    );
    const rawData = response.data as any;
    if (response.data) {
      response.data = (Array.isArray(rawData) ? rawData : rawData?.data || []).map(
        normalizarTicket
      );
    }
    return response;
  }

  /**
   * Obtener un ticket por ID
   */
  async obtenerTicketPorId(id: string) {
    const response = await baseService.get<Ticket>(`/tickets/${id}`);
    if (response.data) response.data = normalizarTicket(response.data);
    return response;
  }

  /**
   * Obtener un ticket por número
   */
  async obtenerTicketPorNumero(numeroTicket: string) {
    const response = await baseService.get<Ticket>(`/tickets/numero/${numeroTicket}`);
    if (response.data) response.data = normalizarTicket(response.data);
    return response;
  }

  /**
   * Agregar respuesta a un ticket
   */
  async agregarRespuesta(ticketId: string, respuesta: AgregarRespuestaDto) {
    const response = await baseService.put<Ticket>(
      `/tickets/${ticketId}/responder`,
      { mensaje: respuesta.mensaje }
    );
    if (response.data) response.data = normalizarTicket(response.data);
    return response;
  }

  /**
   * Actualizar estado del ticket
   */
  async actualizarEstado(
    ticketId: string,
    estado: TicketEstado
  ) {
    const response = await baseService.put<Ticket>(`/tickets/${ticketId}/estado`, {
      estado: estadoParaBackend(estado),
    });
    if (response.data) response.data = normalizarTicket(response.data);
    return response;
  }

  /**
   * Actualizar prioridad del ticket
   */
  async actualizarPrioridad(
    ticketId: string,
    prioridad: "baja" | "media" | "alta" | "urgente"
  ) {
    const response = await baseService.put<Ticket>(`/tickets/${ticketId}/prioridad`, {
      prioridad,
    });
    if (response.data) response.data = normalizarTicket(response.data);
    return response;
  }

  /**
   * Asignar ticket a un usuario
   */
  async asignarTicket(
    ticketId: string,
    asignadoA: string,
    asignadoNombre: string
  ) {
    const response = await baseService.put<Ticket>(`/tickets/${ticketId}/asignar`, {
      asignadoA,
      asignadoNombre,
    });
    if (response.data) response.data = normalizarTicket(response.data);
    return response;
  }

  /**
   * Eliminar un ticket
   */
  async eliminarTicket(ticketId: string) {
    return baseService.delete<void>(`/tickets/${ticketId}`);
  }

  /**
   * Obtener estadísticas de tickets
   */
  async obtenerEstadisticas(filtros?: {
    empresaId?: string;
    clienteId?: string;
  }) {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const query = params.toString();
    return baseService.get<EstadisticasTickets>(
      `/tickets/estadisticas${query ? `?${query}` : ""}`
    );
  }
}

export const ticketsService = new TicketsService();
