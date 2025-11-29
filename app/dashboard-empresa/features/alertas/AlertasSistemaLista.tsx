import { Button } from "@/components/ui/button";
import { LoadingState, EmptyState } from "@/components/shared";
import {
  BellRing,
  ChevronDown,
  ChevronUp,
  Eye,
  MapPin,
  Battery,
  Calendar,
  Clock,
  User,
  UserPlus,
  CheckCircle2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { AlertasSistemaListaProps } from './types';
import { COLORES_ALERTA } from './config';
import { 
  IconoAlerta, 
  BadgeTipo, 
  IndicadorEstado, 
  BadgeImportante 
} from './AlertasSistemaIconos';

export function AlertasSistemaLista({
  alertas,
  alertaExpandida,
  loading = false,
  onToggleAlerta,
  onAsignarAlerta,
  onResolverAlerta,
  onMarcarComoVista,
  onEliminarAlerta,
  busqueda
}: AlertasSistemaListaProps) {

  if (loading) {
    return <LoadingState message="Cargando alertas..." />;
  }

  if (alertas.length === 0) {
    return (
      <EmptyState
        icon={BellRing}
        title="No hay alertas que mostrar"
        description={
          busqueda
            ? "No se encontraron alertas que coincidan con la búsqueda."
            : "No hay alertas activas en este momento."
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {alertas.map((alerta) => (
        <AlertaItem
          key={alerta.id}
          alerta={alerta}
          expandida={alertaExpandida === alerta.id}
          onToggle={() => onToggleAlerta(alerta.id)}
          onAsignar={() => onAsignarAlerta(alerta.id)}
          onResolver={() => onResolverAlerta(alerta.id)}
          onMarcarVista={() => onMarcarComoVista(alerta.id)}
          onEliminar={() => onEliminarAlerta(alerta.id)}
        />
      ))}
    </div>
  );
}

// Componente individual para cada alerta
function AlertaItem({
  alerta,
  expandida,
  onToggle,
  onAsignar,
  onResolver,
  onMarcarVista,
  onEliminar
}: {
  alerta: any;
  expandida: boolean;
  onToggle: () => void;
  onAsignar: () => void;
  onResolver: () => void;
  onMarcarVista: () => void;
  onEliminar: () => void;
}) {
  const colores = COLORES_ALERTA[alerta.tipo as keyof typeof COLORES_ALERTA];
  
  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all ${
        colores?.border || "border-gray-200 dark:border-gray-700"
      } ${!alerta.leida ? "ring-2 ring-orange-200 dark:ring-orange-800" : ""}`}
    >
      {/* Encabezado de la alerta */}
      <div
        className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${
          colores?.bg || "bg-gray-50 dark:bg-gray-900/10"
        }`}
        onClick={onToggle}
      >
        <div className="flex items-start">
          {/* Icono de tipo */}
          <div className="flex-shrink-0 mr-3">
            <IconoAlerta tipo={alerta.tipo} />
          </div>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                {alerta.mensaje}
                <IndicadorEstado leida={alerta.leida} />
              </h3>
              <div className="flex items-center gap-2">
                <BadgeTipo tipo={alerta.tipo} />
                <BadgeImportante importante={alerta.importante} />
              </div>
            </div>

            {/* Metadatos de la alerta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              {alerta.dispositivo && (
                <div className="flex items-center gap-1">
                  <Battery className="h-3.5 w-3.5" />
                  <span>ID: {alerta.dispositivo}</span>
                </div>
              )}
              {alerta.ubicacion && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{alerta.ubicacion}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{alerta.fecha}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{alerta.hora}</span>
              </div>
            </div>
          </div>

          {/* Indicador de expansión */}
          <div className="ml-3">
            {expandida ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {/* Contenido expandido */}
      {expandida && (
        <div className="p-4 bg-muted/30 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            {/* Detalles de la alerta */}
            <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <h4 className="text-sm font-medium mb-2">
                Detalles de la Alerta
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Esta alerta fue generada automáticamente por el sistema de 
                monitoreo. Se recomienda revisar el dispositivo asociado y 
                verificar su estado operacional.
              </p>
              
              {/* Información adicional específica por tipo */}
              {alerta.tipo === "error" && (
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Acción Requerida</span>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Esta alerta crítica requiere atención inmediata. 
                    Contacte al equipo técnico si el problema persiste.
                  </p>
                </div>
              )}
            </div>

            {/* Estado y acciones */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Estado: {alerta.leida ? "Leída" : "No leída"}
                </span>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                {!alerta.leida && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAsignar}
                      className="flex items-center gap-1"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="hidden sm:inline">Asignar</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onMarcarVista}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Marcar vista</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={onResolver}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Resolver</span>
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEliminar}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Eliminar</span>
                </Button>
              </div>
            </div>

            {/* Línea de tiempo (simulada) */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <h5 className="text-sm font-medium mb-2">Línea de Tiempo</h5>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span>Alerta generada - {alerta.fecha} a las {alerta.hora}</span>
                </div>
                {alerta.leida && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Marcada como leída</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
