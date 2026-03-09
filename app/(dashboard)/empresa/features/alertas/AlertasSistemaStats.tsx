import { AlertTriangle, CheckCircle2, BellRing, Info } from "lucide-react";
import { AlertasSistemaStatsProps } from './types';
import { DESCRIPCIONES_TIPO } from './config';

interface AlertasSistemaStatsExtendedProps extends AlertasSistemaStatsProps {
  filtroTipo?: string;
  filtroEstado?: string;
  onFiltroTipoChange?: (tipo: string) => void;
  onFiltroEstadoChange?: (estado: string) => void;
}

export function AlertasSistemaStats({
  resumen,
  loading,
  filtroTipo = "todos",
  filtroEstado = "todos",
  onFiltroTipoChange,
  onFiltroEstadoChange,
}: AlertasSistemaStatsExtendedProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white/5 border border-white/10 rounded-xl p-4 h-24" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      key: "error",
      titulo: "Críticas",
      valor: resumen.errorCritico,
      detalle: DESCRIPCIONES_TIPO.error,
      icono: AlertTriangle,
      accent: "red",
    },
    {
      key: "advertencia",
      titulo: "Advertencias",
      valor: resumen.advertencia,
      detalle: DESCRIPCIONES_TIPO.advertencia,
      icono: AlertTriangle,
      accent: "amber",
    },
    {
      key: "informacion",
      titulo: "Información",
      valor: resumen.informacion,
      detalle: DESCRIPCIONES_TIPO.informacion,
      icono: Info,
      accent: "orange",
    },
    {
      key: "exito",
      titulo: "Éxito",
      valor: resumen.exito,
      detalle: DESCRIPCIONES_TIPO.exito,
      icono: CheckCircle2,
      accent: "white",
    },
  ];

  const estadoCards = [
    {
      key: "no_leidas",
      titulo: "Sin leer",
      valor: resumen.noLeidas,
      detalle: `${resumen.importantes} importantes`,
      icono: BellRing,
      accent: "orange",
      isEstado: true,
    },
    {
      key: "leidas",
      titulo: "Leídas",
      valor: resumen.total - resumen.noLeidas,
      detalle: `${resumen.resueltas} resueltas`,
      icono: CheckCircle2,
      accent: "white",
      isEstado: true,
    },
  ];

  const getAccentClasses = (accent: string, isActive: boolean) => {
    const base = {
      red: { border: "border-red-500/40", top: "bg-red-500", icon: "bg-red-500/10 text-red-400", text: "text-red-400", activeBorder: "border-red-500" },
      amber: { border: "border-amber-500/20", top: "bg-amber-500", icon: "bg-amber-500/10 text-amber-400", text: "text-amber-400", activeBorder: "border-amber-500" },
      orange: { border: "border-orange-500/30", top: "bg-orange-500", icon: "bg-orange-500/10 text-orange-500", text: "text-orange-400", activeBorder: "border-orange-500" },
      white: { border: "border-white/10", top: "bg-white/20", icon: "bg-white/5 text-white/40", text: "text-white", activeBorder: "border-white/30" },
    };
    const c = base[accent as keyof typeof base] || base.white;
    return { ...c, border: isActive ? c.activeBorder : c.border };
  };

  return (
    <div className="space-y-3">
      {/* Cards de tipo — clickeables para filtrar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => {
          const Icon = card.icono;
          const isActive = filtroTipo === card.key;
          const c = getAccentClasses(card.accent, isActive);

          return (
            <div
              key={card.key}
              onClick={() => onFiltroTipoChange?.(isActive ? "todos" : card.key)}
              className={`
                relative rounded-xl border bg-[#0a0a0a] p-5 overflow-hidden cursor-pointer
                transition-all duration-200 hover:shadow-[0_0_15px_rgba(249,115,22,0.1)]
                hover:-translate-y-0.5 ${c.border}
                ${isActive ? "ring-1 ring-orange-500/40" : ""}
              `}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${c.top}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wide">{card.titulo}</p>
                  <p className={`text-3xl font-black mt-1.5 ${c.text}`}>{card.valor}</p>
                  <p className="text-sm text-white/30 mt-1">{card.detalle}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cards de estado — clickeables para filtrar */}
      <div className="grid grid-cols-2 gap-3">
        {estadoCards.map((card) => {
          const Icon = card.icono;
          const isActive = filtroEstado === card.key;
          const c = getAccentClasses(card.accent, isActive);

          return (
            <div
              key={card.key}
              onClick={() => onFiltroEstadoChange?.(isActive ? "todos" : card.key)}
              className={`
                relative rounded-xl border bg-[#0a0a0a] p-5 overflow-hidden cursor-pointer
                transition-all duration-200 hover:shadow-[0_0_15px_rgba(249,115,22,0.1)]
                hover:-translate-y-0.5 ${c.border}
                ${isActive ? "ring-1 ring-orange-500/40" : ""}
              `}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${c.top}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wide">{card.titulo}</p>
                  <p className={`text-3xl font-black mt-1.5 ${c.text}`}>{card.valor}</p>
                  <p className="text-sm text-white/30 mt-1">{card.detalle}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
