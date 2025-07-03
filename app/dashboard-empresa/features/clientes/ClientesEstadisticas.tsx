"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
} from "lucide-react";

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

export function ClientesEstadisticas({
  data,
  loading = false,
}: ClientesEstadisticasProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const porcentajeActivos =
    data.totalClientes > 0
      ? Math.round((data.clientesActivos / data.totalClientes) * 100)
      : 0;

  const porcentajeEmpresas =
    data.totalClientes > 0
      ? Math.round((data.clientesEmpresas / data.totalClientes) * 100)
      : 0;

  const estadisticas = [
    {
      titulo: "Total Clientes",
      valor: data.totalClientes.toLocaleString(),
      detalle: `${data.clientesActivos} activos`,
      icono: Users,
      color: "blue",
      trend:
        data.crecimientoMensual > 0
          ? "up"
          : data.crecimientoMensual < 0
            ? "down"
            : "neutral",
      trendValue: Math.abs(data.crecimientoMensual),
    },
    {
      titulo: "Clientes Activos",
      valor: data.clientesActivos.toLocaleString(),
      detalle: `${porcentajeActivos}% del total`,
      icono: UserCheck,
      color: "green",
      badge:
        porcentajeActivos >= 80
          ? "Excelente"
          : porcentajeActivos >= 60
            ? "Bueno"
            : "Mejorar",
    },
    {
      titulo: "Tipo Empresa",
      valor: data.clientesEmpresas.toLocaleString(),
      detalle: `${porcentajeEmpresas}% empresas`,
      icono: Building2,
      color: "purple",
    },
    {
      titulo: "Ingresos Mensuales",
      valor: `$${data.ingresosMensuales.toLocaleString()}`,
      detalle: `${data.nuevosEsteMes} nuevos este mes`,
      icono: DollarSign,
      color: "orange",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      green:
        "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      purple:
        "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      orange:
        "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getBadgeVariant = (badge: string) => {
    if (badge === "Excelente") return "default";
    if (badge === "Bueno") return "secondary";
    return "destructive";
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {estadisticas.map((stat, index) => {
        const Icon = stat.icono;

        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {stat.titulo}
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {stat.valor}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.detalle}
                  </p>

                  {/* Indicadores adicionales */}
                  <div className="flex items-center gap-2 mt-2">
                    {stat.trend && (
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          stat.trend === "up"
                            ? "text-green-600 dark:text-green-400"
                            : stat.trend === "down"
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {stat.trend === "up" && (
                          <TrendingUp className="h-3 w-3" />
                        )}
                        {stat.trend === "down" && (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {stat.trendValue}%
                      </div>
                    )}

                    {stat.badge && (
                      <Badge
                        variant={getBadgeVariant(stat.badge)}
                        className="text-xs"
                      >
                        {stat.badge}
                      </Badge>
                    )}
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
