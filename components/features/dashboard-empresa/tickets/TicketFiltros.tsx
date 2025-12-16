import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface TicketFiltrosProps {
  filtros: {
    estado: string;
    categoria: string;
    prioridad: string;
    busqueda: string;
  };
  onFiltrosChange: (filtros: any) => void;
}

export function TicketFiltros({ filtros, onFiltrosChange }: TicketFiltrosProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="busqueda">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="busqueda"
                placeholder="Ticket, cliente..."
                value={filtros.busqueda}
                onChange={(e) =>
                  onFiltrosChange({ ...filtros, busqueda: e.target.value })
                }
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={filtros.estado || "todos"}
              onValueChange={(value) =>
                onFiltrosChange({
                  ...filtros,
                  estado: value === "todos" ? "" : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="abierto">Abierto</SelectItem>
                <SelectItem value="en-proceso">En Proceso</SelectItem>
                <SelectItem value="resuelto">Resuelto</SelectItem>
                <SelectItem value="cerrado">Cerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <Select
              value={filtros.categoria || "todas"}
              onValueChange={(value) =>
                onFiltrosChange({
                  ...filtros,
                  categoria: value === "todas" ? "" : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="facturacion">Facturación</SelectItem>
                <SelectItem value="consulta">Consulta</SelectItem>
                <SelectItem value="reclamo">Reclamo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="prioridad">Prioridad</Label>
            <Select
              value={filtros.prioridad || "todas"}
              onValueChange={(value) =>
                onFiltrosChange({
                  ...filtros,
                  prioridad: value === "todas" ? "" : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
