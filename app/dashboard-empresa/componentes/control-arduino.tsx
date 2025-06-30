"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Lightbulb,
  Power,
  ToggleLeft,
  ToggleRight,
  Wifi,
  WifiOff,
  Activity,
  BarChart3,
  Download,
  RefreshCw,
  Zap,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

// Tipos
interface ArduinoStatus {
  connected: boolean;
  port: string;
  led_status: string;
  recent_messages: string[];
}

interface StatsData {
  total_commands: number;
  on_commands: number;
  total_duration: number;
  avg_duration: number;
  efficiency_percentage: number;
}

interface ControlArduinoProps {
  reducida?: boolean;
}

export function ControlArduino({ reducida = false }: ControlArduinoProps) {
  const [status, setStatus] = useState<ArduinoStatus>({
    connected: false,
    port: "",
    led_status: "DESCONOCIDO",
    recent_messages: [],
  });
  const [stats, setStats] = useState<StatsData>({
    total_commands: 0,
    on_commands: 0,
    total_duration: 0,
    avg_duration: 0,
    efficiency_percentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();

  // 🔗 URLs del servidor Flask (proyecto original)
  const FLASK_BASE_URL = "http://localhost:5000";

  // Función para obtener el estado del Arduino
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`${FLASK_BASE_URL}/status`);
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Error fetching status:", error);
      // Estado por defecto si Flask no está disponible
      setStatus({
        connected: false,
        port: "",
        led_status: "DESCONOCIDO",
        recent_messages: ["Error: Servidor Flask no disponible"],
      });
    }
  }, []);

  // Función para obtener estadísticas
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${FLASK_BASE_URL}/stats`);
      const data = await response.json();

      // Convertir formato de Flask a formato esperado
      setStats({
        total_commands: data.total_commands || 0,
        on_commands: data.on_commands || 0,
        total_duration: data.total_time_on || 0,
        avg_duration: data.avg_session_time || 0,
        efficiency_percentage:
          Math.min((data.avg_session_time / 86400) * 100, 100) || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Stats por defecto si Flask no está disponible
      setStats({
        total_commands: 0,
        on_commands: 0,
        total_duration: 0,
        avg_duration: 0,
        efficiency_percentage: 0,
      });
    }
  }, []);

  // Función para conectar Arduino
  const connectArduino = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${FLASK_BASE_URL}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Conexión exitosa",
          description: data.message,
        });
        await fetchStatus();
      } else {
        toast({
          title: "Error de conexión",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Error al conectar con servidor Flask. ¿Está ejecutándose en puerto 5000?",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para desconectar Arduino
  const disconnectArduino = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${FLASK_BASE_URL}/disconnect`, {
        method: "POST",
      });
      const data = await response.json();

      toast({
        title: data.success ? "Desconectado" : "Error",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });

      if (data.success) {
        await fetchStatus();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al conectar con servidor Flask",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para controlar LED
  const controlLed = async (action: string) => {
    if (!status.connected) {
      toast({
        title: "Arduino no conectado",
        description: "Conecte el Arduino antes de controlar el LED",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${FLASK_BASE_URL}/control/${action}`, {
        method: "POST",
      });
      const data = await response.json();

      toast({
        title: data.success ? "Comando enviado" : "Error",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });

      if (data.success) {
        await fetchStatus();
        await fetchStats();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al enviar comando",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchStatus();
        fetchStats();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchStatus, fetchStats]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchStatus();
    fetchStats();
  }, [fetchStatus, fetchStats]);

  // Versión reducida para el dashboard principal
  if (reducida) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status.connected ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm font-medium">
              {status.connected ? "Conectado" : "Desconectado"}
            </span>
          </div>
          <Badge
            variant={
              status.led_status === "ENCENDIDO" ? "default" : "secondary"
            }
          >
            {status.led_status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Comandos</div>
            <div className="text-lg font-bold text-blue-600">
              {stats.total_commands}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500">Eficiencia</div>
            <div className="text-lg font-bold text-green-600">
              {stats.efficiency_percentage.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => controlLed("on")}
            disabled={!status.connected || loading}
            className="flex-1"
          >
            <Power className="h-3 w-3 mr-1" />
            ON
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => controlLed("off")}
            disabled={!status.connected || loading}
            className="flex-1"
          >
            <Power className="h-3 w-3 mr-1" />
            OFF
          </Button>
        </div>
      </div>
    );
  }

  // Versión completa
  return (
    <div className="bg-background p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-orange-600" />
            Control Arduino LED
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sistema de control IoT para LED Arduino
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`}
            />
            Auto-refresh
          </Button>

          {status.connected ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={disconnectArduino}
              disabled={loading}
            >
              <WifiOff className="h-4 w-4 mr-2" />
              Desconectar
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={connectArduino}
              disabled={loading}
            >
              <Wifi className="h-4 w-4 mr-2" />
              Conectar
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="control" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="control" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Control
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Estado
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Estadísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="control" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Panel de Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Control LED
                </CardTitle>
                <CardDescription>
                  Controle el LED Arduino remotamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => controlLed("on")}
                    disabled={!status.connected || loading}
                    className="h-12"
                    variant="default"
                  >
                    <Power className="h-4 w-4 mr-2" />
                    Encender
                  </Button>
                  <Button
                    onClick={() => controlLed("off")}
                    disabled={!status.connected || loading}
                    className="h-12"
                    variant="outline"
                  >
                    <Power className="h-4 w-4 mr-2" />
                    Apagar
                  </Button>
                </div>
                <Button
                  onClick={() => controlLed("toggle")}
                  disabled={!status.connected || loading}
                  className="w-full h-12"
                  variant="secondary"
                >
                  {status.led_status === "ENCENDIDO" ? (
                    <ToggleRight className="h-4 w-4 mr-2" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 mr-2" />
                  )}
                  Toggle
                </Button>
              </CardContent>
            </Card>

            {/* Estado Visual */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Estado Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <div
                    className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
                      status.led_status === "ENCENDIDO"
                        ? "bg-yellow-400 border-yellow-500 shadow-lg shadow-yellow-400/50"
                        : "bg-gray-300 border-gray-400"
                    }`}
                  >
                    <Lightbulb
                      className={`h-12 w-12 ${
                        status.led_status === "ENCENDIDO"
                          ? "text-yellow-800"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Badge
                      variant={
                        status.led_status === "ENCENDIDO"
                          ? "default"
                          : "secondary"
                      }
                      className="text-sm"
                    >
                      {status.led_status}
                    </Badge>
                    {/* 🔘 Indicador de botón físico */}
                    {status.recent_messages &&
                      status.recent_messages.some((msg) =>
                        msg.includes("BOTON FISICO")
                      ) && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 animate-pulse border-blue-300"
                        >
                          🔘 Físico
                        </Badge>
                      )}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm">
                    {status.connected ? (
                      <>
                        <Wifi className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Conectado</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Desconectado</span>
                      </>
                    )}
                  </div>

                  {status.port && (
                    <p className="text-xs text-gray-500">
                      Puerto: {status.port}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Conexión</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {status.connected ? "Activa" : "Inactiva"}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-green-600" />
                    <span className="font-medium">LED</span>
                  </div>
                  <p className="text-sm text-gray-600">{status.led_status}</p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Puerto</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {status.port || "No detectado"}
                  </p>
                </div>
              </div>

              {status.recent_messages.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Mensajes Recientes</h4>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg space-y-1">
                    {status.recent_messages.map((message, index) => (
                      <p
                        key={index}
                        className={`text-sm font-mono rounded px-2 py-1 ${
                          message.includes("BOTON FISICO")
                            ? "bg-blue-100 text-blue-800 border-l-4 border-blue-500 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {message.includes("BOTON FISICO") && "🔘 "}
                        {message}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Total Comandos</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {stats.total_commands}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Power className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Encendidos</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {stats.on_commands}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium">Tiempo Promedio</span>
                </div>
                <p className="text-2xl font-bold text-orange-600 mt-2">
                  {Math.round(stats.avg_duration)}s
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Eficiencia</span>
                </div>
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  {stats.efficiency_percentage.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Exportar Datos</span>
                <Download className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(`${FLASK_BASE_URL}/export?format=json&days=7`)
                  }
                >
                  JSON (7 días)
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(`${FLASK_BASE_URL}/export?format=csv&days=7`)
                  }
                >
                  CSV (7 días)
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(`${FLASK_BASE_URL}/export?format=csv&days=30`)
                  }
                >
                  CSV (30 días)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
