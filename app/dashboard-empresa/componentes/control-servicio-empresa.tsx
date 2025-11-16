"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Power,
  PowerOff,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  History,
} from "lucide-react";
import {
  servicioElectricoService,
  EstadoServicio,
  HistorialCambio,
} from "@/lib/api/servicioElectricoService";
import { useToast } from "@/components/ui/use-toast";

interface ControlServicioEmpresaProps {
  clienteId: string;
  estadoServicio: EstadoServicio;
  onActualizar: () => void;
}

export function ControlServicioEmpresa({
  clienteId,
  estadoServicio,
  onActualizar,
}: ControlServicioEmpresaProps) {
  const { toast } = useToast();
  const [procesando, setProcesando] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [accion, setAccion] = useState<"cortar" | "restablecer" | null>(null);
  const [historial, setHistorial] = useState<HistorialCambio[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  const esActivo = estadoServicio.estadoServicio === "activo";

  const ejecutarAccion = async () => {
    if (!accion) return;

    setProcesando(true);
    try {
      let response;
      if (accion === "cortar") {
        response = await servicioElectricoService.cortarServicio(
          clienteId,
          motivo
        );
      } else {
        response = await servicioElectricoService.restablecerServicioEmpresa(
          clienteId,
          motivo
        );
      }

      if (response.success) {
        toast({
          title: `✅ Servicio ${accion === "cortar" ? "cortado" : "restablecido"}`,
          description: `El servicio ha sido ${accion === "cortar" ? "cortado" : "restablecido"} exitosamente`,
        });
        setDialogAbierto(false);
        setMotivo("");
        setAccion(null);
        onActualizar();
      }
    } catch (error: any) {
      console.error(`Error ${accion} servicio:`, error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          `No se pudo ${accion} el servicio`,
        variant: "destructive",
      });
    } finally {
      setProcesando(false);
    }
  };

  const cargarHistorial = async () => {
    setCargandoHistorial(true);
    try {
      const response = await servicioElectricoService.obtenerHistorial(
        clienteId
      );
      if (response.success && response.data) {
        setHistorial(response.data);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el historial",
        variant: "destructive",
      });
    } finally {
      setCargandoHistorial(false);
    }
  };

  return (
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
              Control de Servicio Eléctrico
            </CardTitle>
            <CardDescription>
              Gestiona el estado del servicio del cliente
            </CardDescription>
          </div>
          <Badge
            className={`text-lg px-4 py-2 ${
              esActivo
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {esActivo ? "✓ Activo" : "✗ Cortado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información de Pagos */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200">
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

          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200">
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

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200">
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

        {/* Acciones */}
        <div className="flex gap-3">
          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger asChild>
              {esActivo ? (
                <Button
                  variant="destructive"
                  onClick={() => setAccion("cortar")}
                  className="flex-1"
                >
                  <PowerOff className="mr-2 h-4 w-4" />
                  Cortar Servicio
                </Button>
              ) : (
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => setAccion("restablecer")}
                >
                  <Power className="mr-2 h-4 w-4" />
                  Restablecer Servicio
                </Button>
              )}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {accion === "cortar"
                    ? "Cortar Servicio"
                    : "Restablecer Servicio"}
                </DialogTitle>
                <DialogDescription>
                  {accion === "cortar"
                    ? "El servicio será cortado inmediatamente. El cliente no podrá restablecerlo hasta que la empresa lo autorice."
                    : "El servicio será restablecido inmediatamente, independientemente del estado de pagos."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="motivo">Motivo (opcional)</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Describe el motivo de esta acción..."
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={ejecutarAccion}
                    disabled={procesando}
                    className={
                      accion === "cortar"
                        ? "flex-1 bg-red-600 hover:bg-red-700"
                        : "flex-1 bg-green-600 hover:bg-green-700"
                    }
                  >
                    {procesando ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        {accion === "cortar" ? (
                          <PowerOff className="mr-2 h-4 w-4" />
                        ) : (
                          <Power className="mr-2 h-4 w-4" />
                        )}
                        Confirmar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDialogAbierto(false);
                      setMotivo("");
                      setAccion(null);
                    }}
                    disabled={procesando}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={cargarHistorial}
                className="flex-1"
              >
                <History className="mr-2 h-4 w-4" />
                Ver Historial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Historial de Cambios</DialogTitle>
                <DialogDescription>
                  Registro de todos los cambios de estado del servicio
                </DialogDescription>
              </DialogHeader>
              {cargandoHistorial ? (
                <div className="py-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto" />
                </div>
              ) : historial.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay historial disponible
                </p>
              ) : (
                <div className="space-y-3">
                  {historial.map((cambio, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">
                          {cambio.estadoAnterior} → {cambio.estadoNuevo}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(cambio.fecha).toLocaleString("es-CL")}
                        </span>
                      </div>
                      <p className="text-sm">
                        <strong>Realizado por:</strong> {cambio.realizadoPor}
                      </p>
                      {cambio.motivo && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <strong>Motivo:</strong> {cambio.motivo}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Información adicional */}
        {estadoServicio.motivoCorte && (
          <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm font-medium text-red-900 dark:text-red-400">
              Motivo del corte:
            </p>
            <p className="text-sm text-red-800 dark:text-red-300 mt-1">
              {estadoServicio.motivoCorte}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
