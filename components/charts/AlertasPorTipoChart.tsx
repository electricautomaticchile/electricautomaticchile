"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface AlertasPorTipoChartProps {
  data: Array<{
    tipo: string;
    cantidad: number;
  }>;
  titulo?: string;
  descripcion?: string;
}

export function AlertasPorTipoChart({ data, titulo, descripcion }: AlertasPorTipoChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          {titulo || "Alertas por Tipo"}
        </CardTitle>
        {descripcion && <CardDescription>{descripcion}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="tipo" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#ef4444" name="Cantidad de Alertas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
