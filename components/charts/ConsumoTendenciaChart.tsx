"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ConsumoTendenciaChartProps {
  data: Array<{
    fecha: string;
    consumo: number;
    costo: number;
  }>;
  titulo?: string;
  descripcion?: string;
}

export function ConsumoTendenciaChart({ data, titulo, descripcion }: ConsumoTendenciaChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          {titulo || "Tendencia de Consumo"}
        </CardTitle>
        {descripcion && <CardDescription>{descripcion}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="consumo" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Consumo (kWh)"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="costo" 
              stroke="#f97316" 
              strokeWidth={2}
              name="Costo ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
