"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface ConsumoComparativaChartProps {
  data: Array<{
    periodo: string;
    actual: number;
    anterior: number;
  }>;
  titulo?: string;
  descripcion?: string;
}

export function ConsumoComparativaChart({ data, titulo, descripcion }: ConsumoComparativaChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-600" />
          {titulo || "Comparativa de Consumo"}
        </CardTitle>
        {descripcion && <CardDescription>{descripcion}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="anterior" fill="#94a3b8" name="Mes Anterior" />
            <Bar dataKey="actual" fill="#10b981" name="Mes Actual" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
