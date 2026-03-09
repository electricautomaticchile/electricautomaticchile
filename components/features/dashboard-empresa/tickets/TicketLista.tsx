import { Badge } from "@/components/ui/badge";
import { Ticket } from "@/lib/api/ticketsService";
import { formatoEstado, formatoPrioridad, formatoCategoria } from "./ticket-utils";
import { MessageSquare, Clock, User } from "lucide-react";

interface TicketListaProps {
  tickets: Ticket[];
  onSeleccionar: (ticket: Ticket) => void;
}

export function TicketLista({ tickets, onSeleccionar }: TicketListaProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets.map((ticket) => {
        const estado = formatoEstado(ticket.estado);
        const prioridad = formatoPrioridad(ticket.prioridad);
        const Icon = estado.icon;
        const isUrgente = ticket.prioridad === "urgente";
        const isAbierto = ticket.estado === "abierto";

        return (
          <div
            key={ticket._id}
            onClick={() => onSeleccionar(ticket)}
            className={`
              relative rounded-xl border bg-[#0a0a0a] cursor-pointer
              transition-all duration-200
              hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] hover:-translate-y-0.5
              ${isUrgente ? "border-red-500/40 hover:border-red-500/70" : isAbierto ? "border-orange-500/30 hover:border-orange-500/60" : "border-white/10 hover:border-white/20"}
            `}
          >
            {/* Franja top según prioridad */}
            <div className={`h-1 w-full rounded-t-xl ${
              isUrgente ? "bg-red-500" :
              ticket.prioridad === "alta" ? "bg-orange-500" :
              ticket.prioridad === "media" ? "bg-amber-500" :
              "bg-white/20"
            }`} />

            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-white/30 font-mono">#{ticket.numeroTicket}</span>
                    <Badge className={`text-xs px-2 py-0.5 ${prioridad.color}`}>
                      {prioridad.label}
                    </Badge>
                  </div>
                  <p className="font-bold text-base text-white truncate">{ticket.asunto}</p>
                </div>
                <Badge className={`text-xs shrink-0 flex items-center gap-1 px-2 py-1 ${estado.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {estado.label}
                </Badge>
              </div>

              {/* Descripción */}
              <p className="text-sm text-white/50 line-clamp-2">{ticket.descripcion}</p>

              {/* Meta */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <User className="h-4 w-4 shrink-0 text-orange-500/60" />
                  <span className="truncate">{ticket.nombreCliente} · {ticket.numeroCliente}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-white/40">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    <span>{ticket.respuestas.length} respuestas</span>
                    {ticket.numeroDispositivo && (
                      <span className="text-orange-500/60">· {ticket.numeroDispositivo}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(ticket.fechaCreacion).toLocaleDateString("es-CL")}</span>
                  </div>
                </div>
              </div>

              {/* Categoría */}
              <div className="pt-3 border-t border-white/5">
                <span className="text-xs text-white/30 uppercase tracking-wide">
                  {formatoCategoria(ticket.categoria)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
