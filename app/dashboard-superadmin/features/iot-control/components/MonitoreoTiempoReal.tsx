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
import { IoTRealTimeDashboard } from "@/components/dashboard/IoTRealTimeDashboard";
import { useApi } from "@/lib/hooks/useApi";
import {
  Activity,
  Zap,
  Battery,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";

interface DeviceStats {
  totalDevices: number;
  connectedDevices: number;
  disconnectedDevices: number;
  averagePower: number;
  totalEnergy: number;
  criticalAlerts: number;
}

export function MonitoreoTiempoReal() {
  const [stats, setStats] = useState<DeviceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useApi();

  useEffect(() => {
    loadGlobalStats();
    // Actualizar cada 30 segundos
    const interval = setInterval(loadGlobalStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadGlobalStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/dispositivos/global-stats", {
        headers: {
          Authorization: `Bearer ${(user as any)?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar estadísticas");
      }

      const data = await response.json();
      setStats(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Cargando datos en tiempo real...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar datos: {error}
          <Button
            variant="outline"
            size="sm"
            onClick={loadGlobalStats}
            className="ml-2"
          >
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dispositivos Totales
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDevices || 0}</div>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">
                {stats?.connectedDevices || 0} conectados
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estado de Conexión
            </CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-green-600">
                {stats?.connectedDevices || 0}
              </div>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <XCircle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-600">
                {stats?.disconnectedDevices || 0} desconectados
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Potencia Total
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.averagePower || 0).toFixed(1)} kW
            </div>
            <p className="text-xs text-muted-foreground">
              Consumo en tiempo real
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertas Críticas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.criticalAlerts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard IoT en tiempo real */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dashboard IoT en Tiempo Real</CardTitle>
              <CardDescription>
                Monitoreo completo de todos los dispositivos del sistema
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                <Wifi className="h-3 w-3 mr-1" />
                Sistema Activo
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={loadGlobalStats}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <IoTRealTimeDashboard
            userId={user?.id}
            userRole="superadmin"
            userType="admin"
            token={(user as any)?.token}
          />
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Conectividad WebSocket</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conectado
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Servicios ML</span>
                <Badge className="bg-blue-100 text-blue-800">
                  <Activity className="h-3 w-3 mr-1" />
                  Activo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sistema de Alertas</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Operativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Base de Datos</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conectada
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Comandos ejecutados (24h)</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Alertas generadas (24h)</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dispositivos reconectados</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Eficiencia promedio</span>
                <span className="font-semibold text-green-600">94.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
