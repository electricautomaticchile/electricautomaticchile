"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { arduinoService, ArduinoStatus, ArduinoDeviceInfo } from "@/lib/api/services/arduinoService";
import { 
  Cpu, 
  Power, 
  PowerOff, 
  Zap, 
  Activity, 
  RefreshCw,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Plug,
  Unplug
} from "lucide-react";

export function GestionArduino() {
  const [status, setStatus] = useState<ArduinoStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [puertos, setPuertos] = useState<string[]>([]);
  const [puertoSeleccionado, setPuertoSeleccionado] = useState<string>("");
  const [conectando, setConectando] = useState(false);

  const cargarEstado = useCallback(async () => {
    try {
      const data = await arduinoService.obtenerEstado();
      setStatus(data);
    } catch (error) {
      console.error("Error cargando estado:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarPuertos = useCallback(async () => {
    try {
      const ports = await arduinoService.listarPuertos();
      setPuertos(ports);
      if (ports.length > 0 && !puertoSeleccionado) {
        setPuertoSeleccionado(ports[0]);
      }
    } catch (error) {
      console.error("Error cargando puertos:", error);
    }
  }, [puertoSeleccionado]);

  useEffect(() => {
    cargarEstado();
    cargarPuertos();
    
    const interval = setInterval(() => {
      cargarEstado();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [cargarEstado, cargarPuertos]);

  const handleConectar = async () => {
    setConectando(true);
    try {
      await arduinoService.conectar(puertoSeleccionado || undefined);
      await cargarEstado();
    } catch (error) {
      console.error("Error conectando:", error);
    } finally {
      setConectando(false);
    }
  };

  const handleDesconectar = async () => {
    try {
      await arduinoService.desconectar();
      await cargarEstado();
    } catch (error) {
      console.error("Error desconectando:", error);
    }
  };

  const handleComando = async (comando: string) => {
    try {
      await arduinoService.enviarComando(comando);
    } catch (error) {
      console.error("Error enviando comando:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                status?.connected ? "bg-green-100 dark:bg-green-900/20" : "bg-gray-100 dark:bg-gray-900/20"
              }`}>
                <Cpu className={`h-6 w-6 ${status?.connected ? "text-green-600" : "text-gray-600"}`} />
              </div>
              <div>
                <CardTitle>Gestión Arduino</CardTitle>
                <CardDescription>Control de dispositivos físicos</CardDescription>
              </div>
            </div>
            <Badge variant={status?.connected ? "default" : "secondary"} className="gap-1">
              {status?.connected ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Conectado
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  Desconectado
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!status?.connected ? (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No hay dispositivos Arduino conectados. Selecciona un puerto y conecta.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <select
                  value={puertoSeleccionado}
                  onChange={(e) => setPuertoSeleccionado(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md bg-background"
                  disabled={conectando}
                >
                  <option value="">Detección automática</option>
                  {puertos.map((puerto) => (
                    <option key={puerto} value={puerto}>
                      {puerto}
                    </option>
                  ))}
                </select>
                <Button onClick={cargarPuertos} variant="outline" size="icon" disabled={conectando}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button onClick={handleConectar} disabled={conectando} className="gap-2">
                  <Plug className="h-4 w-4" />
                  {conectando ? "Conectando..." : "Conectar"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      Arduino conectado
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {status.devicesCount} dispositivo(s) detectado(s)
                    </p>
                  </div>
                </div>
                <Button onClick={handleDesconectar} variant="destructive" size="sm" className="gap-2">
                  <Unplug className="h-4 w-4" />
                  Desconectar
                </Button>
              </div>

              {status.devices.map((device) => (
                <DispositivoCard key={device.ID} device={device} onComando={handleComando} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DispositivoCard({ 
  device, 
  onComando 
}: { 
  device: ArduinoDeviceInfo;
  onComando: (comando: string) => void;
}) {
  const reading = device.LastReading;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{device.ID}</CardTitle>
            <CardDescription>Dispositivo Arduino</CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" />
            Activo
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {reading && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Voltaje</p>
                <p className="text-lg font-semibold">{reading.voltaje?.toFixed(2) || '0.00'}V</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Corriente</p>
                <p className="text-lg font-semibold">{((reading.corriente || 0) * 1000).toFixed(2)}mA</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Potencia</p>
                <p className="text-lg font-semibold">{reading.potenciaActiva?.toFixed(3) || '0.000'}W</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Energía</p>
                <p className="text-lg font-semibold">{reading.energia?.toFixed(4) || '0.0000'}kWh</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Costo acumulado</span>
              </div>
              <span className="text-lg font-bold">${reading.costo?.toFixed(2) || '0.00'}</span>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Estado del Servicio</p>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {reading.servicioActivo ? (
                    <>
                      <Power className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-green-700 dark:text-green-300">Servicio Activo</span>
                    </>
                  ) : (
                    <>
                      <PowerOff className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-700 dark:text-red-300">Servicio Desactivado</span>
                    </>
                  )}
                </div>
                <Badge variant={reading.servicioActivo ? "default" : "destructive"}>
                  {reading.servicioActivo ? "ON" : "OFF"}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => onComando("STATUS")} variant="outline" size="sm" className="gap-2">
                <Activity className="h-4 w-4" />
                Estado
              </Button>
              <Button onClick={() => onComando("RESET")} variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button 
                onClick={() => onComando(reading.servicioActivo ? "DESACTIVAR_SERVICIO" : "ACTIVAR_SERVICIO")} 
                variant={reading.servicioActivo ? "destructive" : "default"} 
                size="sm" 
                className="gap-2"
              >
                {reading.servicioActivo ? (
                  <>
                    <PowerOff className="h-4 w-4" />
                    Desactivar
                  </>
                ) : (
                  <>
                    <Power className="h-4 w-4" />
                    Activar
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
