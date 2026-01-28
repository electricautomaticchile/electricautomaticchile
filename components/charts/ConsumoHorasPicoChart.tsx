"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Zap } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

interface ConsumoHorasPicoChartProps {
  data: { hora: number; consumo: number }[];
}

export function ConsumoHorasPicoChart({ data }: ConsumoHorasPicoChartProps) {
  const consumoPromedio = data.reduce((sum, d) => sum + d.consumo, 0) / data.length;
  const horasPico = data
    .filter(d => d.consumo > consumoPromedio * 1.2)
    .map(d => d.hora);

  const dataConPico = data.map(d => ({
    ...d,
    esPico: horasPico.includes(d.hora),
  }));

  const horaPicoMaxima = data.reduce((max, d) => d.consumo > max.consumo ? d : max, data[0]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Consumo por Hora
            </CardTitle>
            <CardDescription>
              Análisis de horas pico de consumo
            </CardDescription>
          </div>
          {horasPico.length > 0 && (
            <Badge variant="destructive" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              {horasPico.length} horas pico
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {horaPicoMaxima && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    Hora de mayor consumo
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    {horaPicoMaxima.hora}:00 - {horaPicoMaxima.hora + 1}:00 hrs con {horaPicoMaxima.consumo.toFixed(2)} kWh
                  </p>
                </div>
              </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataConPico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hora"
                tickFormatter={(hora) => `${hora}:00`}
                fontSize={12}
              />
              <YAxis
                label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
                fontSize={12}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border">
                        <p className="font-semibold">
                          {data.hora}:00 - {data.hora + 1}:00
                        </p>
                        <p className="text-sm">
                          Consumo: {data.consumo.toFixed(2)} kWh
                        </p>
                        {data.esPico && (
                          <Badge variant="destructive" className="mt-1 text-xs">
                            Hora Pico
                          </Badge>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                content={() => (
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded" />
                      <span className="text-xs">Consumo Normal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded" />
                      <span className="text-xs">Hora Pico</span>
                    </div>
                  </div>
                )}
              />
              <Bar dataKey="consumo" radius={[4, 4, 0, 0]}>
                {dataConPico.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.esPico ? '#f97316' : '#3b82f6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {horasPico.length > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Horas Pico Detectadas
              </p>
              <div className="flex flex-wrap gap-2">
                {horasPico.map(hora => (
                  <Badge key={hora} variant="outline" className="bg-orange-50 dark:bg-orange-900/20">
                    {hora}:00 - {hora + 1}:00
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                Considera reducir el uso de electrodomésticos en estas horas para ahorrar energía
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
