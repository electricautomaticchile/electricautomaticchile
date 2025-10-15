"use client";

/**
 * PruebasEdgeCase - Componente para ejecutar pruebas de casos extremos
 * 
 * Responsabilidades:
 * - Ejecutar pruebas de escenarios edge case
 * - Mostrar resultados de las pruebas
 * - Proveer controles para pruebas individuales
 * 
 * Solo disponible en modo desarrollo
 */

import { useState } from 'react';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import { TokenManager } from '@/lib/api/utils/tokenManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Network,
  Zap,
  Users,
  Key,
  Server,
  Activity,
  MemoryStick,
  Terminal,
} from 'lucide-react';
import {
  simularDesconexionTemporal,
  probarTokenExpirado,
  probarRafagaEventos,
  verificarConsola,
  verificarMemoria,
  ejecutarSuitePruebas,
  simularRedLenta,
  type ResultadoPrueba,
  type OpcionesRedLenta,
} from '@/lib/websocket/testUtils';

/**
 * Props del componente
 */
export interface PruebasEdgeCaseProps {
  /** Si debe mostrarse el componente (solo en desarrollo) */
  visible?: boolean;
}

/**
 * Componente PruebasEdgeCase
 */
export function PruebasEdgeCase({ visible = true }: PruebasEdgeCaseProps) {
  const { socket, estaConectado, emitir } = useWebSocket();
  
  const [ejecutando, setEjecutando] = useState(false);
  const [resultados, setResultados] = useState<ResultadoPrueba[]>([]);
  const [pruebaActual, setPruebaActual] = useState<string | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [redLentaActiva, setRedLentaActiva] = useState(false);
  const [cleanupRedLenta, setCleanupRedLenta] = useState<(() => void) | null>(null);

  /**
   * Ejecutar una prueba individual
   */
  const ejecutarPrueba = async (
    nombre: string,
    prueba: () => Promise<ResultadoPrueba>
  ) => {
    setEjecutando(true);
    setPruebaActual(nombre);
    
    try {
      const resultado = await prueba();
      setResultados(prev => [...prev, resultado]);
    } catch (error) {
      setResultados(prev => [
        ...prev,
        {
          nombre,
          exitoso: false,
          mensaje: `Error inesperado: ${(error as Error).message}`,
          duracion: 0,
        },
      ]);
    } finally {
      setEjecutando(false);
      setPruebaActual(null);
    }
  };

  /**
   * Ejecutar suite completa
   */
  const ejecutarSuiteCompleta = async () => {
    setEjecutando(true);
    setResultados([]);
    setProgreso(0);
    
    const token = TokenManager.getToken() || 'test-token';
    const totalPruebas = 7;
    let completadas = 0;

    const actualizarProgreso = () => {
      completadas++;
      setProgreso((completadas / totalPruebas) * 100);
    };

    try {
      // 1. Desconexión temporal
      if (socket) {
        setPruebaActual('Desconexión Temporal');
        const resultado1 = await simularDesconexionTemporal(socket, 3000);
        setResultados(prev => [...prev, resultado1]);
        actualizarProgreso();
      }

      // 2. Token expirado
      setPruebaActual('Token Expirado');
      const resultado2 = await probarTokenExpirado(async (token) => {
        // Simular intento de conexión con token inválido
        throw new Error('Unauthorized: Invalid token');
      });
      setResultados(prev => [...prev, resultado2]);
      actualizarProgreso();

      // 3. Ráfaga de eventos
      if (socket && estaConectado) {
        setPruebaActual('Ráfaga de Eventos');
        const resultado3 = await probarRafagaEventos(emitir, 100);
        setResultados(prev => [...prev, resultado3]);
        actualizarProgreso();
      }

      // 4. Verificar consola
      setPruebaActual('Verificación de Consola');
      const resultado4 = verificarConsola();
      setResultados(prev => [...prev, resultado4]);
      actualizarProgreso();

      // 5. Verificar memoria
      setPruebaActual('Uso de Memoria');
      const resultado5 = verificarMemoria();
      setResultados(prev => [...prev, resultado5]);
      actualizarProgreso();

      // 6. Prueba de latencia
      if (socket && estaConectado) {
        setPruebaActual('Prueba de Latencia');
        const inicio = Date.now();
        
        await new Promise<void>((resolve) => {
          socket.emit('ping', { timestamp: inicio });
          socket.once('pong', () => {
            const latencia = Date.now() - inicio;
            setResultados(prev => [
              ...prev,
              {
                nombre: 'Prueba de Latencia',
                exitoso: latencia < 200,
                mensaje: `Latencia: ${latencia}ms`,
                detalles: { latencia },
                duracion: latencia,
              },
            ]);
            resolve();
          });
          
          // Timeout
          setTimeout(() => {
            setResultados(prev => [
              ...prev,
              {
                nombre: 'Prueba de Latencia',
                exitoso: false,
                mensaje: 'Timeout esperando respuesta',
                duracion: Date.now() - inicio,
              },
            ]);
            resolve();
          }, 5000);
        });
        actualizarProgreso();
      }

      // 7. Verificar listeners (memory leaks)
      setPruebaActual('Verificación de Listeners');
      if (socket) {
        const listenerCount = socket.listeners('connect').length +
                            socket.listeners('disconnect').length +
                            socket.listeners('error').length;
        
        setResultados(prev => [
          ...prev,
          {
            nombre: 'Verificación de Listeners',
            exitoso: listenerCount < 50, // Threshold arbitrario
            mensaje: `${listenerCount} listeners registrados`,
            detalles: { listenerCount },
            duracion: 0,
          },
        ]);
      }
      actualizarProgreso();

    } catch (error) {
      console.error('[PruebasEdgeCase] Error en suite:', error);
    } finally {
      setEjecutando(false);
      setPruebaActual(null);
      setProgreso(100);
    }
  };

  /**
   * Activar/desactivar simulación de red lenta
   */
  const toggleRedLenta = () => {
    if (redLentaActiva && cleanupRedLenta) {
      cleanupRedLenta();
      setCleanupRedLenta(null);
      setRedLentaActiva(false);
    } else if (socket) {
      const opciones: OpcionesRedLenta = {
        delay: 500, // 500ms delay
        perdidaPaquetes: 0.1, // 10% pérdida
      };
      
      const cleanup = simularRedLenta(socket, opciones);
      setCleanupRedLenta(() => cleanup);
      setRedLentaActiva(true);
      
      setResultados(prev => [
        ...prev,
        {
          nombre: 'Red Lenta Activada',
          exitoso: true,
          mensaje: `Delay: ${opciones.delay}ms, Pérdida: ${(opciones.perdidaPaquetes || 0) * 100}%`,
          duracion: 0,
        },
      ]);
    }
  };

  /**
   * Limpiar resultados
   */
  const limpiarResultados = () => {
    setResultados([]);
    setProgreso(0);
  };

  /**
   * Calcular estadísticas
   */
  const exitosos = resultados.filter(r => r.exitoso).length;
  const fallidos = resultados.filter(r => !r.exitoso).length;
  const duracionTotal = resultados.reduce((sum, r) => sum + r.duracion, 0);

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development' || !visible) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Controles Principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Pruebas de Casos Extremos
          </CardTitle>
          <CardDescription>
            Ejecuta pruebas para verificar el comportamiento en escenarios adversos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={ejecutarSuiteCompleta}
              disabled={ejecutando || !estaConectado}
              className="flex-1"
            >
              {ejecutando ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Ejecutar Suite Completa
                </>
              )}
            </Button>

            <Button
              onClick={limpiarResultados}
              variant="outline"
              disabled={ejecutando}
            >
              Limpiar Resultados
            </Button>
          </div>

          {ejecutando && pruebaActual && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Ejecutando: <strong>{pruebaActual}</strong>
                </span>
                <span className="text-muted-foreground">
                  {progreso.toFixed(0)}%
                </span>
              </div>
              <Progress value={progreso} className="h-2" />
            </div>
          )}

          {!estaConectado && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Debes estar conectado para ejecutar las pruebas
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Pruebas Individuales */}
      <Card>
        <CardHeader>
          <CardTitle>Pruebas Individuales</CardTitle>
          <CardDescription>
            Ejecuta pruebas específicas de forma individual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() =>
                ejecutarPrueba('Desconexión Temporal', () =>
                  simularDesconexionTemporal(socket, 3000)
                )
              }
              disabled={ejecutando || !socket}
              className="justify-start"
            >
              <Network className="h-4 w-4 mr-2" />
              Desconexión Temporal
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                ejecutarPrueba('Ráfaga de Eventos', () =>
                  probarRafagaEventos(emitir, 100)
                )
              }
              disabled={ejecutando || !estaConectado}
              className="justify-start"
            >
              <Activity className="h-4 w-4 mr-2" />
              Ráfaga de Eventos
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                ejecutarPrueba('Verificar Consola', async () =>
                  verificarConsola()
                )
              }
              disabled={ejecutando}
              className="justify-start"
            >
              <Terminal className="h-4 w-4 mr-2" />
              Verificar Consola
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                ejecutarPrueba('Uso de Memoria', async () =>
                  verificarMemoria()
                )
              }
              disabled={ejecutando}
              className="justify-start"
            >
              <MemoryStick className="h-4 w-4 mr-2" />
              Uso de Memoria
            </Button>

            <Button
              variant="outline"
              onClick={toggleRedLenta}
              disabled={ejecutando || !socket}
              className="justify-start"
            >
              <Server className="h-4 w-4 mr-2" />
              {redLentaActiva ? 'Desactivar' : 'Activar'} Red Lenta
            </Button>
          </div>

          {redLentaActiva && (
            <Alert className="mt-4">
              <Activity className="h-4 w-4 animate-pulse" />
              <AlertDescription>
                Red lenta activa - Los eventos tendrán 500ms de delay y 10% de pérdida
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      {resultados.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resultados</CardTitle>
                <CardDescription>
                  {exitosos} exitosas, {fallidos} fallidas, {duracionTotal.toFixed(0)}ms total
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {exitosos}
                </Badge>
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  {fallidos}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resultados.map((resultado, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    resultado.exitoso
                      ? 'border-green-200 bg-green-50 dark:bg-green-950/20'
                      : 'border-red-200 bg-red-50 dark:bg-red-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {resultado.exitoso ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-semibold">{resultado.nombre}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {resultado.duracion.toFixed(0)}ms
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground ml-7">
                    {resultado.mensaje}
                  </p>
                  
                  {resultado.detalles && (
                    <details className="mt-2 ml-7">
                      <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                        Ver detalles
                      </summary>
                      <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(resultado.detalles, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guía de Interpretación */}
      <Card>
        <CardHeader>
          <CardTitle>Guía de Interpretación</CardTitle>
          <CardDescription>
            Cómo interpretar los resultados de las pruebas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Desconexión Temporal:</strong> Debe reconectar automáticamente
                en menos de 10 segundos.
              </div>
            </div>
            
            <div className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Token Expirado:</strong> Debe rechazar tokens inválidos y
                mostrar error de autenticación.
              </div>
            </div>
            
            <div className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Ráfaga de Eventos:</strong> Debe manejar 100+ eventos por
                segundo sin pérdida de datos.
              </div>
            </div>
            
            <div className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Latencia:</strong> Debe ser menor a 200ms en condiciones
                normales.
              </div>
            </div>
            
            <div className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Memoria:</strong> El uso debe mantenerse estable sin
                incrementos continuos (memory leaks).
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
