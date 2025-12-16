import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  User,
  X,
} from "lucide-react";
import {
  IconoConexion,
  NivelBateria,
  NivelSenal,
  EstadoDispositivo,
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

export function DispositivosActivosTabla({
  dispositivos,
  loading,
}: DispositivosTablaProps) {
  const { toast } = useToast();
  const [dispositivoSeleccionado, setDispositivoSeleccionado] =
    useState<string | null>(null);
  const [estadoServicio, setEstadoServicio] = useState<EstadoServicio | null>(
    null
  );
  const [cargandoEstado, setCargandoEstado] = useState(false);

  // Estado para consumo y costo en tiempo real (del modal)
  const [consumoTiempoReal, setConsumoTiempoReal] = useState<number | null>(null);
  const [costoTiempoReal, setCostoTiempoReal] = useState<number | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);

  // Estado para consumo y costo de todos los dispositivos (para las cards)
  const [datosDispositivos, setDatosDispositivos] = useState<Map<string, { consumo: number; costo: number }>>(new Map());

  // Cargar estado del servicio
  const cargarEstadoServicio = useCallback(async (clienteId: string) => {
    setCargandoEstado(true);
    try {
      const response = await servicioElectricoService.obtenerEstado(clienteId);
      if (response.success && response.data) {
        setEstadoServicio(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el estado del servicio",
        variant: "destructive",
      });
    } finally {
      setCargandoEstado(false);
    }
  }, [toast]);

  // Cargar consumo y costo
  const cargarConsumoYCosto = useCallback(async (dispositivoId: string) => {
    try {

      // Obtener datos del dispositivo desde la API usando el _id
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const url = `${apiUrl}/api/dispositivos/${dispositivoId}`;


      const response = await fetch(url);
      const data = await response.json();


      if (data.success && data.data?.ultimaLectura) {
        const { energia, costo } = data.data.ultimaLectura;
        setConsumoTiempoReal(energia || 0);
        setCostoTiempoReal(costo || 0);
        setUltimaActualizacion(new Date());
      }
    } catch (error) {
    }
  }, []);

  // Cargar datos de todos los dispositivos
  const cargarDatosTodosDispositivos = useCallback(async () => {
    try {

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const nuevosDatos = new Map<string, { consumo: number; costo: number }>();

      // Cargar datos de todos los dispositivos en paralelo
      const promesas = dispositivos.map(async (dispositivo) => {
        try {
          const response = await fetch(`${apiUrl}/api/dispositivos/${dispositivo.id}`);
          const data = await response.json();

          if (data.success && data.data?.ultimaLectura) {
            const { energia, costo } = data.data.ultimaLectura;
            nuevosDatos.set(dispositivo.id, {
              consumo: energia || 0,
              costo: costo || 0
            });
          }
        } catch (error) {
        }
      });

      await Promise.all(promesas);
      setDatosDispositivos(nuevosDatos);

    } catch (error) {
    }
  }, [dispositivos]);

  // Cargar estado del servicio cuando se selecciona un dispositivo
  useEffect(() => {
    if (dispositivoSeleccionado) {
      cargarEstadoServicio(dispositivoSeleccionado);
      cargarConsumoYCosto(dispositivoSeleccionado);
    }
  }, [dispositivoSeleccionado, cargarEstadoServicio, cargarConsumoYCosto]);

  // Actualizar consumo y costo del modal cada 1 minuto
  useEffect(() => {
    if (!dispositivoSeleccionado) return;


    const interval = setInterval(() => {
      cargarConsumoYCosto(dispositivoSeleccionado);
    }, 60000); // 60 segundos = 1 minuto

    return () => {
      clearInterval(interval);
    };
  }, [dispositivoSeleccionado, cargarConsumoYCosto]);

  // Cargar datos de todos los dispositivos al inicio y cada 1 minuto
  useEffect(() => {
    if (dispositivos.length === 0) return;


    // Cargar inmediatamente
    cargarDatosTodosDispositivos();

    // Actualizar cada 1 minuto
    const interval = setInterval(() => {
      cargarDatosTodosDispositivos();
    }, 60000); // 60 segundos = 1 minuto

    return () => {
      clearInterval(interval);
    };
  }, [dispositivos, cargarDatosTodosDispositivos]);

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
      {dispositivos.map((dispositivo, index) => (
        <Card
          key={dispositivo.id || `dispositivo-${index}`}
          onClick={() => abrirDetalles(dispositivo.id)}
          className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${dispositivo.estado === "alerta"
            ? "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10"
            : dispositivo.estado === "inactivo"
              ? "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/10"
              : "border-gray-200 dark:border-gray-700"
            }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <span>{dispositivo.id}</span>
                  <IconoConexion
                    tipo={dispositivo.tipoConexion}
                    senal={dispositivo.senal}
                  />
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {dispositivo.nombre}
                </p>
              </div>

              <BadgeEstado estado={dispositivo.estado} />
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-2">
              <MapPin className="h-4 w-4" />
              <span>{dispositivo.ubicacion}</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Estado del dispositivo */}
            <div className="space-y-3">
              <EstadoDispositivo estado={dispositivo.estado} />

              {/* Métricas principales */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Batería</div>
                  <NivelBateria valor={dispositivo.bateria} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Señal</div>
                  <NivelSenal
                    valor={dispositivo.senal || 0}
                    tipo={dispositivo.tipoConexion}
                  />
                </div>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Consumo</div>
                  <div className="font-medium text-blue-600">
                    {datosDispositivos.get(dispositivo.id)?.consumo?.toFixed(6) || '0.000000'} kWh
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Costo</div>
                  <div className="font-medium text-green-600">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(datosDispositivos.get(dispositivo.id)?.costo || 0)}
                  </div>
                </div>
              </div>

              {/* Temperatura si está disponible */}
              {dispositivo.temperaturaOperacion && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Temperatura</span>
                  <TemperaturaIndicador
                    valor={dispositivo.temperaturaOperacion}
                  />
                </div>
              )}

              {/* Ubicación detallada si está disponible */}
              {dispositivo.ubicacionDetallada && (
                <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                  <div className="font-medium mb-1">Ubicación detallada:</div>
                  <div>
                    {dispositivo.ubicacionDetallada.edificio}, Piso{" "}
                    {dispositivo.ubicacionDetallada.piso}
                  </div>
                  <div>{dispositivo.ubicacionDetallada.sala}</div>
                </div>
              )}

              {/* Última transmisión */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Última transmisión</span>
                </div>
                <span>{dispositivo.ultimaTransmision}</span>
              </div>

              {/* Indicador de click */}
              <div className="text-center text-xs text-muted-foreground pt-2 border-t border-gray-100 dark:border-gray-800">
                <Eye className="h-4 w-4 mx-auto mb-1" />
                Click para ver detalles
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Modal de Detalles del Dispositivo */}
      <Dialog open={!!dispositivoSeleccionado} onOpenChange={(open) => !open && cerrarDetalles()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-orange-600" />
                  Detalles del Dispositivo
                </DialogTitle>
                <DialogDescription>
                  {dispositivoSeleccionado && (
                    <>
                      Dispositivo: {dispositivos.find((d) => d.id === dispositivoSeleccionado)?.nombre}
                    </>
                  )}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={cerrarDetalles}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Información del Dispositivo */}
            {dispositivoSeleccionado && (() => {
              const dispositivo = dispositivos.find((d) => d.id === dispositivoSeleccionado);
              if (!dispositivo) return null;

              return (
                <>
                  {/* Información General */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-600" />
                        Información del Dispositivo
                        {ultimaActualizacion && (
                          <span className="text-xs text-muted-foreground font-normal ml-auto">
                            Actualizado: {ultimaActualizacion.toLocaleTimeString()}
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">ID</p>
                          <p className="font-medium">{dispositivo.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Nombre</p>
                          <p className="font-medium">{dispositivo.nombre}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ubicación</p>
                          <p className="font-medium flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {dispositivo.ubicacion}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Estado</p>
                          <BadgeEstado estado={dispositivo.estado} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Costo Acumulado</p>
                          <p className="font-medium text-green-600">
                            {new Intl.NumberFormat('es-CL', {
                              style: 'currency',
                              currency: 'CLP',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(costoTiempoReal !== null ? costoTiempoReal : 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Consumo Acumulado</p>
                          <p className="font-medium text-blue-600">
                            {consumoTiempoReal !== null ? consumoTiempoReal.toFixed(6) : '0.000000'} kWh
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Batería</p>
                          <NivelBateria valor={dispositivo.bateria} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Señal</p>
                          <NivelSenal valor={dispositivo.senal || 0} tipo={dispositivo.tipoConexion} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Control de Servicio Eléctrico */}
                  {cargandoEstado ? (
                    <LoadingState message="Cargando estado del servicio..." />
                  ) : estadoServicio ? (
                    <ControlServicioEmpresa
                      clienteId={dispositivoSeleccionado}
                      estadoServicio={estadoServicio}
                      onActualizar={() => cargarEstadoServicio(dispositivoSeleccionado)}
                    />
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No se pudo cargar la información del servicio
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
