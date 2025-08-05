import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { EstadisticasReducidoProps } from "./types";
import { COLORES } from "./config";

export function EstadisticasConsumoReducido({
  datos,
  resumen,
  loading,
}: EstadisticasReducidoProps) {
  // Verificaciones defensivas
  if (loading) {
    return (
      <div className="bg-background p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <LoadingSpinner />
      </div>
    );
  }

  if (!resumen) {
    console.warn("EstadisticasConsumoReducido: resumen is undefined", {
      loading,
      datosLength: datos?.length ?? 0,
      timestamp: new Date().toISOString(),
    });
    return (
      <div className="bg-background p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No hay datos de estadísticas disponibles</p>
          <p className="text-sm mt-1">Intenta recargar la página</p>
        </div>
      </div>
    );
  }

  // Log de debugging para renderizado exitoso
  console.log("EstadisticasConsumoReducido: renderizando con datos válidos", {
    loading,
    resumenDefined: !!resumen,
    datosLength: datos?.length ?? 0,
    consumoMensual: resumen?.consumoMensual,
  });

  // Crear objeto seguro con fallbacks
  const resumenSeguro = {
    consumoMensual: resumen?.consumoMensual ?? 0,
    variacionMensual: resumen?.variacionMensual ?? 0,
    consumoAnual: resumen?.consumoAnual ?? 0,
    variacionAnual: resumen?.variacionAnual ?? 0,
    pico: resumen?.pico ?? { valor: 0, fecha: "", hora: "" },
    horarioPico: resumen?.horarioPico ?? "",
    eficienciaEnergetica: resumen?.eficienciaEnergetica ?? 0,
    costoMensual: resumen?.costoMensual ?? 0,
    ahorroPotencial: resumen?.ahorroPotencial ?? 0,
  };

  // Componente personalizado para tooltip compacto
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/80 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
          <p className="text-xs font-medium">{`${label}: ${payload[0].value} kWh`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 dark:bg-gray-800 p-2 rounded"
            >
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Consumo mensual principal */}
      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Consumo Mensual
        </div>
        <div className="text-2xl font-bold text-orange-600">
          {resumenSeguro.consumoMensual.toLocaleString("es-CL")} kWh
        </div>
        <div
          className={`text-xs flex items-center ${
            resumenSeguro.variacionMensual >= 0
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {resumenSeguro.variacionMensual >= 0 ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          {resumenSeguro.variacionMensual >= 0 ? "+" : ""}
          {resumenSeguro.variacionMensual.toFixed(1)}% vs. mes anterior
        </div>
      </div>

      {/* Gráfico compacto */}
      <div className="h-32">
        {datos && datos.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datos.slice(-7)}>
              <Line
                type="monotone"
                dataKey="consumo"
                stroke={COLORES.primary}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: COLORES.secondary }}
              />
              <XAxis dataKey="periodo" hide />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800/50 rounded">
            <span className="text-sm text-gray-500">Sin datos</span>
          </div>
        )}
      </div>

      {/* Métricas adicionales compactas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Pico de consumo
          </div>
          <div className="font-semibold text-amber-600">
            {resumenSeguro.pico.valor} kWh
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Eficiencia
          </div>
          <div className="font-semibold text-blue-600">
            {resumenSeguro.eficienciaEnergetica}%
          </div>
        </div>
      </div>
    </div>
  );
}
