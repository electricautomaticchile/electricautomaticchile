import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "@/lib/api/ticketsService";
import { formatoEstado, formatoPrioridad, formatoCategoria } from "./ticket-utils";

interface TicketListaProps {
  tickets: Ticket[];
  onSeleccionar: (ticket: Ticket) => void;
}

export function TicketLista({ tickets, onSeleccionar }: TicketListaProps) {
  return (
    <>
      {tickets.map((ticket) => {
        const estado = formatoEstado(ticket.estado);
        const Icon = estado.icon;

        return (
          <Card
            key={ticket._id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSeleccionar(ticket)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      #{ticket.numeroTicket}
                    </Badge>
                    <Badge className={formatoPrioridad(ticket.prioridad).color}>
                      {formatoPrioridad(ticket.prioridad).label}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{ticket.asunto}</CardTitle>
                  <CardDescription>
                    {ticket.nombreCliente} ({ticket.numeroCliente}) •{" "}
                    {new Date(ticket.fechaCreacion).toLocaleDateString("es-CL")}
                  </CardDescription>
                </div>
                <Badge className={estado.color}>
                  <Icon className="h-3 w-3 mr-1" />
                  {estado.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ticket.descripcion}
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>{formatoCategoria(ticket.categoria)}</span>
                <span>•</span>
                <span>{ticket.respuestas.length} respuestas</span>
                {ticket.numeroDispositivo && (
                  <>
                    <span>•</span>
                    <span>🔧 {ticket.numeroDispositivo}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
