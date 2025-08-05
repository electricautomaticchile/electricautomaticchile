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
  Cpu,
  MemoryStick,
  Thermometer,
  Zap,
  Power,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Square,
  RotateCcw,
  Gauge,
} from "lucide-react";

interface HardwareDevice {
  deviceId: string;
  name: string;
  type: "arduino" | "relay" | "sensor" | "controller";
  status: "online" | "offline" | "error";
  lastSeen: Date;
  location?: string;
  // Métricas de performance
  cpuUsage?: number;
  memoryUsage?: number;
  temperature?: number;
  uptime?: number;
  errorCount?: number;
  // Estado de control
  switches?: { [key: string]: "on" | "off" | "auto" };
  relays?: { [key: string]: "active" | "inactive" };
  sensors?: { [key: string]: { value: number; unit: string; type: string } };
}

interface CommandHistory {
  id: string;
  deviceId: string;
  command: string;
  target?: string;
  timestamp: Date;
  status: "queued" | "executing" | "completed" | "failed";
  result?: any;
  error?: string;
  executionTime?: number;
}

interface HardwareControlDashboardProps {
  userId?: string;
  userRole?: string;
  userType?: string;
  token?: string;
}

export function HardwareControlDashboard({
  userId,
  userRole,
  userType,
  token,
}: HardwareControlDashboardProps) {
  const [devices, setDevices] = useState<Map<string, HardwareDevice>>(
    new Map()
  );
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const { isConnected, connectionConfirmed, on, off, emit } = useWebSocket({
    userId,
    userRole,
    userType,
    token,
  });

  useEffect(() => {
    if (!isConnected) return;

    // === ESCUCHAR EVENTOS DE HARDWARE ===

    // Comandos enviados
    const handleCommandSent = (data: any) => {
      console.log("🎛️ Comando enviado:", data);
      const newCommand: CommandHistory = {
        id: data.commandId,
        deviceId: data.deviceId,
        command: data.command,
        target: data.target,
        timestamp: new Date(data.timestamp),
        status: "queued",
      };
      setCommandHistory((prev) => [newCommand, ...prev.slice(0, 19)]); // Mantener 20 comandos
    };

    // Comandos completados
    const handleCommandCompleted = (data: any) => {
      console.log("📋 Comando completado:", data);
      setCommandHistory((prev) =>
        prev.map((cmd) =>
          cmd.id === data.commandId
            ? {
                ...cmd,
                status: data.success ? "completed" : "failed",
                result: data.result,
                error: data.error,
                executionTime: data.executionTime,
              }
            : cmd
        )
      );
    };

    // Actualizaciones de sensores
    const handleSensorUpdate = (data: any) => {
      console.log("🌡️ Actualización sensor:", data);
      setDevices((prev) => {
        const newDevices = new Map(prev);
        const existing = newDevices.get(data.deviceId) || {
          deviceId: data.deviceId,
          name: `Sensor ${data.deviceId}`,
          type: "sensor" as const,
          status: "online" as const,
          lastSeen: new Date(),
          sensors: {},
        };

        newDevices.set(data.deviceId, {
          ...existing,
          lastSeen: new Date(data.timestamp),
          sensors: {
            ...existing.sensors,
            [data.sensorType]: {
              value: data.value,
              unit: data.unit,
              type: data.sensorType,
            },
          },
        });
        return newDevices;
      });
    };

    // Métricas de performance
    const handleMetricsUpdate = (data: any) => {
      console.log("📊 Métricas actualizadas:", data);
      setDevices((prev) => {
        const newDevices = new Map(prev);
        const existing = newDevices.get(data.deviceId) || {
          deviceId: data.deviceId,
          name: `Device ${data.deviceId}`,
          type: "controller" as const,
          status: "online" as const,
          lastSeen: new Date(),
        };

        newDevices.set(data.deviceId, {
          ...existing,
          cpuUsage: data.cpuUsage,
          memoryUsage: data.memoryUsage,
          temperature: data.temperature,
          uptime: data.uptime,
          errorCount: data.errorCount,
          lastSeen: new Date(data.timestamp),
        });
        return newDevices;
      });
    };

    // Control de relés
    const handleRelayUpdate = (data: any) => {
      console.log("🔌 Relé actualizado:", data);
      setDevices((prev) => {
        const newDevices = new Map(prev);
        const existing = newDevices.get(data.deviceId) || {
          deviceId: data.deviceId,
          name: `Relay ${data.deviceId}`,
          type: "relay" as const,
          status: "online" as const,
          lastSeen: new Date(),
          relays: {},
        };

        newDevices.set(data.deviceId, {
          ...existing,
          lastSeen: new Date(data.timestamp),
          relays: {
            ...existing.relays,
            [data.relayId]: data.action === "activate" ? "active" : "inactive",
          },
        });
        return newDevices;
      });
    };

    // Registrar event listeners
    on("hardware:command_sent", handleCommandSent);
    on("hardware:command_completed", handleCommandCompleted);
    on("hardware:sensor_update", handleSensorUpdate);
    on("hardware:metrics_update", handleMetricsUpdate);
    on("hardware:relay_commanded", handleRelayUpdate);

    // Cleanup
    return () => {
      off("hardware:command_sent", handleCommandSent);
      off("hardware:command_completed", handleCommandCompleted);
      off("hardware:sensor_update", handleSensorUpdate);
      off("hardware:metrics_update", handleMetricsUpdate);
      off("hardware:relay_commanded", handleRelayUpdate);
    };
  }, [isConnected, on, off]);

  // Funciones de control
  const sendArduinoCommand = (
    deviceId: string,
    command: string,
    target?: string
  ) => {
    emit("hardware:arduino_command", {
      deviceId,
      command,
      target: target || "led",
      parameters: {},
    });
  };

  const controlRelay = (deviceId: string, relayId: string, action: string) => {
    emit("hardware:relay_control", {
      deviceId,
      relayId,
      action,
      priority: "normal",
    });
  };

  const simulateDevice = () => {
    const deviceId = `HW${Math.floor(Math.random() * 999) + 1}`;

    // Simular métricas de performance
    emit("hardware:performance_metrics", {
      deviceId,
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(Math.random() * 100),
      temperature: 25 + Math.random() * 40,
      uptime: Math.floor(Math.random() * 86400),
      networkLatency: Math.floor(Math.random() * 100),
      errorCount: Math.floor(Math.random() * 10),
    });

    // Simular sensores
    setTimeout(() => {
      emit("hardware:sensor_reading", {
        deviceId,
        sensorType: "temperature",
        value: 20 + Math.random() * 15,
        unit: "°C",
        location: "Sala de Control",
        calibrated: true,
      });
    }, 1000);

    setTimeout(() => {
      emit("hardware:sensor_reading", {
        deviceId,
        sensorType: "humidity",
        value: 40 + Math.random() * 40,
        unit: "%",
        location: "Sala de Control",
        calibrated: true,
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      online: "bg-green-100 text-green-800",
      offline: "bg-red-100 text-red-800",
      error: "bg-red-100 text-red-800",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const getCommandStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "failed":
        return <XCircle className="h-3 w-3 text-red-500" />;
      case "executing":
        return <Activity className="h-3 w-3 text-blue-500 animate-spin" />;
      case "queued":
        return <Activity className="h-3 w-3 text-yellow-500" />;
      default:
        return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const devicesArray = Array.from(devices.values());
  const onlineDevices = devicesArray.filter(
    (d) => d.status === "online"
  ).length;
  const offlineDevices = devicesArray.filter(
    (d) => d.status === "offline"
  ).length;
  const recentCommands = commandHistory.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">
            Control Hardware en Tiempo Real
          </h2>
          {isConnected ? (
            <Badge className="bg-green-100 text-green-800">
              <Activity className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">
              <XCircle className="h-3 w-3 mr-1" />
              Desconectado
            </Badge>
          )}
        </div>

        <Button onClick={simulateDevice} variant="outline" size="sm">
          Simular Hardware
        </Button>
      </div>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dispositivos Online
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {onlineDevices}
            </div>
            <p className="text-xs text-muted-foreground">
              {offlineDevices} offline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comandos Ejecutados
            </CardTitle>
            <Settings className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commandHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              {commandHistory.filter((c) => c.status === "completed").length}{" "}
              exitosos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sensores Activos
            </CardTitle>
            <Gauge className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {devicesArray.reduce(
                (acc, d) => acc + Object.keys(d.sensors || {}).length,
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Lecturas en tiempo real
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Relés Controlados
            </CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {devicesArray.reduce(
                (acc, d) => acc + Object.keys(d.relays || {}).length,
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Control remoto</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de dispositivos hardware */}
        <Card>
          <CardHeader>
            <CardTitle>Dispositivos Hardware</CardTitle>
            <CardDescription>
              Estado y control de dispositivos en tiempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {devicesArray.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay dispositivos hardware conectados
                </p>
              ) : (
                devicesArray.map((device) => (
                  <div
                    key={device.deviceId}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(device.status)}
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {device.location || device.deviceId}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(device.status)}>
                        {device.status}
                      </Badge>
                    </div>

                    {/* Métricas de performance */}
                    {(device.cpuUsage !== undefined ||
                      device.memoryUsage !== undefined ||
                      device.temperature !== undefined) && (
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {device.cpuUsage !== undefined && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Cpu className="h-3 w-3" />
                              <span>CPU</span>
                            </div>
                            <Progress value={device.cpuUsage} className="h-1" />
                            <span className="text-muted-foreground">
                              {device.cpuUsage.toFixed(0)}%
                            </span>
                          </div>
                        )}
                        {device.memoryUsage !== undefined && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <MemoryStick className="h-3 w-3" />
                              <span>RAM</span>
                            </div>
                            <Progress
                              value={device.memoryUsage}
                              className="h-1"
                            />
                            <span className="text-muted-foreground">
                              {device.memoryUsage.toFixed(0)}%
                            </span>
                          </div>
                        )}
                        {device.temperature !== undefined && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Thermometer className="h-3 w-3" />
                              <span>Temp</span>
                            </div>
                            <Progress
                              value={(device.temperature / 100) * 100}
                              className="h-1"
                            />
                            <span className="text-muted-foreground">
                              {device.temperature.toFixed(1)}°C
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sensores */}
                    {device.sensors &&
                      Object.keys(device.sensors).length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Sensores:</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(device.sensors).map(
                              ([key, sensor]) => (
                                <Badge
                                  key={key}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {sensor.type}: {sensor.value.toFixed(1)}
                                  {sensor.unit}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Controles */}
                    {device.type === "arduino" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            sendArduinoCommand(device.deviceId, "on")
                          }
                        >
                          <Play className="h-3 w-3 mr-1" />
                          ON
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            sendArduinoCommand(device.deviceId, "off")
                          }
                        >
                          <Square className="h-3 w-3 mr-1" />
                          OFF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            sendArduinoCommand(device.deviceId, "reset")
                          }
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reset
                        </Button>
                      </div>
                    )}

                    {/* Control de relés */}
                    {device.relays && Object.keys(device.relays).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Relés:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(device.relays).map(
                            ([relayId, state]) => (
                              <div
                                key={relayId}
                                className="flex items-center space-x-1"
                              >
                                <Badge
                                  variant={
                                    state === "active" ? "default" : "secondary"
                                  }
                                >
                                  {relayId}: {state}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    controlRelay(
                                      device.deviceId,
                                      relayId,
                                      state === "active"
                                        ? "deactivate"
                                        : "activate"
                                    )
                                  }
                                >
                                  <Power className="h-3 w-3" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Historial de comandos */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Comandos</CardTitle>
            <CardDescription>Comandos ejecutados recientemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentCommands.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay comandos ejecutados
                </p>
              ) : (
                recentCommands.map((command) => (
                  <div
                    key={command.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getCommandStatusIcon(command.status)}
                      <div>
                        <p className="font-medium text-sm">
                          {command.command}{" "}
                          {command.target && `(${command.target})`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {command.deviceId} •{" "}
                          {command.timestamp.toLocaleTimeString()}
                        </p>
                        {command.error && (
                          <p className="text-xs text-red-600">
                            {command.error}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge
                        variant={
                          command.status === "completed"
                            ? "default"
                            : command.status === "failed"
                              ? "destructive"
                              : command.status === "executing"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {command.status}
                      </Badge>
                      {command.executionTime && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {command.executionTime}ms
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
