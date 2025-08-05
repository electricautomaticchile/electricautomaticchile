"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useApi } from "@/lib/hooks/useApi";
import {
  Brain,
  TrendingUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  Play,
  Settings,
  BarChart3,
} from "lucide-react";

interface MLStats {
  activeModels: number;
  trainedModels: number;
  accuracy: number;
  predictions: number;
  lastOptimization: string;
}

export function MachineLearning() {
  const [stats, setStats] = useState<MLStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useApi();

  useEffect(() => {
    loadMLStats();
  }, []);

  const loadMLStats = async () => {
    try {
      setLoading(true);
      // Simular datos ML por ahora
      setStats({
        activeModels: 12,
        trainedModels: 45,
        accuracy: 94.2,
        predictions: 1847,
        lastOptimization: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error loading ML stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeModels = async () => {
    try {
      setLoading(true);
      // Aquí se ejecutaría la optimización real
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await loadMLStats();
    } catch (error) {
      console.error("Error optimizing models:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas ML */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Modelos Activos
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.activeModels || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ejecutándose en tiempo real
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Precisión Promedio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.accuracy || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Across all models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Predicciones (24h)
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.predictions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Generadas automáticamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Modelos Entrenados
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.trainedModels || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total en el sistema</p>
          </CardContent>
        </Card>
      </div>

      {/* Controles ML */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Control de Modelos
            </CardTitle>
            <CardDescription>
              Gestión y optimización de modelos de Machine Learning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Optimización Automática</p>
                <p className="text-sm text-muted-foreground">
                  Última optimización:{" "}
                  {stats?.lastOptimization
                    ? new Date(stats.lastOptimization).toLocaleString()
                    : "Nunca"}
                </p>
              </div>
              <Button
                onClick={handleOptimizeModels}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Optimizando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Optimizar Ahora
                  </div>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Entrenamiento Automático</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Activo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Detección de Anomalías</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Activo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Predicciones en Tiempo Real</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Activo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Análisis Predictivo
            </CardTitle>
            <CardDescription>
              Insights y predicciones del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Predicción de Consumo:</strong> Se espera un aumento del
                12% en el consumo energético durante las próximas 2 semanas.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Mantenimiento Predictivo:</strong> 3 dispositivos
                requieren mantenimiento preventivo en los próximos 7 días.
              </AlertDescription>
            </Alert>

            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Optimización Detectada:</strong> Se identificaron
                oportunidades de ahorro energético del 8% en el sector
                industrial.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Modelos por categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Modelos por Categoría</CardTitle>
          <CardDescription>
            Distribución de modelos ML por tipo de análisis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <p className="text-sm font-medium">Predicción de Consumo</p>
              <Badge className="mt-1 bg-blue-100 text-blue-800">Activo</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">5</div>
              <p className="text-sm font-medium">Detección de Anomalías</p>
              <Badge className="mt-1 bg-green-100 text-green-800">Activo</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <p className="text-sm font-medium">Mantenimiento Predictivo</p>
              <Badge className="mt-1 bg-purple-100 text-purple-800">
                Activo
              </Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <p className="text-sm font-medium">Optimización Energética</p>
              <Badge className="mt-1 bg-orange-100 text-orange-800">
                Activo
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
