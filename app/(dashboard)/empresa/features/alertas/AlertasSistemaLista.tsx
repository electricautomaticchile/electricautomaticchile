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
  UserPlus,
  CheckCircle2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { AlertasSistemaListaProps } from './types';
import { 
  IconoAlerta, 
  BadgeTipo, 
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
    <div className="space-y-3">
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
  const isError = alerta.tipo === "error";
  const isAdvertencia = alerta.tipo === "advertencia";
  const isExito = alerta.tipo === "exito";

  return (
    <div className={`
      relative rounded-xl border bg-[#0a0a0a] overflow-hidden
      transition-all duration-200
      ${isError ? "border-red-500/40" : isAdvertencia ? "border-amber-500/20" : isExito ? "border-white/10" : "border-orange-500/20"}
      ${!alerta.leida ? "ring-1 ring-orange-500/20" : ""}
    `}>
      {/* Franja top */}
      <div className={`h-1 w-full
        ${isError ? "bg-red-500" : isAdvertencia ? "bg-amber-500" : isExito ? "bg-white/20" : "bg-orange-500"}
      `} />

      {/* Header clickeable */}
      <div className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={onToggle}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
            ${isError ? "bg-red-500/10 text-red-400" : isAdvertencia ? "bg-amber-500/10 text-amber-400" : isExito ? "bg-white/5 text-white/40" : "bg-orange-500/10 text-orange-500"}
          `}>
            <IconoAlerta tipo={alerta.tipo} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <BadgeTipo tipo={alerta.tipo} />
                  <BadgeImportante importante={alerta.importante} />
                  {!alerta.leida && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                  )}
                </div>
                <p className="font-bold text-lg text-white">{alerta.mensaje}</p>
              </div>
              <div className="shrink-0 text-white/30">
                {expandida ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-white/40">
              {alerta.dispositivo && (
                <div className="flex items-center gap-1.5">
                  <Battery className="h-4 w-4" />
                  <span>{alerta.dispositivo}</span>
                </div>
              )}
              {alerta.ubicacion && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{alerta.ubicacion}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{alerta.fecha}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{alerta.hora}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido expandido */}
      {expandida && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-1">Detalles</p>
            <p className="text-sm text-white/50">
              Alerta generada automáticamente por el sistema de monitoreo. Se recomienda revisar el dispositivo asociado y verificar su estado operacional.
            </p>
            {isError && (
              <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Requiere atención inmediata. Contacte al equipo técnico si persiste.</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-white/30">
              Estado: <span className={alerta.leida ? "text-white/50" : "text-orange-400"}>
                {alerta.leida ? "Leída" : "Sin leer"}
              </span>
            </span>
            <div className="flex gap-2">
              {!alerta.leida && (
                <>
                  <Button size="sm" variant="outline" onClick={onAsignar}
                    className="h-8 text-xs gap-1.5 border-white/10 text-white/60 hover:bg-white/10">
                    <UserPlus className="h-3.5 w-3.5" />Asignar
                  </Button>
                  <Button size="sm" variant="outline" onClick={onMarcarVista}
                    className="h-8 text-xs gap-1.5 border-white/10 text-white/60 hover:bg-white/10">
                    <Eye className="h-3.5 w-3.5" />Marcar vista
                  </Button>
                  <Button size="sm" onClick={onResolver}
                    className="h-8 text-xs gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />Resolver
                  </Button>
                </>
              )}
              <Button size="sm" variant="outline" onClick={onEliminar}
                className="h-8 text-xs gap-1.5 border-red-500/20 text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-3.5 w-3.5" />Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
