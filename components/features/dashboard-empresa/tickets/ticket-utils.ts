import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export const formatoEstado = (estado: string) => {
  const estados: Record<string, { label: string; color: string; icon: any }> = {
    abierto: {
      label: "Abierto",
      color: "bg-blue-100 text-blue-800",
      icon: AlertCircle,
    },
    "en-proceso": {
      label: "En Proceso",
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    resuelto: {
      label: "Resuelto",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle2,
    },
    cerrado: {
      label: "Cerrado",
      color: "bg-gray-100 text-gray-800",
      icon: CheckCircle2,
    },
  };
  return (
    estados[estado] || {
      label: estado,
      color: "bg-gray-100 text-gray-800",
      icon: AlertCircle,
    }
  );
};

export const formatoPrioridad = (prioridad: string) => {
  const prioridades: Record<string, { label: string; color: string }> = {
    baja: { label: "Baja", color: "bg-gray-100 text-gray-800" },
    media: { label: "Media", color: "bg-blue-100 text-blue-800" },
    alta: { label: "Alta", color: "bg-orange-100 text-orange-800" },
    urgente: {
      label: "Urgente",
      color: "bg-red-100 text-red-800 animate-pulse",
    },
  };
  return (
    prioridades[prioridad] || {
      label: prioridad,
      color: "bg-gray-100 text-gray-800",
    }
  );
};

export const formatoCategoria = (categoria: string) => {
  const categorias: Record<string, string> = {
    tecnico: "🔧 Técnico",
    facturacion: "💰 Facturación",
    consulta: "❓ Consulta",
    reclamo: "⚠️ Reclamo",
  };
  return categorias[categoria] || categoria;
};
