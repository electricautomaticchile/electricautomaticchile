import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { EstadisticasChartsProps, TooltipData } from './types';
import { COLORES } from './config';

export function EstadisticasConsumoCharts({ 
  datos, 
  loading, 
  tipoGrafico = "linea" 
}: EstadisticasChartsProps) {

  // Componente personalizado para tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipData) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/90 backdrop-blur-sm p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-card-foreground">{`Período: ${label}`}</p>
          <p className="text-orange-600">
            {`Consumo: ${payload[0].value?.toLocaleString("es-CL")} kWh`}
          </p>
          {payload[0]?.payload?.costo && (
            <p className="text-green-600">
              {`Costo: $${payload[0].payload.costo.toLocaleString("es-CL")}`}
            </p>
          )}
          {payload[0]?.payload?.eficiencia && (
            <p className="text-blue-600">
              {`Eficiencia: ${payload[0].payload.eficiencia}%`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Preparar datos para gráfico de pie
  const datosPie = datos.slice(0, 8).map((dato, index) => ({
    ...dato,
    fill: index % 2 === 0 ? COLORES.primary : COLORES.secondary,
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <LineChart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Sin datos disponibles
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No hay datos de consumo para el período seleccionado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="linea" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="linea">Línea</TabsTrigger>
          <TabsTrigger value="area">Área</TabsTrigger>
          <TabsTrigger value="barras">Barras</TabsTrigger>
          <TabsTrigger value="pie">Circular</TabsTrigger>
        </TabsList>

        {/* Gráfico de línea */}
        <TabsContent value="linea">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Consumo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={datos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="periodo" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="consumo"
                    stroke={COLORES.primary}
                    strokeWidth={2}
                    dot={{ r: 4, fill: COLORES.primary }}
                    activeDot={{ r: 6, fill: COLORES.secondary }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gráfico de área */}
        <TabsContent value="area">
          <Card>
            <CardHeader>
              <CardTitle>Área de Consumo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={datos}>
                  <defs>
                    <linearGradient id="colorConsumo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORES.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORES.primary} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="periodo"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="consumo"
                    stroke={COLORES.primary}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorConsumo)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gráfico de barras */}
        <TabsContent value="barras">
          <Card>
            <CardHeader>
              <CardTitle>Consumo por Período</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={datos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="periodo"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="consumo"
                    fill={COLORES.primary}
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gráfico circular */}
        <TabsContent value="pie">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Consumo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={datosPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="consumo"
                    label={({ periodo, value }) => `${periodo}: ${value} kWh`}
                  >
                    {datosPie.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Gráficos adicionales en segunda fila */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gráfico de costo vs consumo */}
        <Card>
          <CardHeader>
            <CardTitle>Relación Costo-Consumo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={datos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="periodo"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="consumo"
                  stroke={COLORES.primary}
                  strokeWidth={2}
                  name="Consumo (kWh)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="costo"
                  stroke={COLORES.success}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Costo ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de eficiencia */}
        <Card>
          <CardHeader>
            <CardTitle>Eficiencia Energética</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={datos}>
                <defs>
                  <linearGradient id="colorEficiencia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORES.info} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORES.info} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="periodo"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={[60, 100]}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Eficiencia']}
                  labelFormatter={(label) => `Período: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="eficiencia"
                  stroke={COLORES.info}
                  strokeWidth={2}
                  fill="url(#colorEficiencia)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
