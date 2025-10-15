"use client";

/**
 * Página de Test WebSocket
 * 
 * Página dedicada para probar la funcionalidad WebSocket en desarrollo.
 * Incluye herramientas para simular eventos, probar reconexión y verificar
 * el comportamiento sin datos reales.
 * 
 * Solo accesible en modo desarrollo
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModoTestWebSocket } from '@/components/websocket/ModoTestWebSocket';
import { PruebasEdgeCase } from '@/components/websocket/PruebasEdgeCase';
import { IndicadorEstadoConexion } from '@/components/websocket/IndicadorEstadoConexion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import { useWebSocketStore } from '@/lib/store/useWebSocketStore';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  Network,
  Server,
  TrendingUp,
  Wifi,
  XCircle,
} from 'lucide-react';

// Deshabilitar static generation para esta página
export const dynamic = 'force-dynamic';

export default function TestWebSocketPage() {
  const router = useRouter();
  const [tiempoInicio, setTiempoInicio] = useState<Date | null>(null);
  const [duracionSesion, setDuracionSesion] = useState<string>('0s');
  const [montado, setMontado] = useState(false);

  // Solo renderizar en el cliente
  useEffect(() => {
    setMontado(true);
  }, []);

  if (!montado) {
    return null;
  }

  return <TestWebSocketContent />;
}

function TestWebSocketContent() {
  const router = useRouter();
  const [tiempoInicio, setTiempoInicio] = useState<Date | null>(null);
  const [duracionSesion, setDuracionSesion] = useState<string>('0s');

  const {
    estaConectado,
    estadoConexion,
    ultimoError,
    intentosReconexion,
    latencia,
  } = useWebSocket();

  const {
    metricas,
  } = useWebSocketStore();

  // Redirigir en producción
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      router.push('/');
    }
  }, [router]);

  // Calcular duración de sesión
  useEffect(() => {
    if (estaConectado && !tiempoInicio) {
      setTiempoInicio(new Date());
    } else if (!estaConectado && tiempoInicio) {
      setTiempoInicio(null);
    }

    const intervalo = setInterval(() => {
      if (tiempoInicio) {
        const ahora = new Date();
        const diff = ahora.getTime() - tiempoInicio.getTime();
        const segundos = Math.floor(diff / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);

        if (horas > 0) {
          setDuracionSesion(`${horas}h ${minutos % 60}m ${segundos % 60}s`);
        } else if (minutos > 0) {
          setDuracionSesion(`${minutos}m ${segundos % 60}s`);
        } else {
          setDuracionSesion(`${segundos}s`);
        }
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tiempoInicio, estaConectado]);

  // No renderizar en producción
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Network className="h-8 w-8" />
            Test WebSocket
          </h1>
          <p className="text-muted-foreground mt-1">
            Herramientas de desarrollo para probar y depurar WebSocket
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            Modo Desarrollo
          </Badge>
          <IndicadorEstadoConexion />
        </div>
      </div>

      {/* Advertencia de Desarrollo */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Modo de Desarrollo</AlertTitle>
        <AlertDescription>
          Esta página solo está disponible en modo desarrollo. Los eventos simulados
          no afectan datos reales del sistema.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="test" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test">Simulación</TabsTrigger>
          <TabsTrigger value="edge">Edge Cases</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnósticos</TabsTrigger>
        </TabsList>

        {/* Tab de Simulación */}
        <TabsContent value="test" className="space-y-6">
          <ModoTestWebSocket visible={true} />
        </TabsContent>

        {/* Tab de Edge Cases */}
        <TabsContent value="edge" className="space-y-6">
          <PruebasEdgeCase visible={true} />
        </TabsContent>

        {/* Tab de Métricas */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tiempo Conectado */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Tiempo Conectado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(metricas.tiempoConectado / 1000)}s
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tiempo total de conexión
                </p>
              </CardContent>
            </Card>

            {/* Última Conexión */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Última Conexión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metricas.ultimaConexion
                    ? new Date(metricas.ultimaConexion).toLocaleTimeString()
                    : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Hora de última conexión
                </p>
              </CardContent>
            </Card>

            {/* Eventos Recibidos */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Eventos Recibidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricas.eventosRecibidos}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total de eventos del servidor
                </p>
              </CardContent>
            </Card>

            {/* Eventos Emitidos */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Eventos Emitidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricas.eventosEnviados}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total de eventos enviados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Métricas de Rendimiento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Rendimiento
              </CardTitle>
              <CardDescription>
                Métricas de latencia y tiempo de conexión
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Latencia Actual
                  </div>
                  <div className="text-2xl font-bold">
                    {latencia !== null ? `${latencia}ms` : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {latencia !== null && latencia < 100 && (
                      <span className="text-green-500">Excelente</span>
                    )}
                    {latencia !== null && latencia >= 100 && latencia < 300 && (
                      <span className="text-yellow-500">Buena</span>
                    )}
                    {latencia !== null && latencia >= 300 && (
                      <span className="text-red-500">Lenta</span>
                    )}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Eventos Totales
                  </div>
                  <div className="text-2xl font-bold">
                    {metricas.eventosRecibidos + metricas.eventosEnviados}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Recibidos + Enviados
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Duración de Sesión
                  </div>
                  <div className="text-2xl font-bold">{duracionSesion}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {estaConectado ? 'Activa' : 'Inactiva'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historial de Conexiones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Historial
              </CardTitle>
              <CardDescription>
                Registro de conexiones y desconexiones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {metricas.ultimaConexion && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Última Conexión</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(metricas.ultimaConexion).toLocaleString()}
                  </span>
                </div>
              )}

              {estaConectado && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                    <span className="font-medium">Estado Actual</span>
                  </div>
                  <Badge variant="default">Conectado</Badge>
                </div>
              )}

              {!metricas.ultimaConexion && !estaConectado && (
                <div className="text-center text-muted-foreground py-8">
                  No hay historial de conexiones aún
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Diagnósticos */}
        <TabsContent value="diagnostics" className="space-y-6">
          {/* Estado Actual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Estado Actual
              </CardTitle>
              <CardDescription>
                Información detallada del estado de la conexión
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">
                    Estado de Conexión
                  </div>
                  <div className="flex items-center gap-2">
                    {estaConectado ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-lg font-semibold capitalize">
                      {estadoConexion}
                    </span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">
                    Intentos de Reconexión
                  </div>
                  <div className="text-lg font-semibold">
                    {intentosReconexion} / 5
                  </div>
                </div>
              </div>

              {ultimoError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Último Error</AlertTitle>
                  <AlertDescription className="mt-2">
                    <div className="space-y-1">
                      <div>
                        <strong>Mensaje:</strong> {ultimoError.message}
                      </div>
                      {ultimoError.stack && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm">
                            Ver stack trace
                          </summary>
                          <pre className="mt-2 text-xs bg-black/10 p-2 rounded overflow-x-auto">
                            {ultimoError.stack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {!ultimoError && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Sin Errores</AlertTitle>
                  <AlertDescription>
                    No se han detectado errores en la conexión WebSocket
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Información del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Información del Sistema
              </CardTitle>
              <CardDescription>
                Configuración y variables de entorno
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">WebSocket URL:</span>
                  <span className="font-semibold">
                    {process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000'}
                  </span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">API URL:</span>
                  <span className="font-semibold">
                    {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}
                  </span>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span className="text-muted-foreground">Entorno:</span>
                  <span className="font-semibold">{process.env.NODE_ENV}</span>
                </div>
                <div className="flex justify-between p-2">
                  <span className="text-muted-foreground">User Agent:</span>
                  <span className="font-semibold text-xs truncate max-w-md">
                    {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guía de Pruebas */}
          <Card>
            <CardHeader>
              <CardTitle>Guía de Pruebas</CardTitle>
              <CardDescription>
                Escenarios recomendados para probar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-1">1. Conexión sin datos</h4>
                  <p className="text-sm text-muted-foreground">
                    Mantén la conexión activa sin emitir eventos. Verifica que el
                    heartbeat mantiene la conexión estable.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-1">2. Reconexión automática</h4>
                  <p className="text-sm text-muted-foreground">
                    Usa el botón &quot;Desconectar&quot; y verifica que el sistema intenta
                    reconectar automáticamente con backoff exponencial.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-1">3. Simulación de eventos</h4>
                  <p className="text-sm text-muted-foreground">
                    Usa la simulación automática para generar eventos continuos y
                    verificar que no hay pérdida de datos.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-1">4. Múltiples pestañas</h4>
                  <p className="text-sm text-muted-foreground">
                    Abre esta página en múltiples pestañas y verifica que cada una
                    mantiene su propia conexión sin conflictos.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-1">5. Latencia</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitorea la latencia en la pestaña de métricas. Debe ser
                    consistentemente menor a 100ms en condiciones normales.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
