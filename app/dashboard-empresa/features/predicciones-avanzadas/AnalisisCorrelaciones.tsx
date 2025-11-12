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
    Wind,
    Thermometer,
    Droplets,
    BarChart3,
    RefreshCw,
    Download,
    Info
} from 'lucide-react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar
} from 'recharts';

interface CorrelationData {
    fecha: string;
    consumoTotal: number;
    temperatura: number;
    humedad: number;
    pm25: number;
    pm10: number;
    aqi: number;
    consumoHVAC: number;
    consumoPurificadores: number;
    correlaciones: {
        tempVsConsumo: number;
        humedadVsConsumo: number;
        aqiVsHVAC: number;
        pm25VsPurificadores: number;
    };
}

interface AnalisisCorrelacionesProps {
    reducida?: boolean;
}

export function AnalisisCorrelaciones({ reducida = false }: AnalisisCorrelacionesProps) {
    const [datos, setDatos] = useState<CorrelationData[]>([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('30d');
    const [variableSeleccionada, setVariableSeleccionada] = useState<string>('temperatura');
    const [loading, setLoading] = useState(true);
    const [vistaActiva, setVistaActiva] = useState<'correlacion' | 'tendencias' | 'impacto'>('correlacion');

    // Datos de ejemplo para desarrollo
    const datosEjemplo: CorrelationData[] = [
        {
            fecha: '2024-01-01',
            consumoTotal: 1200,
            temperatura: 25,
            humedad: 65,
            pm25: 35,
            pm10: 50,
            aqi: 3,
            consumoHVAC: 480,
            consumoPurificadores: 60,
            correlaciones: { tempVsConsumo: 0.78, humedadVsConsumo: 0.45, aqiVsHVAC: 0.62, pm25VsPurificadores: 0.85 }
        },
        {
            fecha: '2024-01-02',
            consumoTotal: 1450,
            temperatura: 28,
            humedad: 70,
            pm25: 42,
            pm10: 65,
            aqi: 4,
            consumoHVAC: 580,
            consumoPurificadores: 85,
            correlaciones: { tempVsConsumo: 0.82, humedadVsConsumo: 0.48, aqiVsHVAC: 0.68, pm25VsPurificadores: 0.88 }
        },
        {
            fecha: '2024-01-03',
            consumoTotal: 1100,
            temperatura: 22,
            humedad: 55,
            pm25: 28,
            pm10: 40,
            aqi: 2,
            consumoHVAC: 420,
            consumoPurificadores: 45,
            correlaciones: { tempVsConsumo: 0.75, humedadVsConsumo: 0.42, aqiVsHVAC: 0.58, pm25VsPurificadores: 0.82 }
        }
    ];

    useEffect(() => {
        cargarDatos();
    }, [periodoSeleccionado]); // eslint-disable-line react-hooks/exhaustive-deps

    const cargarDatos = async () => {
        setLoading(true);

        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1200));
            setDatos(datosEjemplo);
        } catch (error) {
            console.error('Error loading correlation data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calcularCorrelacionPromedio = (tipo: keyof CorrelationData['correlaciones']) => {
        if (datos.length === 0) return 0;
        const suma = datos.reduce((acc, d) => acc + d.correlaciones[tipo], 0);
        return suma / datos.length;
    };

    const obtenerDatosScatter = () => {
        return datos.map(d => ({
            x: variableSeleccionada === 'temperatura' ? d.temperatura :
                variableSeleccionada === 'humedad' ? d.humedad :
                    variableSeleccionada === 'pm25' ? d.pm25 :
                        variableSeleccionada === 'aqi' ? d.aqi * 20 : d.pm10,
            y: d.consumoTotal,
            fecha: d.fecha
        }));
    };

    const obtenerInsights = () => {
        const correlaciones = {
            temperatura: calcularCorrelacionPromedio('tempVsConsumo'),
            humedad: calcularCorrelacionPromedio('humedadVsConsumo'),
            aqi: calcularCorrelacionPromedio('aqiVsHVAC'),
            pm25: calcularCorrelacionPromedio('pm25VsPurificadores')
        };

        const insights = [];

        if (correlaciones.temperatura > 0.7) {
            insights.push({
                tipo: 'fuerte',
                mensaje: 'Correlación fuerte entre temperatura y consumo total',
                valor: correlaciones.temperatura,
                recomendacion: 'Optimizar sistemas de climatización durante picos térmicos'
            });
        }

        if (correlaciones.pm25 > 0.8) {
            insights.push({
                tipo: 'fuerte',
                mensaje: 'Correlación muy fuerte entre PM2.5 y uso de purificadores',
                valor: correlaciones.pm25,
                recomendacion: 'Implementar alertas automáticas de calidad del aire'
            });
        }

        if (correlaciones.aqi > 0.6) {
            insights.push({
                tipo: 'moderada',
                mensaje: 'Correlación moderada entre AQI y consumo HVAC',
                valor: correlaciones.aqi,
                recomendacion: 'Ajustar filtración de aire según índices de calidad'
            });
        }

        return insights;
    };

    if (loading) {
        return (
            <Card className={reducida ? "h-64" : ""}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        Análisis de Correlaciones
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
        const correlacionTemp = calcularCorrelacionPromedio('tempVsConsumo');
        const correlacionAQI = calcularCorrelacionPromedio('aqiVsHVAC');
        const insights = obtenerInsights();

        return (
            <Card className="h-64 hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        Análisis de Correlaciones
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Factores ambientales vs consumo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Thermometer className="h-3 w-3 text-orange-500" />
                                    <span className="text-xs">Temp</span>
                                </div>
                                <div className="text-lg font-bold text-orange-600">
                                    {Math.round(correlacionTemp * 100)}%
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Wind className="h-3 w-3 text-blue-500" />
                                    <span className="text-xs">AQI</span>
                                </div>
                                <div className="text-lg font-bold text-blue-600">
                                    {Math.round(correlacionAQI * 100)}%
                                </div>
                            </div>
                        </div>

                        {insights.length > 0 && (
                            <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <Info className="h-3 w-3 text-purple-600" />
                                    <span className="text-xs font-medium text-purple-800 dark:text-purple-200">
                                        Insights
                                    </span>
                                </div>
                                <p className="text-xs text-purple-700 dark:text-purple-300">
                                    {insights[0].mensaje}
                                </p>
                            </div>
                        )}

                        <div className="h-12">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={datos.slice(0, 5)}>
                                    <Line
                                        type="monotone"
                                        dataKey="consumoTotal"
                                        stroke="#8b5cf6"
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
                                <BarChart3 className="h-6 w-6 text-purple-600" />
                                Análisis de Correlaciones Ambientales
                            </CardTitle>
                            <CardDescription>
                                Correlación entre factores ambientales y patrones de consumo energético
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>
                            <Button variant="outline" size="sm" onClick={cargarDatos}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Actualizar
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Controles */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">7 días</SelectItem>
                                <SelectItem value="30d">30 días</SelectItem>
                                <SelectItem value="90d">90 días</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={variableSeleccionada} onValueChange={setVariableSeleccionada}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="temperatura">Temperatura</SelectItem>
                                <SelectItem value="humedad">Humedad</SelectItem>
                                <SelectItem value="pm25">PM2.5</SelectItem>
                                <SelectItem value="pm10">PM10</SelectItem>
                                <SelectItem value="aqi">Índice AQI</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Métricas de correlación */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card className="border-muted">
                            <CardContent className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Thermometer className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm font-medium">Temperatura</span>
                                </div>
                                <div className="text-xl font-bold text-orange-600">
                                    {Math.round(calcularCorrelacionPromedio('tempVsConsumo') * 100)}%
                                </div>
                                <p className="text-xs text-muted-foreground">vs Consumo</p>
                            </CardContent>
                        </Card>

                        <Card className="border-muted">
                            <CardContent className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Droplets className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium">Humedad</span>
                                </div>
                                <div className="text-xl font-bold text-blue-600">
                                    {Math.round(calcularCorrelacionPromedio('humedadVsConsumo') * 100)}%
                                </div>
                                <p className="text-xs text-muted-foreground">vs Consumo</p>
                            </CardContent>
                        </Card>

                        <Card className="border-muted">
                            <CardContent className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Wind className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-medium">AQI</span>
                                </div>
                                <div className="text-xl font-bold text-green-600">
                                    {Math.round(calcularCorrelacionPromedio('aqiVsHVAC') * 100)}%
                                </div>
                                <p className="text-xs text-muted-foreground">vs HVAC</p>
                            </CardContent>
                        </Card>

                        <Card className="border-muted">
                            <CardContent className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Wind className="h-4 w-4 text-purple-500" />
                                    <span className="text-sm font-medium">PM2.5</span>
                                </div>
                                <div className="text-xl font-bold text-purple-600">
                                    {Math.round(calcularCorrelacionPromedio('pm25VsPurificadores') * 100)}%
                                </div>
                                <p className="text-xs text-muted-foreground">vs Purificadores</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs de visualización */}
                    <Tabs value={vistaActiva} onValueChange={(value) => setVistaActiva(value as any)}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="correlacion">Correlación</TabsTrigger>
                            <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
                            <TabsTrigger value="impacto">Impacto</TabsTrigger>
                        </TabsList>

                        <TabsContent value="correlacion" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Correlación: {variableSeleccionada.charAt(0).toUpperCase() + variableSeleccionada.slice(1)} vs Consumo
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ScatterChart data={obtenerDatosScatter()}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="x"
                                                    name={variableSeleccionada}
                                                    unit={variableSeleccionada === 'temperatura' ? '°C' :
                                                        variableSeleccionada === 'humedad' ? '%' :
                                                            'μg/m³'}
                                                />
                                                <YAxis dataKey="y" name="Consumo" unit="kWh" />
                                                <Tooltip
                                                    formatter={(value, name) => [
                                                        name === 'y' ? `${value} kWh` : `${value}${variableSeleccionada === 'temperatura' ? '°C' :
                                                            variableSeleccionada === 'humedad' ? '%' :
                                                                'μg/m³'
                                                            }`,
                                                        name === 'y' ? 'Consumo' : variableSeleccionada.charAt(0).toUpperCase() + variableSeleccionada.slice(1)
                                                    ]}
                                                />
                                                <Scatter dataKey="y" fill="#8b5cf6" />
                                            </ScatterChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="tendencias" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Tendencias Temporales</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={datos}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="fecha" />
                                                <YAxis yAxisId="left" />
                                                <YAxis yAxisId="right" orientation="right" />
                                                <Tooltip />
                                                <Line
                                                    yAxisId="left"
                                                    type="monotone"
                                                    dataKey="consumoTotal"
                                                    stroke="#8b5cf6"
                                                    strokeWidth={3}
                                                    name="Consumo Total"
                                                />
                                                <Line
                                                    yAxisId="right"
                                                    type="monotone"
                                                    dataKey="temperatura"
                                                    stroke="#f97316"
                                                    strokeWidth={2}
                                                    name="Temperatura"
                                                />
                                                <Line
                                                    yAxisId="right"
                                                    type="monotone"
                                                    dataKey="pm25"
                                                    stroke="#06b6d4"
                                                    strokeWidth={2}
                                                    name="PM2.5"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="impacto" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Impacto por Categoría</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={datos}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="fecha" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="consumoHVAC" fill="#f97316" name="HVAC" />
                                                <Bar dataKey="consumoPurificadores" fill="#06b6d4" name="Purificadores" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Insights y recomendaciones */}
                    <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20 mt-6">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-purple-800 dark:text-purple-200">
                                Insights y Recomendaciones
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {obtenerInsights().map((insight, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${insight.tipo === 'fuerte' ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                                                {insight.mensaje} ({Math.round(insight.valor * 100)}%)
                                            </p>
                                            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                                                {insight.recomendacion}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
}