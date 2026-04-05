import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { LoadingState, EmptyState } from "@/components/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  MapPin,
  Clock,
  Zap,
  UserPlus,
  Thermometer,
} from "lucide-react";
import {
  IconoConexion,
  TemperaturaIndicador,
  BadgeEstado,
} from "./DispositivosActivosIconos";
import { DispositivosTablaProps } from "./types";
import { ControlServicioEmpresa } from "@/components/features/dashboard-empresa/control-servicio-empresa";
import {
  servicioElectricoService,
  EstadoServicio,
} from "@/lib/api/servicioElectricoService";
import { useToast } from "@/components/ui/use-toast";
import { AsignarDispositivoModal } from "@/components/features/dashboard-empresa/AsignarDispositivoModal";
import { useDispositivoDetalle, useDispositivosDetalles } from "@/hooks/queries/useDispositivoDetalle";

export function DispositivosActivosTabla({
  dispositivos,
  loading,
  onRefresh,
}: DispositivosTablaProps) {
  const { toast } = useToast();
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState<string | null>(null);
  const [estadoServicio, setEstadoServicio] = useState<EstadoServicio | null>(null);
  const [cargandoEstado, setCargandoEstado] = useState(false);
  const [modalAsignarOpen, setModalAsignarOpen] = useState(false);
  const [dispositivoAsignar, setDispositivoAsignar] = useState<any>(null);

  const dispositivoIds = dispositivos.map(d => d.id);
  const { data: datosDispositivos } = useDispositivosDetalles(dispositivoIds);
  const { data: dispositivoDetalle } = useDispositivoDetalle(dispositivoSeleccionado);

  const consumoTiempoReal = dispositivoDetalle?.ultimaLectura?.energy || 0;
  const costoTiempoReal = dispositivoDetalle?.ultimaLectura?.cost || 0;

  // Memoizar el dispositivo seleccionado para evitar re-renders del modal
  const dispositivoModal = useMemo(() => {
    if (!dispositivoSeleccionado) return null;
    return dispositivos.find(d => d.id === dispositivoSeleccionado) || null;
  }, [dispositivoSeleccionado, dispositivos]);

  // Guardar clienteId en ref para no re-ejecutar el efecto con cada WS update
  const clienteIdRef = useRef<string | null>(null);

  const cargarEstadoServicio = useCallback(async (clienteId: string) => {
    setCargandoEstado(true);
    try {
      const response = await servicioElectricoService.obtenerEstado(clienteId);
      if (response.success && response.data) {
        setEstadoServicio(response.data);
      }
    } catch {
      toast({ title: "Error", description: "No se pudo cargar el estado del servicio", variant: "destructive" });
    } finally {
      setCargandoEstado(false);
    }
  }, [toast]);

  useEffect(() => {
    if (dispositivoSeleccionado) {
      const dispositivo = dispositivos.find(d => d.id === dispositivoSeleccionado);
      const clienteId = dispositivo?.cliente?.id || null;
      // Solo cargar estado si cambió el dispositivo seleccionado
      if (clienteId && clienteId !== clienteIdRef.current) {
        clienteIdRef.current = clienteId;
        cargarEstadoServicio(clienteId);
      }
    } else {
      clienteIdRef.current = null;
    }
  }, [dispositivoSeleccionado, cargarEstadoServicio]); // Sin 'dispositivos' en deps

  const abrirDetalles = (dispositivoId: string) => {
    setDispositivoSeleccionado(dispositivoId);
  };

  const cerrarDetalles = () => {
    setDispositivoSeleccionado(null);
    setEstadoServicio(null);
  };

  if (loading) {
    return <LoadingState message="Cargando dispositivos..." />;
  }

  if (dispositivos.length === 0) {
    return (
      <EmptyState
        icon={Zap}
        title="No hay dispositivos"
        description="No se encontraron dispositivos con los filtros aplicados."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dispositivos.map((dispositivo, index) => {
        const consumo = datosDispositivos?.get(dispositivo.id)?.consumo;
        const costo = datosDispositivos?.get(dispositivo.id)?.costo || 0;
        const isAlerta = dispositivo.estado === "alerta";
        const isInactivo = dispositivo.estado === "inactivo";

        return (
          <div
            key={dispositivo.id || `dispositivo-${index}`}
            onClick={() => abrirDetalles(dispositivo.id)}
            className={`
              group relative rounded-xl border cursor-pointer
              bg-[#0a0a0a] transition-all duration-200
              hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]
              hover:-translate-y-0.5
              ${isAlerta
                ? "border-red-500/50 hover:border-red-500"
                : isInactivo
                  ? "border-white/10 hover:border-white/20"
                  : "border-orange-500/30 hover:border-orange-500/60"
              }
            `}
          >
            {/* Franja superior de color según estado */}
            <div className={`h-1 w-full rounded-t-xl ${
              isAlerta ? "bg-red-500" :
              isInactivo ? "bg-white/20" :
              dispositivo.estado === "mantenimiento" ? "bg-amber-500" :
              "bg-orange-500"
            }`} />

            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Zap className={`h-4 w-4 shrink-0 ${isInactivo ? "text-white/30" : "text-orange-500"}`} />
                    <p className="font-semibold text-sm text-white truncate">
                      {dispositivo.cliente?.nombre || dispositivo.nombre}
                    </p>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5 ml-6">
                    #{dispositivo.numeroDispositivo}
                  </p>
                </div>
                <BadgeEstado estado={dispositivo.estado} />
              </div>

              {/* Ubicación */}
              <div className="flex items-center gap-1.5 text-xs text-white/50">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{dispositivo.cliente?.direccion || dispositivo.ubicacion}</span>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Consumo</p>
                  <p className="text-sm font-bold text-orange-400">
                    {consumo != null ? consumo.toFixed(4) : "—"}
                    <span className="text-[10px] font-normal text-white/40 ml-1">kWh</span>
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Costo</p>
                  <p className="text-sm font-bold text-white">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                      minimumFractionDigits: 0,
                    }).format(costo)}
                  </p>
                </div>
              </div>

              {/* Fila inferior: conexión, temperatura, última transmisión */}
              <div className="flex items-center justify-between text-xs text-white/40 pt-1 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <IconoConexion tipo={dispositivo.tipoConexion} senal={dispositivo.senal} />
                  {dispositivo.temperaturaOperacion && (
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      <TemperaturaIndicador valor={dispositivo.temperaturaOperacion} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{dispositivo.ultimaTransmision}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-1">
                {!dispositivo.cliente && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDispositivoAsignar(dispositivo);
                      setModalAsignarOpen(true);
                    }}
                  >
                    <UserPlus className="h-3.5 w-3.5 mr-1" />
                    Asignar
                  </Button>
                )}
                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500"
                  onClick={(e) => { e.stopPropagation(); abrirDetalles(dispositivo.id); }}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Ver detalles
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      <AsignarDispositivoModal
        open={modalAsignarOpen}
        onOpenChange={setModalAsignarOpen}
        dispositivo={dispositivoAsignar}
        onSuccess={() => {
          toast({
            title: "Éxito",
            description: "Dispositivo asignado correctamente",
          });
          if (onRefresh) {
            onRefresh();
          }
        }}
      />

      {/* Modal de Detalles del Dispositivo */}
      <Dialog open={!!dispositivoSeleccionado} onOpenChange={(open) => !open && cerrarDetalles()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-orange-500/30 p-0">
          {dispositivoModal && (() => {
            const dispositivo = dispositivoModal;

            return (
              <>
                {/* Header del modal */}
                <div className="relative border-b border-orange-500/20 p-6">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500 rounded-t-lg" />
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <DialogTitle className="text-lg font-bold text-white">
                          {dispositivo.cliente?.nombre || dispositivo.nombre}
                        </DialogTitle>
                        <DialogDescription className="text-white/40 text-xs mt-0.5">
                          #{dispositivo.numeroDispositivo} · {dispositivo.tipoConexion}
                        </DialogDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BadgeEstado estado={dispositivo.estado} />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Info general */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Ubicación</p>
                      <div className="flex items-center gap-1.5 text-sm text-white">
                        <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        <span className="truncate">{dispositivo.cliente?.direccion || dispositivo.ubicacion}</span>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Última transmisión</p>
                      <div className="flex items-center gap-1.5 text-sm text-white">
                        <Clock className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        <span>{dispositivo.ultimaTransmision}</span>
                      </div>
                    </div>
                    {dispositivo.firmware && (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Firmware</p>
                        <p className="text-sm text-white">{dispositivo.firmware}</p>
                      </div>
                    )}
                    {dispositivo.temperaturaOperacion && (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Temperatura</p>
                        <TemperaturaIndicador valor={dispositivo.temperaturaOperacion} />
                      </div>
                    )}
                  </div>

                  {/* Consumo en tiempo real */}
                  <div className="border border-orange-500/20 rounded-xl overflow-hidden">
                    <div className="bg-orange-500/10 px-4 py-2.5 border-b border-orange-500/20 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-semibold text-white">Consumo en Tiempo Real</span>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-white/10">
                      <div className="p-5">
                        <p className="text-[10px] text-white/40 uppercase tracking-wide mb-2">Energía consumida</p>
                        <p className="text-3xl font-black text-orange-400">
                          {consumoTiempoReal !== null ? consumoTiempoReal.toFixed(3) : '0.000'}
                        </p>
                        <p className="text-xs text-white/40 mt-1">kWh</p>
                      </div>
                      <div className="p-5">
                        <p className="text-[10px] text-white/40 uppercase tracking-wide mb-2">Costo acumulado</p>
                        <p className="text-3xl font-black text-white">
                          {new Intl.NumberFormat('es-CL', {
                            style: 'currency',
                            currency: 'CLP',
                            minimumFractionDigits: 0,
                          }).format(costoTiempoReal ?? 0)}
                        </p>
                        <p className="text-xs text-white/40 mt-1">CLP</p>
                      </div>
                    </div>
                  </div>

                  {/* Control de servicio */}
                  {cargandoEstado ? (
                    <LoadingState message="Cargando estado del servicio..." />
                  ) : dispositivo.cliente ? (
                    estadoServicio ? (
                      <ControlServicioEmpresa
                        clienteId={dispositivo.cliente.id}
                        estadoServicio={estadoServicio}
                        onActualizar={() => cargarEstadoServicio(dispositivo.cliente!.id)}
                      />
                    ) : null
                  ) : (
                    <div className="border border-white/10 rounded-xl p-4 text-center">
                      <p className="text-sm text-white/40">Sin cliente asignado — asigna un cliente para gestionar el servicio</p>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
