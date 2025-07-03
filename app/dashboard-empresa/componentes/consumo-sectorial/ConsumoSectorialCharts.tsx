import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CHART_CONFIG } from "./config";
import { DatoSector } from "./types";
import {
  CustomPieTooltip,
  CustomBarTooltip,
  CustomRadialTooltip,
} from "./ConsumoSectorialTooltips";

interface ChartProps {
  data: DatoSector[];
  loading: boolean;
}

// Gráfico de pastel principal
export function PieChartPrincipal({ data, loading }: ChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ nombre, porcentaje }) => `${nombre}: ${porcentaje}%`}
            outerRadius={CHART_CONFIG.pie.outerRadius}
            fill="#8884d8"
            dataKey="consumo"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Gráfico de pastel reducido
export function PieChartReducido({ data, loading }: ChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data.slice(0, 4)}
            cx="50%"
            cy="50%"
            innerRadius={CHART_CONFIG.pieReducida.innerRadius}
            outerRadius={CHART_CONFIG.pieReducida.outerRadius}
            paddingAngle={CHART_CONFIG.pieReducida.paddingAngle}
            dataKey="consumo"
          >
            {data.slice(0, 4).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Gráfico de barras
export function BarChartConsumo({ data, loading }: ChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="nombre"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomBarTooltip />} />
          <Bar dataKey="consumo" fill="#ea580c" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Gráfico radial
export function RadialChartConsumo({ data, loading }: ChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <LoadingSpinner />
      </div>
    );
  }

  // Preparar datos para gráfico radial
  const dataRadial = data.map((item, index) => ({
    ...item,
    uv: item.porcentaje,
    fill: item.color,
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius={CHART_CONFIG.radial.innerRadius}
          outerRadius={CHART_CONFIG.radial.outerRadius}
          data={dataRadial}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="uv"
            cornerRadius={4}
            label={{ position: "insideStart", fill: "#fff" }}
          />
          <Tooltip content={<CustomRadialTooltip />} />
          <Legend />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Gráfico comparativo de barras horizontales
export function HorizontalBarChart({ data, loading }: ChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="horizontal"
          data={data}
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="nombre"
            tick={{ fontSize: 11 }}
            width={80}
          />
          <Tooltip content={<CustomBarTooltip />} />
          <Bar dataKey="consumo" fill="#ea580c" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
