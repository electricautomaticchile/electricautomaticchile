"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface PrediccionConsumoChartProps {
  data: Array<{
    fecha: string;
    real?: number;
    prediccion?: number;
  }>;
  titulo?: string;
  descripcion?: string;
}

export function PrediccionConsumoChart({ data, titulo, descripcion }: PrediccionConsumoChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-600" />
          {titulo || "Predicción de Consumo"}
        </CardTitle>
        {descripcion && <CardDescription>{descripcion}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="real" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.6}
              name="Consumo Real (kWh)"
            />
            <Area 
              type="monotone" 
              dataKey="prediccion" 
              stroke="#f97316" 
              fill="#f97316" 
              fillOpacity={0.3}
              strokeDasharray="5 5"
              name="Predicción (kWh)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
