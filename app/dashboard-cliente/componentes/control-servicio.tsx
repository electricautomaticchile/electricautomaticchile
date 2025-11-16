"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Power,
  PowerOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  Clock,
} from "lucide-react";
import { useApi } from "@/lib/hooks/useApi";
import {
  servicioElectricoService,
  EstadoServicio,
} from "@/lib/api/servicioElectricoService";
import { useToast } from "@/components/ui/use-toast";

export function ControlServicio() {
  const { user } = useApi();
  const { toast } = useToast();

  const [estadoServicio, setEstadoServicio] = useState<EstadoServicio | null>(
    null
  );
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);

  const clienteId = (user as any)?._id?.toString() || user?.id?.toString();

  useEffect(() => {
    if (clienteId) {
      cargarEstado();
    }
  }, [clienteId]);

  const cargarEstado = async () => {
    if (!clienteId) return;

    setCargando(true);
    try {
      const response = await servicioElectricoService.obtenerEstado(clienteId);
      if (response.success && response.data) {
        setEstadoServicio(response.data);
      }
    } catch (error) {
      console.error("Error cargando estado del servicio:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el estado del servicio",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  const restablecerServicio = async () => {
    if (!clienteId || !estadoServicio) return;

    setProcesando(true);
    try {
      const response =
        await servicioElectricoService.restablecerServicioCliente(clienteId);

      if (response.success && response.data) {
        setEstadoServicio(response.data);
        toast({
          title: "✅ Servicio restablecido",
          description: "Tu servicio eléctrico ha sido restablecido exitosamente",
        });
      }
    } catch (error: any) {
      console.error("Error restableciendo servicio:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "No se pudo restablecer el servicio",
        variant: "destructive",
      });
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!estadoServicio) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No se pudo cargar el estado del servicio
          </p>
        </CardContent>
      </Card>
    );
  }

  const esActivo = estadoServicio.estadoServicio === "activo";
  const esCortado = estadoServicio.estadoServicio === "cortado";

  return (
    <div className="space-y-4">
      {/* Estado Principal */}
      <Card className={`border-l-4 ${esActivo ? "border-l-green-500" : "border-l-red-500"}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {esActivo ? (
                  <Power className="h-6 w-6 text-green-600" />
                ) : (
                  <PowerOff className="h-6 w-6 text-red-600" />
                )}
                Estado del Servicio Eléctrico
              </CardTitle>
              <CardDescription>
                Última actualización:{" "}
                {new Date(estadoServicio.ultimaActualizacion).toLocaleString(
                  "es-CL"
                )}
              </CardDescription>
            </div>
            <Badge
              className={`text-lg px-4 py-2 ${
                esActivo
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {esActivo ? "✓ Activo" : "✗ Cortado"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información de Pagos */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">
                  Boletas Pagadas
                </span>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {estadoServicio.boletasPagadas}
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-muted-foreground">
                  Boletas Pendientes
                </span>
              </div>
              <p className="text-3xl font-bold text-orange-600">
                {estadoServicio.boletasPendientes}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-muted-foreground">
                  Deuda Total
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                ${estadoServicio.montoDeuda.toLocaleString("es-CL")}
              </p>
            </div>
          </div>

          {/* Alertas y Acciones */}
          {esCortado && (
            <Alert
              className={`${
                estadoServicio.puedeRestablecer
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
                  : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
              }`}
            >
              <AlertCircle
                className={`h-4 w-4 ${
                  estadoServicio.puedeRestablecer
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              />
              <AlertDescription>
                {estadoServicio.puedeRestablecer ? (
                  <div className="space-y-3">
                    <p className="font-medium text-blue-900 dark:text-blue-400">
                      Tu servicio está cortado, pero puedes restablecerlo.
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Tienes {estadoServicio.boletasPendientes} boleta(s)
                      pendiente(s). Una vez que regularices tu situación, podrás
                      restablecer el servicio.
                    </p>
                    <Button
                      onClick={restablecerServicio}
                      disabled={procesando}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {procesando ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Restableciendo...
                        </>
                      ) : (
                        <>
                          <Power className="mr-2 h-4 w-4" />
                          Restablecer Servicio
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium text-red-900 dark:text-red-400">
                      Tu servicio está cortado por mora.
                    </p>
                    <p className="text-sm text-red-800 dark:text-red-300">
                      Tienes {estadoServicio.boletasPendientes} boletas
                      pendientes. Debes pagar al menos una boleta para poder
                      restablecer el servicio.
                    </p>
                    {estadoServicio.motivoCorte && (
                      <p className="text-sm text-red-700 dark:text-red-400 italic">
                        Motivo: {estadoServicio.motivoCorte}
                      </p>
                    )}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {esActivo && estadoServicio.boletasPendientes > 0 && (
            <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <p className="font-medium text-yellow-900 dark:text-yellow-400">
                  Tienes {estadoServicio.boletasPendientes} boleta(s)
                  pendiente(s).
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                  {estadoServicio.boletasPendientes >= 3
                    ? "⚠️ Atención: Si acumulas más de 3 boletas pendientes, tu servicio será cortado automáticamente."
                    : "Por favor, regulariza tu situación para evitar el corte del servicio."}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {esActivo && estadoServicio.boletasPendientes === 0 && (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <p className="font-medium text-green-900 dark:text-green-400">
                  ¡Excelente! No tienes boletas pendientes.
                </p>
                <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                  Tu servicio está al día y funcionando correctamente.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
