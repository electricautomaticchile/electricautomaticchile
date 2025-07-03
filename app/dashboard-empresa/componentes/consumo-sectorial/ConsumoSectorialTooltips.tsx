import { TooltipProps } from "./types";

// Tooltip personalizado para gráficos de pie
export const CustomPieTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/80 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium">{data.nombre}</p>
        <p className="text-orange-600">{`Consumo: ${data.consumo.toLocaleString("es-CL")} kWh`}</p>
        <p className="text-green-600">{`Costo: $${data.costo.toLocaleString("es-CL")}`}</p>
        <p className="text-gray-600">{`Porcentaje: ${data.porcentaje}%`}</p>
      </div>
    );
  }
  return null;
};

// Tooltip personalizado para gráficos de barras
export const CustomBarTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/80 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-orange-600">{`Consumo: ${payload[0].value.toLocaleString("es-CL")} kWh`}</p>
        <p className="text-green-600">{`Costo: $${data.costo.toLocaleString("es-CL")}`}</p>
        <p
          className={`text-sm ${data.tendencia >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          {`Tendencia: ${data.tendencia >= 0 ? "+" : ""}${data.tendencia.toFixed(1)}%`}
        </p>
      </div>
    );
  }
  return null;
};

// Tooltip personalizado para gráficos radiales
export const CustomRadialTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/80 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium">{data.nombre}</p>
        <p className="text-blue-600">{`Consumo: ${data.consumo.toLocaleString("es-CL")} kWh`}</p>
        <p className="text-orange-600">{`Costo: $${data.costo.toLocaleString("es-CL")}`}</p>
        <p className="text-gray-600">{`Proporción: ${data.porcentaje}%`}</p>
      </div>
    );
  }
  return null;
};
