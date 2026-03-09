import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";

export const formatoEstado = (estado: string) => {
  const estados: Record<string, { label: string; color: string; icon: any; accent: string }> = {
    abierto: {
      label: "Abierto",
      color: "bg-orange-500/10 text-orange-400 border border-orange-500/30",
      icon: AlertCircle,
      accent: "orange",
    },
    "en-proceso": {
      label: "En Proceso",
      color: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
      icon: Clock,
      accent: "amber",
    },
    resuelto: {
      label: "Resuelto",
      color: "bg-white/10 text-white/60 border border-white/20",
      icon: CheckCircle2,
      accent: "white",
    },
    cerrado: {
      label: "Cerrado",
      color: "bg-white/5 text-white/30 border border-white/10",
      icon: XCircle,
      accent: "muted",
    },
  };
  return estados[estado] || { label: estado, color: "bg-white/5 text-white/30 border border-white/10", icon: AlertCircle, accent: "muted" };
};

export const formatoPrioridad = (prioridad: string) => {
  const prioridades: Record<string, { label: string; color: string }> = {
    baja:    { label: "Baja",    color: "bg-white/5 text-white/40 border border-white/10" },
    media:   { label: "Media",   color: "bg-orange-500/10 text-orange-400 border border-orange-500/20" },
    alta:    { label: "Alta",    color: "bg-orange-500/20 text-orange-300 border border-orange-500/40" },
    urgente: { label: "Urgente", color: "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse" },
  };
  return prioridades[prioridad] || { label: prioridad, color: "bg-white/5 text-white/30 border border-white/10" };
};

export const formatoCategoria = (categoria: string) => {
  const categorias: Record<string, string> = {
    tecnico:     "Técnico",
    facturacion: "Facturación",
    consulta:    "Consulta",
    reclamo:     "Reclamo",
  };
  return categorias[categoria] || categoria;
};
