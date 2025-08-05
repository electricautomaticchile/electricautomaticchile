"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useWebSocket } from "@/lib/hooks/useWebSocket";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Zap,
  Leaf,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  PieChart,
  Target,
} from "lucide-react";

interface Prediction {
  deviceId: string;
  type: string;
  currentValue: number;
  predictedValue: number;
  trend: "increasing" | "decreasing" | "stable";
  confidence: number;
  timeToThreshold?: number;
  recommendation: string;
  severity: "low" | "medium" | "high" | "critical";
}

interface EfficiencyMetrics {
  deviceId: string;
  energyEfficiency: number;
  powerFactor: number;
  harmonicDistortion: number;
  loadBalance: number;
  costPerKwh: number;
  carbonFootprint: number;
  recommendations: string[];
}

interface PredictiveAnalyticsDashboardProps {
  userId?: string;
  userRole?: string;
  userType?: string;
  token?: string;
}

export function PredictiveAnalyticsDashboard({
  userId,
  userRole,
  userType,
  token,
}: PredictiveAnalyticsDashboardProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [efficiencyMetrics, setEfficiencyMetrics] = useState<
    EfficiencyMetrics[]
  >([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [globalStats, setGlobalStats] = useState<any>(null);

  const { isConnected, on, off } = useWebSocket({
    userId,
    userRole,
    userType,
    token,
  });

  useEffect(() => {
    if (!isConnected) return;

    // === ESCUCHAR EVENTOS DE ANÁLISIS PREDICTIVO ===

    // Predicciones
    const handlePrediction = (data: any) => {
      console.log("🔮 Nueva predicción:", data);
      setPredictions((prev: any) => {
        const filtered = prev.filter(
          (p: any) => !(p.deviceId === data.deviceId && p.type === data.type)
        );
        return [data, ...filtered].slice(0, 20); // Mantener 20 predicciones
      });
    };

    // Métricas de eficiencia
    const handleEfficiencyMetrics = (data: any) => {
      console.log("⚡ Métricas de eficiencia:", data);
      setEfficiencyMetrics((prev: any) => {
        const filtered = prev.filter((e: any) => e.deviceId !== data.deviceId);
        return [data, ...filtered].slice(0, 10); // Mantener 10 dispositivos
      });
    };

    // Anomalías detectadas
    const handleAnomalyDetected = (data: any) => {
      console.log("🚨 Anomalía detectada:", data);
      setAnomalies((prev: any) => [data, ...prev.slice(0, 9)]); // Mantener 10 anomalías
    };

    // Registrar event listeners
    on("analytics:prediction", handlePrediction);
    on("analytics:efficiency_metrics", handleEfficiencyMetrics);
    on("analytics:anomaly_detected", handleAnomalyDetected);

    // Cleanup
    return () => {
      off("analytics:prediction", handlePrediction);
      off("analytics:efficiency_metrics", handleEfficiencyMetrics);
      off("analytics:anomaly_detected", handleAnomalyDetected);
    };
  }, [isConnected, on, off]);

  // Cargar datos iniciales
  useEffect(() => {
    if (isConnected) {
      loadInitialData();
    }
  }, [isConnected]);

  const loadInitialData = async () => {
    try {
      // Cargar estadísticas globales
      const statsResponse = await fetch(
        "http://localhost:5000/api/analytics/stats"
      );
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setGlobalStats(statsData.data);
      }

      // Cargar reporte de eficiencia
      const efficiencyResponse = await fetch(
        "http://localhost:5000/api/analytics/efficiency-report"
      );
      if (efficiencyResponse.ok) {
        const efficiencyData = await efficiencyResponse.json();
        setEfficiencyMetrics(efficiencyData.data.devices || []);
        setGlobalStats((prev: any) => ({
          ...prev,
          ...efficiencyData.data.summary,
        }));
      }
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
    }
  };

  const triggerAnalysis = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/analytics/trigger",
        {
          method: "POST",
        }
      );
      if (response.ok) {
        console.log("✅ Análisis predictivo ejecutado");
      }
    } catch (error) {
      console.error("Error ejecutando análisis:", error);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case "stable":
        return <Minus className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return (
      variants[severity as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600";
    if (efficiency >= 80) return "text-yellow-600";
    if (efficiency >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const criticalPredictions = predictions.filter(
    (p) => p.severity === "critical"
  ).length;
  const highPredictions = predictions.filter(
    (p) => p.severity === "high"
  ).length;
  const avgEfficiency =
    efficiencyMetrics.length > 0
      ? efficiencyMetrics.reduce((sum, e) => sum + e.energyEfficiency, 0) /
        efficiencyMetrics.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">
            Análisis Predictivo y Eficiencia
          </h2>
          <Badge className="bg-purple-100 text-purple-800">
            <Brain className="h-3 w-3 mr-1" />
            IA Activa
          </Badge>
        </div>

        <Button onClick={triggerAnalysis} variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Ejecutar Análisis
        </Button>
      </div>

      {/* Métricas globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Predicciones Críticas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalPredictions}
            </div>
            <p className="text-xs text-muted-foreground">
              {highPredictions} de alta prioridad
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Eficiencia Promedio
            </CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getEfficiencyColor(avgEfficiency)}`}
            >
              {avgEfficiency.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {efficiencyMetrics.length} dispositivos monitoreados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Huella de Carbono
            </CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {globalStats?.totalCarbonFootprint?.toFixed(2) || "0.0"} kg
            </div>
            <p className="text-xs text-muted-foreground">CO₂ por hora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ahorro Estimado
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${globalStats?.estimatedMonthlySavings || 0}
            </div>
            <p className="text-xs text-muted-foreground">CLP mensual</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predicciones en tiempo real */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Predicciones en Tiempo Real</span>
            </CardTitle>
            <CardDescription>
              Análisis predictivo basado en tendencias históricas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {predictions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay predicciones disponibles
                </p>
              ) : (
                predictions.map((prediction, index) => (
                  <div
                    key={`${prediction.deviceId}-${prediction.type}-${index}`}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(prediction.trend)}
                        <div>
                          <p className="font-medium text-sm">
                            {prediction.deviceId} - {prediction.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Actual: {prediction.currentValue.toFixed(2)} →
                            Predicho: {prediction.predictedValue.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Badge className={getSeverityBadge(prediction.severity)}>
                        {prediction.severity}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Confianza</span>
                        <span>{(prediction.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <Progress
                        value={prediction.confidence * 100}
                        className="h-1"
                      />
                    </div>

                    {prediction.timeToThreshold && (
                      <Alert className="py-2">
                        <AlertTriangle className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          Umbral crítico en{" "}
                          {Math.round(prediction.timeToThreshold)} minutos
                        </AlertDescription>
                      </Alert>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {prediction.recommendation}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Métricas de eficiencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Eficiencia Energética</span>
            </CardTitle>
            <CardDescription>
              Análisis de eficiencia y factor de potencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {efficiencyMetrics.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay métricas de eficiencia disponibles
                </p>
              ) : (
                efficiencyMetrics.map((metrics) => (
                  <div
                    key={metrics.deviceId}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{metrics.deviceId}</h4>
                      <Badge
                        variant={
                          metrics.energyEfficiency >= 80
                            ? "default"
                            : "secondary"
                        }
                      >
                        {metrics.energyEfficiency.toFixed(1)}% eficiencia
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Eficiencia:</span>
                          <span
                            className={getEfficiencyColor(
                              metrics.energyEfficiency
                            )}
                          >
                            {metrics.energyEfficiency.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={metrics.energyEfficiency}
                          className="h-1"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Factor Potencia:</span>
                          <span
                            className={
                              metrics.powerFactor >= 0.9
                                ? "text-green-600"
                                : "text-orange-600"
                            }
                          >
                            {metrics.powerFactor.toFixed(2)}
                          </span>
                        </div>
                        <Progress
                          value={metrics.powerFactor * 100}
                          className="h-1"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Balance Carga:</span>
                          <span
                            className={
                              metrics.loadBalance >= 85
                                ? "text-green-600"
                                : "text-orange-600"
                            }
                          >
                            {metrics.loadBalance.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={metrics.loadBalance} className="h-1" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>THD:</span>
                          <span
                            className={
                              metrics.harmonicDistortion <= 5
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {metrics.harmonicDistortion.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={Math.min(100, metrics.harmonicDistortion * 10)}
                          className="h-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium">Recomendaciones:</p>
                      <div className="space-y-1">
                        {metrics.recommendations.map((rec, index) => (
                          <p
                            key={index}
                            className="text-xs text-muted-foreground flex items-start space-x-1"
                          >
                            <CheckCircle className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                            <span>{rec}</span>
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Huella CO₂: {metrics.carbonFootprint.toFixed(3)} kg/h
                      </span>
                      <span>Costo: ${metrics.costPerKwh} CLP/kWh</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anomalías detectadas */}
      {anomalies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Anomalías Detectadas</span>
            </CardTitle>
            <CardDescription>
              Comportamientos anómalos detectados por IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anomalies.map((anomaly, index) => (
                <Alert key={index} className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>
                        <strong>{anomaly.deviceId}</strong> - {anomaly.type}:{" "}
                        {anomaly.message}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(anomaly.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
