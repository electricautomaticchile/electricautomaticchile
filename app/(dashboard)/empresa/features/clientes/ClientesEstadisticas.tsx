"use client";
import { Users, UserCheck, UserX, Building2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export interface EstadisticasData {
  totalClientes: number;
  clientesActivos: number;
  clientesInactivos: number;
  clientesEmpresas: number;
  clientesParticulares: number;
  ingresosMensuales: number;
  crecimientoMensual: number;
  nuevosEsteMes: number;
}

interface ClientesEstadisticasProps {
  data: EstadisticasData;
  loading?: boolean;
}

export function ClientesEstadisticas({ data, loading = false }: ClientesEstadisticasProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white/5 border border-white/10 rounded-xl p-4 h-24" />
        ))}
      </div>
    );
  }

  const porcentajeActivos = data.totalClientes > 0
    ? Math.round((data.clientesActivos / data.totalClientes) * 100) : 0;

  const estadisticas = [
    {
      titulo: "Total Clientes",
      valor: data.totalClientes.toLocaleString(),
      detalle: `${data.nuevosEsteMes} nuevos este mes`,
      icono: Users,
      trend: data.crecimientoMensual > 0 ? "up" : data.crecimientoMensual < 0 ? "down" : null,
      trendValue: Math.abs(data.crecimientoMensual),
      accent: "orange",
    },
    {
      titulo: "Activos",
      valor: data.clientesActivos.toLocaleString(),
      detalle: `${porcentajeActivos}% del total`,
      icono: UserCheck,
      accent: "orange",
    },
    {
      titulo: "Inactivos",
      valor: data.clientesInactivos.toLocaleString(),
      detalle: `${100 - porcentajeActivos}% del total`,
      icono: UserX,
      accent: "red",
    },
    {
      titulo: "Empresas",
      valor: data.clientesEmpresas.toLocaleString(),
      detalle: `${data.clientesParticulares} particulares`,
      icono: Building2,
      accent: "white",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {estadisticas.map((stat, i) => {
        const Icon = stat.icono;
        const isRed = stat.accent === "red";
        const isOrange = stat.accent === "orange";

        return (
          <div
            key={i}
            className={`relative rounded-xl border bg-[#0a0a0a] p-4 overflow-hidden
              ${isRed ? "border-red-500/20" : isOrange ? "border-orange-500/30" : "border-white/10"}
            `}
          >
            <div className={`absolute top-0 left-0 right-0 h-0.5
              ${isRed ? "bg-red-500" : isOrange ? "bg-orange-500" : "bg-white/20"}
            `} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wide">{stat.titulo}</p>
                <p className={`text-2xl font-black mt-1
                  ${isRed ? "text-red-400" : isOrange ? "text-orange-400" : "text-white"}
                `}>{stat.valor}</p>
                <p className="text-xs text-white/40 mt-0.5">{stat.detalle}</p>
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-xs mt-1 ${stat.trend === "up" ? "text-orange-400" : "text-red-400"}`}>
                    {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stat.trendValue}%
                  </div>
                )}
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                ${isRed ? "bg-red-500/10 text-red-400" : isOrange ? "bg-orange-500/10 text-orange-500" : "bg-white/5 text-white/40"}
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
