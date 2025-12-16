import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EstadisticasTickets } from "@/lib/api/ticketsService";

interface TicketEstadisticasProps {
  estadisticas: EstadisticasTickets;
}

export function TicketEstadisticas({ estadisticas }: TicketEstadisticasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{estadisticas.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Abiertos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            {estadisticas.porEstado.abiertos}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            En Proceso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600">
            {estadisticas.porEstado.enProceso}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Resueltos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {estadisticas.porEstado.resueltos}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
