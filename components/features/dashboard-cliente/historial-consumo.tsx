"use client";
import { useState, useEffect } from "react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Clock, BarChart, LineChart, Calendar, Info, Loader2, DollarSign, Zap, Activity,
} from "lucide-react";
import {
  Bar, BarChart as BarChartRecharts, CartesianGrid, Legend, Line,
  LineChart as LineChartRecharts, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { historialConsumoService, type HistorialAgregado } from "@/lib/api/historialConsumoService";
import { useApi } from '@/hooks/useApi';

interface HistorialConsumoRealProps {
  reducida?: boolean;
  clienteId?: string;
}

export function HistorialConsumoReal({ reducida = false, clienteId }: HistorialConsumoRealProps) {
  const { user } = useApi();
  const idCliente = clienteId || (user as any)?._id?.toString() || user?.id?.toString() || null;

  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<"hora" | "dia" | "mes">("hora");
  const [tipoGrafico, setTipoGrafico] = useState<"linea" | "barra">("linea");
  const [datosMostrados, setDatosMostrados] = useState<"energia" | "costo">("energia");
  const [datosHistoricos, setDatosHistoricos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);
  const [ultimoValor, setUltimoValor] = useState<any>(null);

  useEffect(() => {
    if (!idCliente) return;
    const cargarHistorial = async () => {
      setCargando(true);
      setError(null);
      try {
        const hasta = new Date();
        let desde = new Date();
        switch (periodoSeleccionado) {
          case "hora": desde = new Date(hasta.getTime() - 24 * 60 * 60 * 1000); break;
          case "dia":  desde = new Date(hasta.getTime() - 30 * 24 * 60 * 60 * 1000); break;
          case "mes":  desde = new Date(hasta.getTime() - 12 * 30 * 24 * 60 * 60 * 1000); break;
        }
        const response = await historialConsumoService.obtenerHistorial(idCliente, { desde, hasta, agregacion: periodoSeleccionado, limite: 100 });
        const ultimoResponse = await historialConsumoService.obtenerHistorial(idCliente, { desde: new Date(Date.now() - 24 * 60 * 60 * 1000), hasta: new Date(), limite: 1 });

        if (response.success && response.data) {
          const datosTransformados = (response.data as HistorialAgregado[])
            .map((item) => ({
              fecha: item._id.periodo,
              energia: Math.max(0, item.energiaTotal || 0),
              costo: Math.max(0, item.costoTotal || 0),
              potenciaPromedio: item.potenciaPromedio || 0,
              potenciaMaxima: item.potenciaMaxima || 0,
            }))
            .reverse();

          if (ultimoResponse.success && ultimoResponse.data && ultimoResponse.data.length > 0) {
            const ultimo = ultimoResponse.data[0] as any;
            setUltimoValor({ energia: ultimo.energia || 0, costo: ultimo.costo || 0, potencia: ultimo.potenciaActiva || 0, timestamp: ultimo.timestamp });
            datosTransformados.push({ fecha: "Ahora", energia: ultimo.energia || 0, costo: ultimo.costo || 0, potenciaPromedio: ultimo.potenciaActiva || 0, potenciaMaxima: ultimo.potenciaActiva || 0 });
          }
          setDatosHistoricos(datosTransformados);
          setUltimaActualizacion(new Date());
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar historial");
      } finally {
        setCargando(false);
      }
    };
    cargarHistorial();
    const intervalo = setInterval(cargarHistorial, 60000);
    return () => clearInterval(intervalo);
  }, [idCliente, periodoSeleccionado]);

  const formatoMoneda = (v: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(v);

  const energiaTotal = datosHistoricos.reduce((s, d) => s + (d.energia || 0), 0);
  const costoTotal = datosHistoricos.reduce((s, d) => s + (d.costo || 0), 0);
  const energiaPromedio = datosHistoricos.length > 0 ? energiaTotal / datosHistoricos.length : 0;
  const potenciaPromedio = datosHistoricos.length > 0 ? datosHistoricos.reduce((s, d) => s + (d.potenciaPromedio || 0), 0) / datosHistoricos.length : 0;

  if (reducida) {
    return (
      <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
            <span className="font-bold text-white text-sm">Historial de Consumo</span>
          </div>
          {cargando ? (
            <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-orange-500" /></div>
          ) : (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChartRecharts data={datosHistoricos.slice(-12)} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
                  <YAxis axisLine={false} tickLine={false} width={30} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`${v.toFixed(2)} kWh`, "Energía"]} />
                  <Line type="monotone" dataKey="energia" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChartRecharts>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header + controles */}
      <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500" />
        <div className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-white">Historial de Consumo</p>
                <p className="text-xs text-white/30 flex items-center gap-1.5 mt-0.5">
                  {ultimaActualizacion && <>Actualizado: {ultimaActualizacion.toLocaleTimeString("es-CL")}</>}
                  {ultimoValor && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Tipo gráfico */}
              <div className="flex rounded-lg border border-white/10 overflow-hidden">
                <button onClick={() => setTipoGrafico("linea")}
                  className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${tipoGrafico === "linea" ? "bg-orange-500 text-white" : "text-white/40 hover:text-white/60"}`}>
                  <LineChart className="h-3.5 w-3.5" />Línea
                </button>
                <button onClick={() => setTipoGrafico("barra")}
                  className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${tipoGrafico === "barra" ? "bg-orange-500 text-white" : "text-white/40 hover:text-white/60"}`}>
                  <BarChart className="h-3.5 w-3.5" />Barras
                </button>
              </div>
              <Select value={periodoSeleccionado} onValueChange={(v) => setPeriodoSeleccionado(v as any)}>
                <SelectTrigger className="w-36 bg-white/5 border-white/10 text-white text-xs h-8">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-orange-400" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10">
                  <SelectItem value="hora">Por Hora (24h)</SelectItem>
                  <SelectItem value="dia">Por Día (30d)</SelectItem>
                  <SelectItem value="mes">Por Mes (12m)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={datosMostrados} onValueChange={(v) => setDatosMostrados(v as any)}>
                <SelectTrigger className="w-36 bg-white/5 border-white/10 text-white text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10">
                  <SelectItem value="energia">Energía (kWh)</SelectItem>
                  <SelectItem value="costo">Costo ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Gráfico */}
          <div className="mt-5">
            {cargando && datosHistoricos.length === 0 ? (
              <div className="h-72 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
            ) : error ? (
              <div className="h-72 flex items-center justify-center text-red-400 text-sm">{error}</div>
            ) : datosHistoricos.length === 0 ? (
              <div className="h-72 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Info className="h-6 w-6 text-white/20" />
                </div>
                <p className="text-white/30 text-sm">No hay datos para este período</p>
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {tipoGrafico === "linea" ? (
                    <LineChartRecharts data={datosHistoricos} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} tickFormatter={(v) => datosMostrados === "energia" ? v.toFixed(1) : `${(v/1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "12px" }} formatter={(v: number) => [datosMostrados === "energia" ? `${v.toFixed(2)} kWh` : formatoMoneda(v), datosMostrados === "energia" ? "Energía" : "Costo"]} labelFormatter={(l) => `Período: ${l}`} />
                      <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }} />
                      <Line type="monotone" dataKey={datosMostrados} name={datosMostrados === "energia" ? "Energía (kWh)" : "Costo ($)"} stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "#f97316" }} />
                    </LineChartRecharts>
                  ) : (
                    <BarChartRecharts data={datosHistoricos} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} tickFormatter={(v) => datosMostrados === "energia" ? v.toFixed(1) : `${(v/1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "12px" }} formatter={(v: number) => [datosMostrados === "energia" ? `${v.toFixed(2)} kWh` : formatoMoneda(v), datosMostrados === "energia" ? "Energía" : "Costo"]} labelFormatter={(l) => `Período: ${l}`} />
                      <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }} />
                      <Bar dataKey={datosMostrados} name={datosMostrados === "energia" ? "Energía (kWh)" : "Costo ($)"} fill="#f97316" radius={[4, 4, 0, 0]} />
                    </BarChartRecharts>
                  )}
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 cards de stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="relative rounded-xl border border-orange-500/20 bg-[#0a0a0a] overflow-hidden p-5">
          <div className="h-0.5 absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-amber-400" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                Energía Actual
                {ultimoValor && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
              </p>
              <p className="text-2xl font-black text-orange-400">
                {ultimoValor ? ultimoValor.energia.toFixed(3) : energiaTotal.toFixed(3)}
              </p>
              <p className="text-xs text-white/30 mt-1">kWh · Período: {energiaTotal.toFixed(3)}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-green-500/20 bg-[#0a0a0a] overflow-hidden p-5">
          <div className="h-0.5 absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-400" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                Costo Actual
                {ultimoValor && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
              </p>
              <p className="text-2xl font-black text-green-400">
                {ultimoValor ? formatoMoneda(ultimoValor.costo) : formatoMoneda(costoTotal)}
              </p>
              <p className="text-xs text-white/30 mt-1">Período: {formatoMoneda(costoTotal)}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
          </div>
        </div>

        <div className="relative rounded-xl border border-blue-500/20 bg-[#0a0a0a] overflow-hidden p-5">
          <div className="h-0.5 absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-400" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-wide mb-2">Potencia Promedio</p>
              <p className="text-2xl font-black text-blue-400">{potenciaPromedio.toFixed(1)}</p>
              <p className="text-xs text-white/30 mt-1">Watts</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
