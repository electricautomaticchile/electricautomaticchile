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
import { useWebSocket } from "@/lib/hooks/useWebSocket";
import {
  Zap,
  Power,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Gauge,
  Battery,
  Wifi,
  WifiOff,
} from "lucide-react";

interface DeviceStatus {
  deviceId: string;
  status: "connected" | "disconnected" | "reconnecting";
  lastSeen: Date;
  voltage?: number;
  current?: number;
  power?: number;
  energy?: number;
  location?: string;
}

interface IoTAlert {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  deviceId: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
}

interface IoTRealTimeDashboardProps {
  userId?: string;
  userRole?: string;
  userType?: string;
  token?: string;
}

export function IoTRealTimeDashboard({
  userId,
  userRole,
  userType,
  token,
}: IoTRealTimeDashboardProps) {
  const [devices, setDevices] = useState<Map<string, DeviceStatus>>(new Map());
  const [alerts, setAlerts] = useState<IoTAlert[]>([]);
  const [totalPower, setTotalPower] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);

  const {
    isConnected,
    connectionConfirmed,
    on,
    off,
    sendDeviceConnectionStatus,
    sendVoltageReading,
    sendCurrentReading,
    sendPowerConsumption,
  } = useWebSocket({
    userId,
    userRole,
    userType,
    token,
  });

  useEffect(() => {
    if (!isConnected) return;

    // === ESCUCHAR EVENTOS DE DISPOSITIVOS ===

    // Actualizaciones de conexión
    const handleConnectionUpdate = (data: any) => {
      console.log("🔌 Actualización de conexión:", data);
      setDevices((prev) => {
        const newDevices = new Map(prev);
        const existing = newDevices.get(data.deviceId) || ({} as DeviceStatus);
        newDevices.set(data.deviceId, {
          ...existing,
          deviceId: data.deviceId,
          status: data.status,
          lastSeen: new Date(data.lastSeen || data.timestamp),
          location: data.location || existing.location,
        });
        return newDevices;
      });
    };

    // Actualizaciones de voltaje
    const handleVoltageUpdate = (data: any) => {
      console.log("⚡ Actualización de voltaje:", data);
      setDevices((prev) => {
        const newDevices = new Map(prev);
        const existing = newDevices.get(data.deviceId) || ({} as DeviceStatus);
        newDevices.set(data.deviceId, {
          ...existing,
          deviceId: data.deviceId,
          voltage: data.voltage,
          location: data.location || existing.location,
          lastSeen: new Date(data.timestamp),
        });
        return newDevices;
      });
    };

    // Actualizaciones de corriente
    const handleCurrentUpdate = (data: any) => {
      console.log("🔋 Actualización de corriente:", data);
      setDevices((prev) => {
        const newDevices = new Map(prev);
        const existing = newDevices.get(data.deviceId) || ({} as DeviceStatus);
        newDevices.set(data.deviceId, {
          ...existing,
          deviceId: data.deviceId,
          current: data.current,
          location: data.location || existing.location,
          lastSeen: new Date(data.timestamp),
        });
        return newDevices;
      });
    };

    // Actualizaciones de potencia
    const handlePowerUpdate = (data: any) => {
      console.log("📊 Actualización de potencia:", data);
      setDevices((prev) => {
        const newDevices = new Map(prev);
        const existing = newDevices.get(data.deviceId) || ({} as DeviceStatus);
        newDevices.set(data.deviceId, {
          ...existing,
          deviceId: data.deviceId,
          power: data.activePower,
          energy: data.energy,
          location: data.location || existing.location,
          lastSeen: new Date(data.timestamp),
        });
        return newDevices;
      });

      // Actualizar totales
      setTotalPower((prev) => prev + (data.activePower || 0));
      setTotalEnergy((prev) => prev + (data.energy || 0));
    };

    // === ESCUCHAR ALERTAS ===

    const handleNewAlert = (data: any) => {
      console.log("🚨 Nueva alerta:", data);
      const newAlert: IoTAlert = {
        id: data.id || `alert_${Date.now()}`,
        type: data.type || "info",
        title: data.title,
        message: data.message,
        deviceId: data.deviceId,
        severity: data.severity || "medium",
        timestamp: data.timestamp,
      };

      setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]); // Mantener solo 10 alertas
    };

    const handleCriticalAlert = (data: any) => {
      console.log("🚨 ALERTA CRÍTICA:", data);
      handleNewAlert({ ...data, severity: "critical" });
    };

    const handleEmergencyAlert = (data: any) => {
      console.log("🛑 ALERTA DE EMERGENCIA:", data);
      handleNewAlert({
        ...data,
        type: "error",
        severity: "critical",
        title: "🛑 EMERGENCIA: " + (data.title || "Parada de emergencia"),
      });
    };

    // Registrar event listeners
    on("device:connection_update", handleConnectionUpdate);
    on("device:voltage_update", handleVoltageUpdate);
    on("device:current_update", handleCurrentUpdate);
    on("device:power_update", handlePowerUpdate);
    on("alert:new", handleNewAlert);
    on("alert:critical", handleCriticalAlert);
    on("alert:emergency", handleEmergencyAlert);
    on("alert:voltage_anomaly", handleNewAlert);
    on("alert:overcurrent", handleNewAlert);

    // Cleanup
    return () => {
      off("device:connection_update", handleConnectionUpdate);
      off("device:voltage_update", handleVoltageUpdate);
      off("device:current_update", handleCurrentUpdate);
      off("device:power_update", handlePowerUpdate);
      off("alert:new", handleNewAlert);
      off("alert:critical", handleCriticalAlert);
      off("alert:emergency", handleEmergencyAlert);
      off("alert:voltage_anomaly", handleNewAlert);
      off("alert:overcurrent", handleNewAlert);
    };
  }, [isConnected, on, off]);

  // Funciones de simulación para testing
  const simulateDeviceData = () => {
    const deviceId = `DEV${Math.floor(Math.random() * 999) + 1}`;

    // Simular conexión
    sendDeviceConnectionStatus({
      deviceId,
      status: "connected",
      lastSeen: new Date(),
      metadata: { location: "Edificio Principal" },
    });

    // Simular lecturas
    setTimeout(() => {
      sendVoltageReading({
        deviceId,
        voltage: 220 + (Math.random() - 0.5) * 20,
        phase: "L1",
        quality: "good",
        location: "Edificio Principal",
      });
    }, 1000);

    setTimeout(() => {
      sendCurrentReading({
        deviceId,
        current: Math.random() * 30,
        phase: "L1",
        powerFactor: 0.85 + Math.random() * 0.15,
        location: "Edificio Principal",
      });
    }, 2000);

    setTimeout(() => {
      sendPowerConsumption({
        deviceId,
        activePower: Math.random() * 5000,
        energy: Math.random() * 100,
        cost: Math.random() * 50,
        location: "Edificio Principal",
      });
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "disconnected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "reconnecting":
        return <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: "bg-green-100 text-green-800",
      disconnected: "bg-red-100 text-red-800",
      reconnecting: "bg-yellow-100 text-yellow-800",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === "critical")
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const devicesArray = Array.from(devices.values());
  const connectedDevices = devicesArray.filter(
    (d) => d.status === "connected"
  ).length;
  const disconnectedDevices = devicesArray.filter(
    (d) => d.status === "disconnected"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header con estado de conexión */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Dashboard IoT en Tiempo Real</h2>
          {isConnected ? (
            <Badge className="bg-green-100 text-green-800">
              <Wifi className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">
              <WifiOff className="h-3 w-3 mr-1" />
              Desconectado
            </Badge>
          )}
        </div>

        <Button onClick={simulateDeviceData} variant="outline" size="sm">
          Simular Datos
        </Button>
      </div>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dispositivos Conectados
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {connectedDevices}
            </div>
            <p className="text-xs text-muted-foreground">
              {disconnectedDevices} desconectados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Potencia Total
            </CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPower.toFixed(1)} W</div>
            <p className="text-xs text-muted-foreground">En tiempo real</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Energía Acumulada
            </CardTitle>
            <Battery className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEnergy.toFixed(2)} kWh
            </div>
            <p className="text-xs text-muted-foreground">Consumo total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertas Activas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter((a) => a.severity === "critical").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {alerts.length} total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de dispositivos */}
        <Card>
          <CardHeader>
            <CardTitle>Dispositivos IoT</CardTitle>
            <CardDescription>
              Estado en tiempo real de todos los dispositivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {devicesArray.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay dispositivos conectados
                </p>
              ) : (
                devicesArray.map((device) => (
                  <div
                    key={device.deviceId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(device.status)}
                      <div>
                        <p className="font-medium">{device.deviceId}</p>
                        <p className="text-sm text-muted-foreground">
                          {device.location || "Ubicación no especificada"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <Badge className={getStatusBadge(device.status)}>
                        {device.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {device.voltage && `${device.voltage.toFixed(1)}V`}
                        {device.current && ` • ${device.current.toFixed(1)}A`}
                        {device.power && ` • ${device.power.toFixed(0)}W`}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alertas en tiempo real */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas en Tiempo Real</CardTitle>
            <CardDescription>
              Notificaciones y alertas del sistema IoT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay alertas activas
                </p>
              ) : (
                alerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    className={
                      alert.severity === "critical"
                        ? "border-red-500 bg-red-50"
                        : alert.type === "error"
                          ? "border-red-300"
                          : alert.type === "warning"
                            ? "border-yellow-300"
                            : "border-blue-300"
                    }
                  >
                    <div className="flex items-start space-x-2">
                      {getAlertIcon(alert.type, alert.severity)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {alert.severity}
                          </Badge>
                        </div>
                        <AlertDescription className="mt-1">
                          {alert.message}
                        </AlertDescription>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.deviceId} •{" "}
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </Alert>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
