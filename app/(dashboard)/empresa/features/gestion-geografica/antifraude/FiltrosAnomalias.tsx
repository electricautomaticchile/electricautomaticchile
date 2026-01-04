import { Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltrosAnomaliasProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
  filtroSeveridad: string;
  setFiltroSeveridad: (value: string) => void;
  filtroEstado: string;
  setFiltroEstado: (value: string) => void;
}

export function FiltrosAnomalias({
  busqueda,
  setBusqueda,
  filtroSeveridad,
  setFiltroSeveridad,
  filtroEstado,
  setFiltroEstado,
}: FiltrosAnomaliasProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por cliente, medidor o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg text-sm w-64"
        />
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filtroSeveridad} onValueChange={setFiltroSeveridad}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="critical">Críticas</SelectItem>
            <SelectItem value="high">Altas</SelectItem>
            <SelectItem value="medium">Medias</SelectItem>
            <SelectItem value="low">Bajas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select value={filtroEstado} onValueChange={setFiltroEstado}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="pending">Pendientes</SelectItem>
          <SelectItem value="investigating">Investigando</SelectItem>
          <SelectItem value="resolved">Resueltos</SelectItem>
          <SelectItem value="false_positive">Falsos Positivos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
