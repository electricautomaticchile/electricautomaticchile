import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DatoSector } from "./types";

interface ConsumoSectorialEstadisticasProps {
  datos: DatoSector[];
}

// Formatear consumo en kWh
const formatearConsumo = (valor: number) => {
  return `${valor.toLocaleString("es-CL")} kWh`;
};

// Formatear costo en pesos chilenos
const formatearCosto = (valor: number) => {
  return `$${valor.toLocaleString("es-CL")}`;
};

export function ConsumoSectorialEstadisticas({
  datos,
}: ConsumoSectorialEstadisticasProps) {
  if (!datos || datos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No hay datos disponibles
      </div>
    );
  }

  const totalConsumo = datos.reduce((sum, item) => sum + item.consumo, 0);
  const totalCosto = datos.reduce((sum, item) => sum + item.costo, 0);
  const mayorConsumo = datos[0];
  const menorConsumo = datos[datos.length - 1];

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Consumo Total
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {formatearConsumo(totalConsumo)}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Costo Total
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatearCosto(totalCosto)}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Promedio por Sector
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {formatearConsumo(Math.round(totalConsumo / datos.length))}
          </div>
        </div>
      </div>

      {/* Desglose detallado */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Desglose Detallado</h4>

        <div className="space-y-3">
          {datos.map((sector, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: sector.color }}
                ></div>
                <div>
                  <div className="font-medium">{sector.nombre}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatearConsumo(sector.consumo)} •{" "}
                    {formatearCosto(sector.costo)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  {sector.porcentaje}%
                </Badge>

                <div className="flex items-center gap-1">
                  {sector.tendencia >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      sector.tendencia >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {sector.tendencia >= 0 ? "+" : ""}
                    {sector.tendencia.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas adicionales */}
      <div className="border-t pt-4">
        <h4 className="text-lg font-semibold mb-3">Análisis Comparativo</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Mayor Consumo
            </div>
            <div className="font-medium text-lg">{mayorConsumo.nombre}</div>
            <div className="text-orange-600 font-semibold">
              {formatearConsumo(mayorConsumo.consumo)} (
              {mayorConsumo.porcentaje}%)
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Menor Consumo
            </div>
            <div className="font-medium text-lg">{menorConsumo.nombre}</div>
            <div className="text-green-600 font-semibold">
              {formatearConsumo(menorConsumo.consumo)} (
              {menorConsumo.porcentaje}%)
            </div>
          </div>
        </div>
      </div>

      {/* Análisis de eficiencia */}
      <div className="border-t pt-4">
        <h4 className="text-lg font-semibold mb-3">
          Indicadores de Eficiencia
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Consumo por $ invertido
            </div>
            <div className="text-xl font-bold text-blue-600">
              {((totalConsumo / totalCosto) * 1000).toFixed(2)} kWh/$1000
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Sectores con tendencia positiva
            </div>
            <div className="text-xl font-bold text-purple-600">
              {datos.filter((d) => d.tendencia >= 0).length}/{datos.length}
            </div>
          </div>

          <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Variación promedio
            </div>
            <div className="text-xl font-bold text-cyan-600">
              {(
                datos.reduce((sum, d) => sum + Math.abs(d.tendencia), 0) /
                datos.length
              ).toFixed(1)}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
