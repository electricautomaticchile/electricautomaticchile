"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  FileText,
  Zap,
  Settings,
  Download,
  RefreshCw,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
} from "lucide-react";

interface MLModel {
  id: string;
  type: string;
  deviceId: string;
  dataType: string;
  accuracy: number;
  lastTrained: string;
}

interface Forecast {
  deviceId: string;
  dataType: string;
  predictions: Array<{
    timestamp: string;
    value: number;
    confidence: number;
  }>;
  accuracy: number;
  modelUsed: string;
}

interface Pattern {
  type: "daily" | "weekly" | "seasonal" | "anomaly";
  description: string;
  confidence: number;
  impact: "low" | "medium" | "high";
}

interface Report {
  id: string;
  title: string;
  generatedAt: string;
  summary: {
    totalDevices: number;
    averageEfficiency: number;
    criticalAlerts: number;
    energyConsumption: number;
    estimatedCost: number;
  };
}

interface DashboardData {
  devices: Array<{
    deviceId: string;
    efficiency: number;
    powerFactor: number;
    status: "good" | "warning" | "critical";
  }>;
  systemHealth: "excellent" | "good" | "warning" | "critical";
  mlModels: {
    totalModels: number;
    averageAccuracy: number;
    modelsNeedingRetraining: number;
  };
  recentReports: Report[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const statusColors = {
  excellent: "bg-green-500",
  good: "bg-blue-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
};

const statusTextColors = {
  excellent: "text-green-700",
  good: "text-blue-700",
  warning: "text-yellow-700",
  critical: "text-red-700",
};

export default function AdvancedAnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [patterns, setPatterns] = useState<{ [deviceId: string]: Pattern[] }>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDevice, setSelectedDevice] = useState<string>("DEV001");

  // Cargar datos del dashboard
  const loadDashboardData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/analytics/dashboard"
      );
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    }
  };

  // Cargar pronósticos
  const loadForecasts = async () => {
    try {
      const devices = ["DEV001", "DEV002", "DEV003"];
      const forecastPromises = devices.map(async (deviceId) => {
        const response = await fetch("http://localhost:5000/api/ml/forecast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId, dataType: "power", hoursAhead: 24 }),
        });
        if (response.ok) {
          const data = await response.json();
          return data.data;
        }
        return null;
      });

      const results = await Promise.all(forecastPromises);
      setForecasts(results.filter(Boolean));
    } catch (error) {
      console.error("Error cargando pronósticos:", error);
    }
  };

  // Cargar patrones
  const loadPatterns = async () => {
    try {
      const devices = ["DEV001", "DEV002", "DEV003"];
      const patternsData: { [deviceId: string]: Pattern[] } = {};

      for (const deviceId of devices) {
        const response = await fetch(
          `http://localhost:5000/api/ml/patterns/${deviceId}?dataType=power`
        );
        if (response.ok) {
          const data = await response.json();
          patternsData[deviceId] = data.data.patterns;
        }
      }

      setPatterns(patternsData);
    } catch (error) {
      console.error("Error cargando patrones:", error);
    }
  };

  // Entrenar modelo
  const trainModel = async (deviceId: string, dataType: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/ml/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, dataType }),
      });

      if (response.ok) {
        alert(`Entrenamiento iniciado para ${deviceId} - ${dataType}`);
        await loadDashboardData();
      }
    } catch (error) {
      console.error("Error entrenando modelo:", error);
    }
  };

  // Generar reporte
  const generateReport = async (type: "efficiency" | "maintenance") => {
    try {
      const devices = ["DEV001", "DEV002", "DEV003"];
      const endpoint =
        type === "efficiency"
          ? "/api/reports/efficiency"
          : "/api/reports/maintenance";

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devices, period: "weekly" }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Reporte de ${type} generado: ${data.data.reportId}`);
        await loadDashboardData();
      }
    } catch (error) {
      console.error("Error generando reporte:", error);
    }
  };

  // Optimizar modelos
  const optimizeModels = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ml/optimize", {
        method: "POST",
      });

      if (response.ok) {
        alert("Optimización de modelos iniciada");
        await loadDashboardData();
      }
    } catch (error) {
      console.error("Error optimizando modelos:", error);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([loadDashboardData(), loadForecasts(), loadPatterns()]);
      setLoading(false);
    };

    loadAllData();

    // Actualizar cada 30 segundos
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando analytics avanzados...</span>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      excellent: "bg-green-100 text-green-800",
      good: "bg-blue-100 text-blue-800",
      warning: "bg-yellow-100 text-yellow-800",
      critical: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.good}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Avanzados</h1>
          <p className="text-gray-600">
            Machine Learning y Reportes Inteligentes
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => loadDashboardData()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={optimizeModels}>
            <Settings className="h-4 w-4 mr-2" />
            Optimizar ML
          </Button>
        </div>
      </div>

      {/* Resumen del Sistema */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Salud del Sistema
                  </p>
                  <p className="text-2xl font-bold">
                    {getStatusBadge(dashboardData.systemHealth)}
                  </p>
                </div>
                <Activity
                  className={`h-8 w-8 ${statusTextColors[dashboardData.systemHealth]}`}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Modelos ML
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.mlModels.totalModels}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(dashboardData.mlModels.averageAccuracy * 100).toFixed(1)}%
                    precisión
                  </p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Dispositivos
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.devices.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    {
                      dashboardData.devices.filter((d) => d.status === "good")
                        .length
                    }{" "}
                    operativos
                  </p>
                </div>
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reportes</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.recentReports.length}
                  </p>
                  <p className="text-xs text-gray-500">Últimos generados</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="ml">Machine Learning</TabsTrigger>
          <TabsTrigger value="forecasts">Pronósticos</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        {/* Tab: Resumen */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Eficiencia por Dispositivo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Eficiencia por Dispositivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.devices}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="deviceId" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="efficiency" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Estado de Dispositivos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Estado de Dispositivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData && (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Operativo",
                            value: dashboardData.devices.filter(
                              (d) => d.status === "good"
                            ).length,
                          },
                          {
                            name: "Advertencia",
                            value: dashboardData.devices.filter(
                              (d) => d.status === "warning"
                            ).length,
                          },
                          {
                            name: "Crítico",
                            value: dashboardData.devices.filter(
                              (d) => d.status === "critical"
                            ).length,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Patrones Detectados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Patrones Detectados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(patterns).map(([deviceId, devicePatterns]) => (
                  <div key={deviceId} className="space-y-2">
                    <h4 className="font-semibold">{deviceId}</h4>
                    {devicePatterns.slice(0, 3).map((pattern, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>{pattern.type}:</strong> {pattern.description}
                          <Badge
                            className="ml-2"
                            variant={
                              pattern.impact === "high"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {pattern.impact}
                          </Badge>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Machine Learning */}
        <TabsContent value="ml" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estado de Modelos */}
            <Card>
              <CardHeader>
                <CardTitle>Estado de Modelos ML</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total de Modelos:</span>
                      <Badge>{dashboardData.mlModels.totalModels}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Precisión Promedio:</span>
                        <span>
                          {(
                            dashboardData.mlModels.averageAccuracy * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={dashboardData.mlModels.averageAccuracy * 100}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Necesitan Re-entrenamiento:</span>
                      <Badge
                        variant={
                          dashboardData.mlModels.modelsNeedingRetraining > 0
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {dashboardData.mlModels.modelsNeedingRetraining}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acciones de ML */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones de Machine Learning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => trainModel(selectedDevice, "power")}
                    variant="outline"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Entrenar Potencia
                  </Button>
                  <Button
                    onClick={() => trainModel(selectedDevice, "voltage")}
                    variant="outline"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Entrenar Voltaje
                  </Button>
                  <Button
                    onClick={() => trainModel(selectedDevice, "current")}
                    variant="outline"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Entrenar Corriente
                  </Button>
                  <Button onClick={optimizeModels} variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Optimizar Todo
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Dispositivo Seleccionado:
                  </label>
                  <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="DEV001">Dispositivo DEV001</option>
                    <option value="DEV002">Dispositivo DEV002</option>
                    <option value="DEV003">Dispositivo DEV003</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Pronósticos */}
        <TabsContent value="forecasts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Pronósticos de Consumo (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {forecasts.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleTimeString()
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleString()
                      }
                    />
                    <Legend />
                    {forecasts.map((forecast, index) => (
                      <Line
                        key={forecast.deviceId}
                        type="monotone"
                        dataKey="value"
                        data={forecast.predictions}
                        stroke={COLORS[index % COLORS.length]}
                        name={`${forecast.deviceId} (${(forecast.accuracy * 100).toFixed(1)}%)`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No hay pronósticos disponibles
                  </p>
                  <Button onClick={loadForecasts} className="mt-4">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generar Pronósticos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Reportes */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Generar Reportes */}
            <Card>
              <CardHeader>
                <CardTitle>Generar Reportes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => generateReport("efficiency")}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Reporte de Eficiencia
                </Button>
                <Button
                  onClick={() => generateReport("maintenance")}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Reporte de Mantenimiento
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Datos
                </Button>
              </CardContent>
            </Card>

            {/* Reportes Recientes */}
            <Card>
              <CardHeader>
                <CardTitle>Reportes Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData && dashboardData.recentReports.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.recentReports.map((report) => (
                      <div key={report.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{report.title}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(report.generatedAt).toLocaleString()}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Ver
                          </Button>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <span>
                            Dispositivos: {report.summary.totalDevices}
                          </span>
                          <span>
                            Eficiencia:{" "}
                            {report.summary.averageEfficiency.toFixed(1)}%
                          </span>
                          <span>Alertas: {report.summary.criticalAlerts}</span>
                          <span>
                            Costo:{" "}
                            {formatCurrency(report.summary.estimatedCost)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No hay reportes recientes
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
