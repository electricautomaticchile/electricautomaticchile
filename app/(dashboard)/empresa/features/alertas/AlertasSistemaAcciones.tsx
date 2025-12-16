import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BellRing,
  Search,
  Bell,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { AlertasSistemaAccionesProps } from './types';
import { BadgeTiempoReal } from './AlertasSistemaIconos';

export function AlertasSistemaAcciones({
  isConnected,
  busqueda,
  onBusquedaChange,
  onSimularAlerta,
  onMarcarTodasLeidas,
  resumenAlertas,
  loading = false
}: AlertasSistemaAccionesProps) {

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* Título y descripción */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BellRing className="h-6 w-6 text-orange-600" />
          Centro de Alertas
          <BadgeTiempoReal conectado={isConnected} />
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Sistema de notificaciones y alertas en tiempo real
        </p>
      </div>

      {/* Controles y acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar alertas..."
            className="pl-9 w-full sm:w-64"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          {/* Simular alerta para demostración */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onSimularAlerta}
            disabled={loading}
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Simular Alerta</span>
            <span className="sm:hidden">Simular</span>
          </Button>

          {/* Marcar todas como leídas */}
          <Button
            className="flex items-center gap-2"
            onClick={onMarcarTodasLeidas}
            disabled={resumenAlertas.noLeidas === 0 || loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              Marcar todo como leído
            </span>
            <span className="sm:hidden">
              Marcar ({resumenAlertas.noLeidas})
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Componente adicional para métricas rápidas en el encabezado
export function MetricasRapidas({ resumen }: { resumen: any }) {
  const metricas = [
    {
      label: "Total",
      valor: resumen.total,
      color: "text-gray-600"
    },
    {
      label: "Críticas", 
      valor: resumen.errorCritico,
      color: "text-red-600"
    },
    {
      label: "No leídas",
      valor: resumen.noLeidas,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="flex items-center gap-4 text-sm">
      {metricas.map((metrica, index) => (
        <div key={index} className="flex items-center gap-1">
          <span className="text-gray-500">{metrica.label}:</span>
          <span className={`font-semibold ${metrica.color}`}>
            {metrica.valor}
          </span>
        </div>
      ))}
    </div>
  );
}
