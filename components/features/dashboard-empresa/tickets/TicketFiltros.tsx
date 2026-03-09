import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Búsqueda */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <Input
          placeholder="Buscar por ticket, cliente..."
          value={filtros.busqueda}
          onChange={(e) => onFiltrosChange({ ...filtros, busqueda: e.target.value })}
          className="pl-10 bg-white/5 border-white/10 focus:border-orange-500/50 text-sm"
        />
      </div>

      {/* Categoría */}
      <Select
        value={filtros.categoria || "todas"}
        onValueChange={(v) => onFiltrosChange({ ...filtros, categoria: v === "todas" ? "" : v })}
      >
        <SelectTrigger className="w-full sm:w-36 bg-white/5 border-white/10 text-sm">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent className="bg-[#0a0a0a] border-white/10">
          <SelectItem value="todas">Todas</SelectItem>
          <SelectItem value="tecnico">Técnico</SelectItem>
          <SelectItem value="facturacion">Facturación</SelectItem>
          <SelectItem value="consulta">Consulta</SelectItem>
          <SelectItem value="reclamo">Reclamo</SelectItem>
        </SelectContent>
      </Select>

      {/* Prioridad */}
      <Select
        value={filtros.prioridad || "todas"}
        onValueChange={(v) => onFiltrosChange({ ...filtros, prioridad: v === "todas" ? "" : v })}
      >
        <SelectTrigger className="w-full sm:w-36 bg-white/5 border-white/10 text-sm">
          <SelectValue placeholder="Prioridad" />
        </SelectTrigger>
        <SelectContent className="bg-[#0a0a0a] border-white/10">
          <SelectItem value="todas">Todas</SelectItem>
          <SelectItem value="baja">Baja</SelectItem>
          <SelectItem value="media">Media</SelectItem>
          <SelectItem value="alta">Alta</SelectItem>
          <SelectItem value="urgente">Urgente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
