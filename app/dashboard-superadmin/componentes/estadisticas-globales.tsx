"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, TrendingUp, AlertCircle, Activity, Building2, Users, Battery, Lightbulb } from 'lucide-react';

// Datos simulados
const datosClientes = [
  { mes: 'Ene', empresas: 32, clientes: 1280, dispositivos: 3840 },
  { mes: 'Feb', empresas: 35, clientes: 1350, dispositivos: 4050 },
  { mes: 'Mar', empresas: 36, clientes: 1420, dispositivos: 4260 },
  { mes: 'Abr', empresas: 38, clientes: 1560, dispositivos: 4680 },
  { mes: 'May', empresas: 42, clientes: 1680, dispositivos: 5040 },
  { mes: 'Jun', empresas: 45, clientes: 1750, dispositivos: 5250 },
  { mes: 'Jul', empresas: 48, clientes: 1920, dispositivos: 5760 },
  { mes: 'Ago', empresas: 50, clientes: 2000, dispositivos: 6000 },
  { mes: 'Sep', empresas: 52, clientes: 2080, dispositivos: 6240 },
  { mes: 'Oct', empresas: 54, clientes: 2160, dispositivos: 6480 },
  { mes: 'Nov', empresas: 55, clientes: 2200, dispositivos: 6600 },
  { mes: 'Dic', empresas: 58, clientes: 2320, dispositivos: 6960 }
];

const datosConsumo = [
  { mes: 'Ene', residencial: 75000, comercial: 42000, industrial: 98000, total: 215000 },
  { mes: 'Feb', residencial: 72000, comercial: 40000, industrial: 95000, total: 207000 },
  { mes: 'Mar', residencial: 78000, comercial: 45000, industrial: 102000, total: 225000 },
  { mes: 'Abr', residencial: 82000, comercial: 48000, industrial: 110000, total: 240000 },
  { mes: 'May', residencial: 85000, comercial: 52000, industrial: 115000, total: 252000 },
  { mes: 'Jun', residencial: 90000, comercial: 55000, industrial: 120000, total: 265000 },
  { mes: 'Jul', residencial: 95000, comercial: 58000, industrial: 125000, total: 278000 },
  { mes: 'Ago', residencial: 98000, comercial: 62000, industrial: 130000, total: 290000 },
  { mes: 'Sep', residencial: 94000, comercial: 59000, industrial: 127000, total: 280000 },
  { mes: 'Oct', residencial: 90000, comercial: 55000, industrial: 122000, total: 267000 },
  { mes: 'Nov', residencial: 88000, comercial: 53000, industrial: 118000, total: 259000 },
  { mes: 'Dic', residencial: 92000, comercial: 57000, industrial: 123000, total: 272000 }
];

const resumenActual = {
  empresasActivas: 58,
  crecimientoEmpresas: 5.5,
  clientesTotales: 2320,
  crecimientoClientes: 4.3,
  dispositivosActivos: 6960,
  crecimientoDispositivos: 6.7,
  consumoTotal: 2850000,
  crecimientoConsumo: 3.8,
  eficienciaPromedio: 94.2,
  incidentesActivos: 12,
  incidentesResueltos: 156,
  tiempoRespuesta: 4.2
};

interface EstadisticasGlobalesProps {
  reducida?: boolean;
}

export function EstadisticasGlobales({ reducida = false }: EstadisticasGlobalesProps) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('clientes');
  const [añoSeleccionado, setAñoSeleccionado] = useState('2023');

  // Simulación de carga de datos
  useEffect(() => {
    // En una implementación real, aquí cargaríamos los datos desde una API
  }, [periodoSeleccionado, añoSeleccionado]);

  // Para la versión reducida del componente
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-600" />
            Estadísticas Globales
          </CardTitle>
          <CardDescription>
            Resumen de indicadores principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Empresas Cliente</div>
              <div className="text-2xl font-bold">{resumenActual.empresasActivas}</div>
              <div className="text-sm text-gray-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                <span className="text-green-600">+{resumenActual.crecimientoEmpresas}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Clientes Finales</div>
              <div className="text-2xl font-bold">{resumenActual.clientesTotales}</div>
              <div className="text-sm text-gray-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                <span className="text-green-600">+{resumenActual.crecimientoClientes}%</span>
              </div>
            </div>
          </div>
          
          <div className="h-36 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={datosClientes}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    fontSize: "12px",
                    border: "1px solid #e2e8f0"
                  }}
                />
                <Line type="monotone" dataKey="empresas" stroke="#ff6b35" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="clientes" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-orange-600" />
          Estadísticas Globales
        </h2>
        
        <Select defaultValue="2023" onValueChange={setAñoSeleccionado}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-orange-600" />
              Empresas Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {resumenActual.empresasActivas}
            </div>
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-green-600">+{resumenActual.crecimientoEmpresas}% en el último mes</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-600" />
              Clientes Finales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {resumenActual.clientesTotales}
            </div>
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-green-600">+{resumenActual.crecimientoClientes}% en el último mes</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <Battery className="h-4 w-4 text-green-600" />
              Dispositivos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {resumenActual.dispositivosActivos}
            </div>
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-green-600">+{resumenActual.crecimientoDispositivos}% en el último mes</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              Consumo Total (kWh)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {(resumenActual.consumoTotal / 1000).toLocaleString('es-CL')}K
            </div>
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-green-600">+{resumenActual.crecimientoConsumo}% en el último mes</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="clientes" className="mb-4" onValueChange={setPeriodoSeleccionado}>
        <TabsList>
          <TabsTrigger value="clientes">Crecimiento Clientes</TabsTrigger>
          <TabsTrigger value="consumo">Consumo Energético</TabsTrigger>
          <TabsTrigger value="rendimiento">Rendimiento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clientes" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Crecimiento de Clientes {añoSeleccionado}</CardTitle>
              <CardDescription>
                Evolución mensual de empresas, clientes finales y dispositivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosClientes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="mes" />
                    <YAxis yAxisId="left" orientation="left" stroke="#ff6b35" />
                    <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0"
                      }} 
                    />
                    <Bar yAxisId="left" dataKey="empresas" fill="#ff6b35" name="Empresas" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="clientes" fill="#3b82f6" name="Clientes Finales" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Empresas Activas</div>
                  <div className="text-xl font-bold">{resumenActual.empresasActivas}</div>
                  <div className="text-xs text-gray-500">
                    Tasa de retención: 97.2%
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Clientes por Empresa</div>
                  <div className="text-xl font-bold">
                    {Math.round(resumenActual.clientesTotales / resumenActual.empresasActivas)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Promedio actual
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Dispositivos por Cliente</div>
                  <div className="text-xl font-bold">
                    {Math.round(resumenActual.dispositivosActivos / resumenActual.clientesTotales * 10) / 10}
                  </div>
                  <div className="text-xs text-gray-500">
                    Promedio actual
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="consumo" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Consumo Energético {añoSeleccionado}</CardTitle>
              <CardDescription>
                Distribución del consumo por sectores (kWh)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosConsumo} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0"
                      }} 
                    />
                    <Bar dataKey="residencial" stackId="a" fill="#3b82f6" name="Residencial" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="comercial" stackId="a" fill="#ff6b35" name="Comercial" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="industrial" stackId="a" fill="#8b5cf6" name="Industrial" radius={[0, 0, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Consumo Anual</div>
                  <div className="text-xl font-bold">
                    {(datosConsumo.reduce((total, mes) => total + mes.total, 0) / 1000).toLocaleString('es-CL')}K kWh
                  </div>
                  <div className="text-xs text-gray-500">
                    Total acumulado
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Sector Dominante</div>
                  <div className="text-xl font-bold">Industrial</div>
                  <div className="text-xs text-gray-500">
                    45.2% del consumo total
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Promedio Mensual</div>
                  <div className="text-xl font-bold">
                    {Math.round(datosConsumo.reduce((total, mes) => total + mes.total, 0) / datosConsumo.length / 1000)}K kWh
                  </div>
                  <div className="text-xs text-gray-500">
                    Durante {añoSeleccionado}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rendimiento" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Rendimiento del Sistema</CardTitle>
              <CardDescription>
                Eficiencia e incidentes reportados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
                  <div className="text-lg font-semibold mb-2">Eficiencia del Sistema</div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{resumenActual.eficienciaPromedio}%</div>
                  <div className="text-sm text-gray-500">
                    La eficiencia se calcula basada en tiempo de actividad, respuesta del sistema y precisión de mediciones.
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
                  <div className="text-lg font-semibold mb-2">Incidentes</div>
                  <div className="flex items-end gap-8 mb-2">
                    <div>
                      <div className="text-sm text-gray-500">Activos</div>
                      <div className="text-3xl font-bold text-amber-600">{resumenActual.incidentesActivos}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Resueltos (mes)</div>
                      <div className="text-3xl font-bold text-green-600">{resumenActual.incidentesResueltos}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Tiempo resp.</div>
                      <div className="text-3xl font-bold text-blue-600">{resumenActual.tiempoRespuesta}h</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    El tiempo de respuesta es el promedio desde que se reporta hasta que se inicia la resolución.
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-1">Recomendaciones de mejora</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li>La mayor cantidad de incidentes (42%) ocurre en el sector residencial durante horas pico.</li>
                      <li>Se recomienda reforzar la capacidad de respuesta en la zona norte entre 19:00 y 21:00 horas.</li>
                      <li>El tiempo de respuesta ha mejorado un 12% respecto al mes anterior, pero sigue por encima del objetivo (3h).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 