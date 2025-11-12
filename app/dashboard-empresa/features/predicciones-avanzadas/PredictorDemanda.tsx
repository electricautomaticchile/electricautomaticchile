"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  MapPin, 
  Calendar,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PredictionData {
  zona: string;
  fecha: string;
  demandaPredicta: number;
  demandaReal?: number;
  confianza: number;
  factoresClimaticos: {
    temperatura: number;
    humedad: number;
    precipitacion: number;
  };
  alertas: Array<{
    tipo: 'pico' | 'valle' | 'mantenimiento';
    mensaje: string;
    severidad: 'alta' | 'media' | 'baja';
  }>;
}

interface PredictorDemandaProps {
  reducida?: boolean;
}

export function PredictorDemanda({ reducida = false }: PredictorDemandaProps) {
  const [predicciones, setPredicciones] = useState<PredictionData[]>([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string>('todas');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('7d');
  const [loading, setLoading] = useState(true);
  const [vistaActiva, setVistaActiva] = useState<'grafico' | 'tabla' | 'mapa'>('grafico');

  // Datos de ejemplo para desarrollo
  const datosEjemplo: PredictionData[] = [
    {
      zona: 'Zona Norte',
      fecha: '2024-01-15',
      demandaPredicta: 1250,
      demandaReal: 1180,
      confianza: 0.92,
      factoresClimaticos: { temperatura: 28, humedad: 65, precipitacion: 0 },
      alertas: [
        { tipo: 'pico', mensaje: 'Pico de demanda esperado 14:00-18:00', severidad: 'alta' }
      ]
    },
    {
      zona: 'Zona Centro',
      fecha: '2024-01-15',
      demandaPredicta: 2100,
      demandaReal: 2050,
      confianza: 0.89,
      factoresClimaticos: { temperatura: 25, humedad: 70, precipitacion: 5 },
      alertas: [
        { tipo: 'mantenimiento', mensaje: 'Mantenimiento programado subestación', severidad: 'media' }
      ]
    },
    {
      zona: 'Zona Sur',
      fecha: '2024-01-15',
      demandaPredicta: 890,
      demandaReal: 920,
      confianza: 0.85,
      factoresClimaticos: { temperatura: 22, humedad: 80, precipitacion: 15 },
      alertas: []
    }
  ];

  const datosGrafico = [
    { hora: '00:00', prediccion: 800, real: 780, confianza: 0.9 },
    { hora: '06:00', prediccion: 1200, real: 1150, confianza: 0.88 },
    { hora: '12:00', prediccion: 1800, real: 1750, confianza: 0.92 },
    { hora: '18:00', prediccion: 2200, real: 2100, confianza: 0.87 },
    { hora: '24:00', prediccion: 1000, real: 950, confianza: 0.91 }
  ];

  useEffect(() => {
    cargarPredicciones();
  }, [zonaSeleccionada, periodoSeleccionado]); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarPredicciones = async () => {
    setLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPredicciones(datosEjemplo);
    } catch (error) {
      console.error('Error loading demand predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularPrecision = () => {
    const prediccionesConReal = predicciones.filter(p => p.demandaReal);
    if (prediccionesConReal.length === 0) return 0;
    
    const precision = prediccionesConReal.reduce((acc, p) => {
      const error = Math.abs(p.demandaPredicta - p.demandaReal!) / p.demandaReal!;
      return acc + (1 - error);
    }, 0) / prediccionesConReal.length;
    
    return Math.round(precision * 100);
  };

  const obtenerAlertasActivas = () => {
    return predicciones.flatMap(p => p.alertas).filter(a => a.severidad === 'alta');
  };

  if (loading) {
    return (
      <Card className={reducida ? "h-64" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Predictor de Demanda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reducida) {
    const demandaTotal = predicciones.reduce((sum, p) => sum + p.demandaPredicta, 0);
    const confianzaPromedio = predicciones.reduce((sum, p) => sum + p.confianza, 0) / predicciones.length;
    const alertasActivas = obtenerAlertasActivas();

    return (
      <Card className="h-64 hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Predictor de Demanda
          </CardTitle>
          <CardDescription className="text-xs">
            Predicción próximas 24h
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(demandaTotal / 1000).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">MW Total</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(confianzaPromedio * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">Precisión</p>
              </div>
            </div>
            
            {alertasActivas.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-700 dark:text-red-300">
                  {alertasActivas.length} alerta{alertasActivas.length > 1 ? 's' : ''} activa{alertasActivas.length > 1 ? 's' : ''}
                </span>
              </div>
            )}

            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datosGrafico.slice(0, 3)}>
                  <Line 
                    type="monotone" 
                    dataKey="prediccion" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Predictor de Demanda Energética
              </CardTitle>
              <CardDescription>
                Predicciones basadas en IA con factores meteorológicos y históricos
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                Precisión: {calcularPrecision()}%
              </Badge>
              <Button variant="outline" size="sm" onClick={cargarPredicciones}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Controles */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Select value={zonaSeleccionada} onValueChange={setZonaSeleccionada}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las zonas</SelectItem>
                  <SelectItem value="norte">Zona Norte</SelectItem>
                  <SelectItem value="centro">Zona Centro</SelectItem>
                  <SelectItem value="sur">Zona Sur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 horas</SelectItem>
                  <SelectItem value="7d">7 días</SelectItem>
                  <SelectItem value="30d">30 días</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Alertas activas */}
          {obtenerAlertasActivas().length > 0 && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-semibold text-red-800 dark:text-red-200">
                    Alertas Críticas
                  </h4>
                </div>
                <div className="space-y-2">
                  {obtenerAlertasActivas().map((alerta, index) => (
                    <div key={index} className="text-sm text-red-700 dark:text-red-300">
                      • {alerta.mensaje}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs de visualización */}
          <Tabs value={vistaActiva} onValueChange={(value) => setVistaActiva(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="grafico">Gráfico</TabsTrigger>
              <TabsTrigger value="tabla">Tabla</TabsTrigger>
              <TabsTrigger value="mapa">Mapa de Calor</TabsTrigger>
            </TabsList>

            <TabsContent value="grafico" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Predicción vs Demanda Real</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={datosGrafico}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hora" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            `${value} MW`,
                            name === 'prediccion' ? 'Predicción' : 'Real'
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="prediccion" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          name="prediccion"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="real" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="real"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tabla" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Predicciones por Zona</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Zona</th>
                          <th className="text-left p-2">Predicción (MW)</th>
                          <th className="text-left p-2">Real (MW)</th>
                          <th className="text-left p-2">Confianza</th>
                          <th className="text-left p-2">Clima</th>
                          <th className="text-left p-2">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predicciones.map((pred, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 font-medium">{pred.zona}</td>
                            <td className="p-2">{(pred.demandaPredicta / 1000).toFixed(1)}</td>
                            <td className="p-2">
                              {pred.demandaReal ? (pred.demandaReal / 1000).toFixed(1) : '-'}
                            </td>
                            <td className="p-2">
                              <Badge variant={pred.confianza > 0.9 ? "default" : "secondary"}>
                                {Math.round(pred.confianza * 100)}%
                              </Badge>
                            </td>
                            <td className="p-2 text-xs">
                              {pred.factoresClimaticos.temperatura}°C, {pred.factoresClimaticos.humedad}%
                            </td>
                            <td className="p-2">
                              {pred.alertas.length > 0 ? (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mapa" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Distribución de Demanda por Zona</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={predicciones}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="zona" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${(value as number / 1000).toFixed(1)} MW`, 'Demanda']}
                        />
                        <Bar 
                          dataKey="demandaPredicta" 
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Métricas de rendimiento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="border-muted">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Precisión Promedio</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {calcularPrecision()}%
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Tiempo Predicción</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  24h
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Zonas Monitoreadas</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {predicciones.length}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}