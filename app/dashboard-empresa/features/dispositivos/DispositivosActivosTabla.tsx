import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreVertical,
  MapPin,
  Clock,
  Zap,
  Settings,
  Download,
  Power,
  RotateCw,
  RefreshCcw,
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
import { ACCIONES_DISPOSITIVO } from "./config";

export function DispositivosActivosTabla({
  dispositivos,
  loading,
  onControl,
}: DispositivosTablaProps) {
  const [controlando, setControlando] = useState<string | null>(null);

  const handleControl = async (dispositivoId: string, accion: string) => {
    setControlando(dispositivoId);
    await onControl(dispositivoId, accion);
    setTimeout(() => setControlando(null), 1000);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (dispositivos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Zap className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No hay dispositivos
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron dispositivos con los filtros aplicados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dispositivos.map((dispositivo) => (
        <Card
          key={dispositivo.id}
          className={`transition-all duration-200 hover:shadow-lg ${
            dispositivo.estado === "alerta"
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

              <div className="flex items-center gap-2">
                <BadgeEstado estado={dispositivo.estado} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={controlando === dispositivo.id}
                      className="h-8 w-8 p-0"
                    >
                      {controlando === dispositivo.id ? (
                        <LoadingSpinner />
                      ) : (
                        <MoreVertical className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar datos
                    </DropdownMenuItem>
                    <hr className="my-1" />
                    {ACCIONES_DISPOSITIVO.map((accion) => (
                      <DropdownMenuItem
                        key={accion.value}
                        onClick={() =>
                          handleControl(dispositivo.id, accion.value)
                        }
                        className={`${
                          accion.color === "red"
                            ? "text-red-600 dark:text-red-400"
                            : ""
                        }`}
                      >
                        {accion.value === "restart" && (
                          <RotateCw className="h-4 w-4 mr-2" />
                        )}
                        {accion.value === "shutdown" && (
                          <Power className="h-4 w-4 mr-2" />
                        )}
                        {accion.value === "reset" && (
                          <RefreshCcw className="h-4 w-4 mr-2" />
                        )}
                        {accion.value === "update_firmware" && (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        {accion.value === "sync_time" && (
                          <Clock className="h-4 w-4 mr-2" />
                        )}
                        {accion.value === "calibrate" && (
                          <Settings className="h-4 w-4 mr-2" />
                        )}
                        {accion.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
                  <div className="font-medium text-purple-600">
                    {dispositivo.consumoActual} kWh
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Firmware</div>
                  <div className="font-medium text-blue-600">
                    {dispositivo.firmware}
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
            </div>

            {/* Acciones rápidas */}
            <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleControl(dispositivo.id, "restart")}
                disabled={
                  controlando === dispositivo.id ||
                  dispositivo.estado === "inactivo"
                }
                className="flex-1 text-xs"
              >
                <RotateCw className="h-3 w-3 mr-1" />
                Reiniciar
              </Button>

              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Detalles
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
