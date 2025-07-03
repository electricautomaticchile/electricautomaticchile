import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { AlertasSistemaFiltrosProps } from './types';
import { CONFIGURACION_FILTROS } from './config';

export function AlertasSistemaFiltros({
  filtroTipo,
  filtroEstado,
  onFiltroTipoChange,
  onFiltroEstadoChange,
  resumenAlertas
}: AlertasSistemaFiltrosProps) {

  return (
    <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
      {/* Etiqueta de filtros */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filtros:
        </span>
      </div>

      {/* Filtros por tipo */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 self-center mr-2">Tipo:</span>
        {CONFIGURACION_FILTROS.tipos.map((tipo) => (
          <Button
            key={tipo.value}
            variant={filtroTipo === tipo.value ? 
              (tipo.variant as "default" | "destructive" | "outline") : "outline"
            }
            size="sm"
            onClick={() => onFiltroTipoChange(tipo.value)}
            className={filtroTipo === tipo.value && tipo.className ? tipo.className : ""}
          >
            {tipo.label}
          </Button>
        ))}
      </div>

      {/* Separador visual */}
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

      {/* Filtros por estado */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 self-center mr-2">Estado:</span>
        {CONFIGURACION_FILTROS.estados.map((estado) => (
          <Button
            key={estado.value}
            variant={filtroEstado === estado.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFiltroEstadoChange(estado.value)}
          >
            {estado.label}
            {estado.showCount && estado.value === "no_leidas" && (
              <span className="ml-1">
                ({resumenAlertas.noLeidas})
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}

// Componente simplificado para versión móvil
export function FiltrosMovil({
  filtroTipo,
  filtroEstado,
  onFiltroTipoChange,
  onFiltroEstadoChange,
  resumenAlertas
}: AlertasSistemaFiltrosProps) {

  return (
    <div className="space-y-3 mb-6 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
      {/* Filtros por tipo - versión compacta */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo de alerta:
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CONFIGURACION_FILTROS.tipos.slice(0, 4).map((tipo) => (
            <Button
              key={tipo.value}
              variant={filtroTipo === tipo.value ? 
                (tipo.variant as "default" | "destructive" | "outline") : "outline"
              }
              size="sm"
              onClick={() => onFiltroTipoChange(tipo.value)}
              className={`${filtroTipo === tipo.value && tipo.className ? tipo.className : ""} text-xs`}
            >
              {tipo.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Filtros por estado - versión compacta */}
      <div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
          Estado:
        </span>
        <div className="grid grid-cols-3 gap-2">
          {CONFIGURACION_FILTROS.estados.map((estado) => (
            <Button
              key={estado.value}
              variant={filtroEstado === estado.value ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltroEstadoChange(estado.value)}
              className="text-xs"
            >
              {estado.label}
              {estado.showCount && estado.value === "no_leidas" && (
                <span className="ml-1">
                  ({resumenAlertas.noLeidas})
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar filtros activos como chips
export function FiltrosActivos({
  filtroTipo,
  filtroEstado,
  onLimpiarFiltros
}: {
  filtroTipo: string;
  filtroEstado: string;
  onLimpiarFiltros: () => void;
}) {
  const hayFiltrosActivos = filtroTipo !== "todos" || filtroEstado !== "todos";
  
  if (!hayFiltrosActivos) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-gray-500">Filtros activos:</span>
      <div className="flex gap-2">
        {filtroTipo !== "todos" && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Tipo: {filtroTipo}
          </span>
        )}
        {filtroEstado !== "todos" && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Estado: {filtroEstado}
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLimpiarFiltros}
          className="h-6 px-2 text-xs"
        >
          Limpiar
        </Button>
      </div>
    </div>
  );
}
