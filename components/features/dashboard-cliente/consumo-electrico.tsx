"use client";
import { useState, useCallback } from "react";
import { Zap, TrendingUp, DollarSign, Activity, WifiOff, Cpu } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { HistorialConsumoReal } from "./historial-consumo";
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
  corriente: number;
  timestamp: string;
}

const formatCLP = (v: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(v);

export function ConsumoElectrico({ reducida = false, clienteId }: ConsumoElectricoProps) {
  const { user, isRealAuthenticated } = useApi();
  const idCliente = clienteId || (user as any)?._id?.toString() || user?.id?.toString() || null;

  const { data: resumenData, isLoading, error: errorResumen } = useDashboardClienteResumen(
    !!idCliente && isRealAuthenticated
  );

  const [lecturaVivo, setLecturaVivo] = useState<LecturaVivo | null>(null);

  const handleWsMessage = useCallback((msg: WSMessage) => {
    if (msg.type === "device_update" && msg.data) {
      const d = msg.data as any;
      setLecturaVivo({
        energia: d.energia ?? 0,
        costo: d.costo ?? 0,
        potencia: d.potenciaActiva ?? 0,
        corriente: d.corriente ?? 0,
        timestamp: d.marcaTiempo ?? new Date().toISOString(),
      });
    }
  }, []);

  const { connected: wsConectado } = useWebSocket({
    enabled: !!idCliente && isRealAuthenticated,
    onMessage: handleWsMessage,
  });

  const energia = lecturaVivo?.energia ?? resumenData?.estadisticas?.consumoMensual ?? 0;
  const costo = lecturaVivo?.costo ?? resumenData?.estadisticas?.costoMensual ?? 0;
  const potencia = lecturaVivo?.potencia ?? 0;
  const dispositivosActivos = resumenData?.estadisticas?.dispositivosActivos ?? 0;
  const estaConectado = wsConectado || (!!resumenData && !errorResumen);
  const ultimaLectura = lecturaVivo?.timestamp
    ? new Date(lecturaVivo.timestamp).toLocaleTimeString("es-CL")
    : new Date().toLocaleTimeString("es-CL");

  // Loading state
  if (isLoading && !lecturaVivo) {
    return (
      <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
        <div className="flex items-center justify-center py-16 gap-3">
          <Zap className="h-6 w-6 text-orange-500 animate-pulse" />
          <span className="text-white/40">Cargando datos...</span>
        </div>
      </div>
    );
  }

  // Vista reducida (para dashboard principal)
  if (reducida) {
    return (
      <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Zap className="h-4 w-4 text-orange-500" />
              </div>
              <span className="font-bold text-white text-sm">Consumo Eléctrico</span>
            </div>
            {estaConectado ? (
              <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {wsConectado ? "En Vivo" : "Conectado"}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-white/30 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                <WifiOff className="h-3 w-3" />Offline
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-white/30 mb-1">Consumo</p>
              <p className="text-2xl font-black text-orange-400">{energia.toFixed(2)}<span className="text-sm font-normal text-white/30 ml-1">kWh</span></p>
            </div>
            <div>
              <p className="text-xs text-white/30 mb-1">Costo estimado</p>
              <p className="text-2xl font-black text-amber-400">{formatCLP(costo)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-orange-500" />
            </div>
            Mi Consumo
          </h2>
          <p className="text-white/40 mt-1 text-sm">Monitoreo en tiempo real de tu consumo energético</p>
        </div>
      </div>

      {/* Hero card — consumo + costo */}
      <div className="relative rounded-xl overflow-hidden border border-white/10">
        {/* Fondo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-[#0a0a0a] to-amber-500/5" />
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 absolute top-0" />
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-white/30 uppercase tracking-widest">Período actual</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-white/40 mb-1 flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-400" />Consumo Acumulado
              </p>
              <p className="text-5xl font-black text-white">{energia.toFixed(2)}</p>
              <p className="text-lg text-orange-400 font-semibold mt-1">kWh</p>
            </div>
            <div>
              <p className="text-sm text-white/40 mb-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-400" />Costo Estimado
              </p>
              <p className="text-5xl font-black text-white">{formatCLP(costo)}</p>
              <p className="text-lg text-amber-400 font-semibold mt-1">CLP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards secundarias — potencia + dispositivos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative rounded-xl border border-blue-500/20 bg-[#0a0a0a] overflow-hidden p-5">
          <div className="h-0.5 absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-400" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-wide mb-2">Potencia Activa</p>
              <p className="text-3xl font-black text-blue-400">{potencia.toFixed(1)}</p>
              <p className="text-sm text-blue-400/60 font-semibold mt-0.5">Watts</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.2)]">
              <Activity className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-purple-500/20 bg-[#0a0a0a] overflow-hidden p-5">
          <div className="h-0.5 absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-400" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-wide mb-2">Dispositivos Activos</p>
              <p className="text-3xl font-black text-purple-400">{dispositivosActivos}</p>
              <p className="text-sm text-purple-400/60 font-semibold mt-0.5">conectados</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.2)]">
              <Cpu className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Historial */}
      <HistorialConsumoReal clienteId={idCliente} />

      {/* Info del servicio */}
      <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-500" />
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Tipo de Medidor", value: "E-45S Inteligente", color: "text-orange-400" },
            { label: "Tarifa Contratada", value: "BT1 Residencial", color: "text-amber-400" },
            { label: "Fecha de Alta", value: "15/01/2023", color: "text-blue-400" },
            { label: "N° Cliente", value: (user as any)?.numeroCliente || "---", color: "text-purple-400" },
          ].map((item) => (
            <div key={item.label} className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-white/30 uppercase tracking-wide mb-1">{item.label}</p>
              <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
