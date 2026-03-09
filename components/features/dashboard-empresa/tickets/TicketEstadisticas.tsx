import { Ticket, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { EstadisticasTickets } from "@/lib/api/ticketsService";

interface TicketEstadisticasProps {
  estadisticas: EstadisticasTickets;
  filtroEstado?: string;
  onFiltroEstadoChange?: (estado: string) => void;
}

export function TicketEstadisticas({ estadisticas, filtroEstado, onFiltroEstadoChange }: TicketEstadisticasProps) {
  const cards = [
    {
      key: "",
      titulo: "Total",
      valor: estadisticas.total,
      detalle: "todos los tickets",
      icono: Ticket,
      accent: "orange",
    },
    {
      key: "abierto",
      titulo: "Abiertos",
      valor: estadisticas.porEstado.abiertos,
      detalle: "requieren atención",
      icono: MessageSquare,
      accent: "orange",
    },
    {
      key: "en-proceso",
      titulo: "En Proceso",
      valor: estadisticas.porEstado.enProceso,
      detalle: "siendo atendidos",
      icono: Clock,
      accent: "amber",
    },
    {
      key: "resuelto",
      titulo: "Resueltos",
      valor: estadisticas.porEstado.resueltos,
      detalle: "completados",
      icono: CheckCircle2,
      accent: "white",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icono;
        const isActive = filtroEstado === card.key || (card.key === "" && !filtroEstado);
        const isRed = card.accent === "red";
        const isAmber = card.accent === "amber";
        const isOrange = card.accent === "orange";

        return (
          <div
            key={card.key}
            onClick={() => onFiltroEstadoChange?.(card.key)}
            className={`
              relative rounded-xl border bg-[#0a0a0a] p-4 overflow-hidden
              transition-all duration-200 cursor-pointer
              hover:shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:-translate-y-0.5
              ${isRed ? "border-red-500/30" : isAmber ? "border-amber-500/20" : isOrange ? "border-orange-500/30" : "border-white/10"}
              ${isActive ? "ring-1 ring-orange-500/40" : ""}
            `}
          >
            <div className={`absolute top-0 left-0 right-0 h-0.5
              ${isRed ? "bg-red-500" : isAmber ? "bg-amber-500" : isOrange ? "bg-orange-500" : "bg-white/20"}
            `} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wide">{card.titulo}</p>
                <p className={`text-2xl font-black mt-1
                  ${isRed ? "text-red-400" : isAmber ? "text-amber-400" : isOrange ? "text-orange-400" : "text-white"}
                `}>{card.valor}</p>
                <p className="text-xs text-white/30 mt-0.5">{card.detalle}</p>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                ${isRed ? "bg-red-500/10 text-red-400" : isAmber ? "bg-amber-500/10 text-amber-400" : isOrange ? "bg-orange-500/10 text-orange-500" : "bg-white/5 text-white/40"}
              `}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
