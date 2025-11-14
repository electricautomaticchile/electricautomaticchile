import { baseService } from "./utils/baseService";

export interface Ticket {
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
  estado: "abierto" | "en-proceso" | "resuelto" | "cerrado";
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

class TicketsService {
  /**
   * Crear un nuevo ticket
   */
  async crearTicket(data: CrearTicketDto) {
    return baseService.post<Ticket>("/tickets", data);
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
    return baseService.get<{
      data: Ticket[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/tickets${query ? `?${query}` : ""}`);
  }

  /**
   * Obtener un ticket por ID
   */
  async obtenerTicketPorId(id: string) {
    return baseService.get<Ticket>(`/tickets/${id}`);
  }

  /**
   * Obtener un ticket por número
   */
  async obtenerTicketPorNumero(numeroTicket: string) {
    return baseService.get<Ticket>(`/tickets/numero/${numeroTicket}`);
  }

  /**
   * Agregar respuesta a un ticket
   */
  async agregarRespuesta(ticketId: string, respuesta: AgregarRespuestaDto) {
    return baseService.post<Ticket>(
      `/tickets/${ticketId}/respuestas`,
      respuesta
    );
  }

  /**
   * Actualizar estado del ticket
   */
  async actualizarEstado(
    ticketId: string,
    estado: "abierto" | "en-proceso" | "resuelto" | "cerrado"
  ) {
    return baseService.put<Ticket>(`/tickets/${ticketId}/estado`, { estado });
  }

  /**
   * Actualizar prioridad del ticket
   */
  async actualizarPrioridad(
    ticketId: string,
    prioridad: "baja" | "media" | "alta" | "urgente"
  ) {
    return baseService.put<Ticket>(`/tickets/${ticketId}/prioridad`, {
      prioridad,
    });
  }

  /**
   * Asignar ticket a un usuario
   */
  async asignarTicket(
    ticketId: string,
    asignadoA: string,
    asignadoNombre: string
  ) {
    return baseService.put<Ticket>(`/tickets/${ticketId}/asignar`, {
      asignadoA,
      asignadoNombre,
    });
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
