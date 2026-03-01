"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Zap,
  TrendingUp,
  DollarSign,
  Clock,
  BarChart2,
  AlertTriangle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { HistorialConsumoReal } from "./historial-consumo-real";
import { useDashboardClienteResumen } from "@/hooks/queries";
import { useWebSocket, type WSMessage } from "@/lib/websocket/useWebSocket";

interface ConsumoElectricoProps {
  reducida?: boolean;
  clienteId?: string;
}

interface LecturaVivo {
  energia: number;
  costo: number;
  potencia: number;
  voltaje: number;
  corriente: number;
  timestamp: string;
}

const formatCLP = (v: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(v);

export function ConsumoElectrico({ reducida = false, clienteId }: ConsumoElectricoProps) {
  const { user, isRealAuthenticated } = useApi();
  const idCliente = clienteId || (user as any)?._id?.toString() || user?.id?.toString() || null;

  const { data: resumenData, isLoading, error: errorResumen } = useDashboardClienteResumen(
    !!idCliente && isRealAuthenticated
  );

  // Lectura en vivo desde WebSocket (se sobreescribe con cada mensaje del Arduino)
  const [lecturaVivo, setLecturaVivo] = useState<LecturaVivo | null>(null);

  const handleWsMessage = useCallback((msg: WSMessage) => {
    if (msg.type === "device_update" && msg.data) {
      const d = msg.data as any;
      setLecturaVivo({
        energia: d.energia ?? 0,
        costo: d.costo ?? 0,
        potencia: d.potenciaActiva ?? 0,
        voltaje: d.voltaje ?? 0,
        corriente: d.corriente ?? 0,
        timestamp: d.marcaTiempo ?? new Date().toISOString(),
      });
    }
  }, []);

  const { connected: wsConectado } = useWebSocket({
    enabled: !!idCliente && isRealAuthenticated,
    onMessage: handleWsMessage,
  });

  // Valores a mostrar: WebSocket tiene prioridad, luego resumen HTTP
  const energia = lecturaVivo?.energia ?? resumenData?.estadisticas?.consumoMensual ?? 0;
  const costo = lecturaVivo?.costo ?? resumenData?.estadisticas?.costoMensual ?? 0;
  const potencia = lecturaVivo?.potencia ?? 0;
  const dispositivosActivos = resumenData?.estadisticas?.dispositivosActivos ?? 0;
  const estaConectado = wsConectado || (!!resumenData && !errorResumen);
  const ultimaLectura = lecturaVivo?.timestamp
    ? new Date(lecturaVivo.timestamp).toLocaleTimeString("es-CL")
    : new Date().toLocaleTimeString("es-CL");

  if (isLoading && !lecturaVivo) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600 animate-pulse" />
            Consumo Eléctrico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-gray-500">
            Cargando datos...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Consumo Eléctrico
            <div className="ml-auto flex items-center gap-2">
              {estaConectado ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-xs">
                  <Wifi className="h-3 w-3 mr-1" />
                  {wsConectado ? "En Vivo" : "Conectado"}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Desconectado
                </Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription>Consumo actual en tiempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center justify-between">
                Consumo Actual
                {wsConectado && <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
              </div>
              <div className="text-2xl font-bold">{energia.toFixed(4)} kWh</div>
              <div className="text-sm text-gray-500">
                <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
                {potencia.toFixed(1)} W activos
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center justify-between">
                Costo Estimado
                {wsConectado && <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
              </div>
              <div className="text-2xl font-bold">{formatCLP(costo)}</div>
              <div className="text-sm text-gray-500">
                <Clock className="h-4 w-4 inline mr-1" />
                {dispositivosActivos} dispositivo(s) activo(s)
              </div>
            </div>
          </div>
          {estaConectado && (
            <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Última actualización: {ultimaLectura}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
            <Zap className="h-8 w-8 text-orange-600" />
            Consumo Eléctrico
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitoreo en tiempo real de su consumo energético
          </p>
        </div>
        <div className="flex items-center gap-3">
          {estaConectado ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-sm px-3 py-1">
              <Wifi className="h-4 w-4 mr-1" />
              {wsConectado ? "WebSocket Activo" : "Conectado"}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <WifiOff className="h-4 w-4 mr-1" />
              Offline
            </Badge>
          )}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Última actualización: {ultimaLectura}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
              Consumo Actual
              {wsConectado && <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{energia.toFixed(4)} kWh</div>
            <div className="text-sm text-gray-500 mt-1">
              <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
              {wsConectado ? "Datos en vivo" : "Última lectura"}
            </div>
            {wsConectado && (
              <div className="text-xs text-green-600 mt-1">Actualizado en tiempo real</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
              Costo Estimado
              {wsConectado && <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{formatCLP(costo)}</div>
            <div className="text-sm text-gray-500 mt-1">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Acumulado del período
            </div>
            {wsConectado && (
              <div className="text-xs text-green-600 mt-1">Calculado en tiempo real</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
              Potencia Activa
              {wsConectado && <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{potencia.toFixed(1)} W</div>
            <div className="text-sm text-gray-500 mt-1">
              <Clock className="h-4 w-4 inline mr-1" />
              {dispositivosActivos} dispositivo(s) activo(s)
            </div>
          </CardContent>
        </Card>
      </div>

      <HistorialConsumoReal clienteId={idCliente} />

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-blue-200 dark:border-slate-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-800 dark:text-white">
            <BarChart2 className="h-5 w-5 text-orange-600" />
            Análisis Inteligente
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">Estado:</span>
              <span className="text-slate-600 dark:text-slate-400">
                {wsConectado ? "WebSocket conectado — datos en tiempo real" : "Polling cada 5s"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">Dispositivos activos:</span>
              <span className="text-slate-600 dark:text-slate-400">{dispositivosActivos}</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Los datos se actualizan automáticamente desde sus dispositivos IoT conectados.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
