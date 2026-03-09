"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, RotateCw, AlertTriangle } from "lucide-react";
import { DispositivosStatsProps } from "./types";

export function DispositivosActivosStats({ resumen, loading, tabActiva = "todos", onTabChange }: DispositivosStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-orange-500/20 bg-card p-5 animate-pulse">
            <div className="h-3 bg-white/10 rounded mb-3 w-2/3" />
            <div className="h-8 bg-white/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      id: "activo",
      titulo: "Activos",
      valor: resumen.activos,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
      activeBorder: "border-emerald-400",
      activeRing: "ring-2 ring-emerald-500/30",
    },
    {
      id: "inactivo",
      titulo: "Inactivos",
      valor: resumen.inactivos,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/40",
      activeBorder: "border-red-400",
      activeRing: "ring-2 ring-red-500/30",
    },
    {
      id: "mantenimiento",
      titulo: "Mantenimiento",
      valor: resumen.mantenimiento,
      icon: RotateCw,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/40",
      activeBorder: "border-sky-400",
      activeRing: "ring-2 ring-sky-500/30",
    },
    {
      id: "alerta",
      titulo: "Con Alertas",
      valor: resumen.alerta,
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/40",
      activeBorder: "border-amber-400",
      activeRing: "ring-2 ring-amber-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => {
        const isActive = tabActiva === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onTabChange?.(isActive ? "todos" : s.id)}
            className={cn(
              "rounded-2xl border p-5 text-left transition-all duration-200 cursor-pointer hover:scale-[1.02]",
              s.bg,
              isActive ? `${s.activeBorder} ${s.activeRing} scale-[1.02]` : s.border
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <p className={cn("text-xs font-semibold uppercase tracking-wide", s.color)}>{s.titulo}</p>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", s.bg, isActive ? s.activeBorder : s.border)}>
                <s.icon className={cn("h-4 w-4", s.color)} />
              </div>
            </div>
            <p className={cn("text-3xl font-extrabold tracking-tight", s.color)}>{s.valor}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {resumen.total > 0 ? Math.round((s.valor / resumen.total) * 100) : 0}% del total
              {isActive && <span className="ml-2 font-semibold text-foreground">· Filtrando</span>}
            </p>
          </button>
        );
      })}
    </div>
  );
}
