"use client";

/**
 * ModoTestWebSocket - Componente para probar y simular eventos WebSocket
 * 
 * Responsabilidades:
 * - Simular eventos WebSocket sin dispositivos reales
 * - Probar reconexión y manejo de errores
 * - Verificar comportamiento sin datos
 * - Proveer controles manuales para testing
 * 
 * Solo disponible en modo desarrollo
 */

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import {
  Play,
  Pause,
  RefreshCw,
  Zap,
  Activity,
  AlertTriangle,
  Bell,
  Power,
  Thermometer,
  Wifi,
  WifiOff,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import type {
  ActualizacionVoltajeDispositivo,
  ActualizacionCorrienteDispositivo,
  ActualizacionPotenciaDispositivo,
  ActualizacionConexionDispositivo,
  AlertaIoT,
  ResultadoComandoHardware,
  ActualizacionSensorHardware,
  NotificacionData,
} from '@/lib/websocket/tipos';

/**
 * Props del componente
 */
export interface ModoTestWebSocketProps {
  /** Si debe mostrarse el componente (solo en desarrollo) */
  visible?: boolean;
}

/**
 * Componente ModoTestWebSocket
 */
export function ModoTestWebSocket({ visible = true }: ModoTestWebSocketProps) {
  const { toast } = useToast();
  const {
    socket,
    estaConectado,
    estadoConexion,
    ultimoError,
    intentosReconexion,
    latencia,
    emitir,
    reconectar,
    desconectar,
  } = useWebSocket();

  // Estado local
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  const [eventosRecibidos, setEventosRecibidos] = useState<Array<{ evento: string; datos: any; timestamp: Date }>>([]);
  const [contadorEventos, setContadorEventos] = useState({
    voltaje: 0,
    corriente: 0,
    potencia: 0,
    alertas: 0,
    notificaciones: 0,
    hardware: 0,
  });

  /**
   * Generar datos simulados de voltaje
   */
  const simularVoltaje = () => {
    const datos: ActualizacionVoltajeDispositivo = {
      idDispositivo: 'test-device-001',
      voltaje: 220 + Math.random() * 10 - 5, // 215-225V
      fase: 'L1',
      calidad: Math.random() > 0.9 ? 'advertencia' : 'buena',
      ubicacion: 'Sala de Pruebas',
      marcaTiempo: new Date().toISOString(),
    };

    emitir('dispositivo:actualizacion_voltaje', datos);
    
    toast({
      title: 'Evento Simulado',
      description: `Voltaje: ${datos.voltaje.toFixed(2)}V`,
      duration: 2000,
    });

    setContadorEventos(prev => ({ ...prev, voltaje: prev.voltaje + 1 }));
  };

  /**
   * Generar datos simulados de corriente
   */
  const simularCorriente = () => {
    const datos: ActualizacionCorrienteDispositivo = {
      idDispositivo: 'test-device-001',
      corriente: 5 + Math.random() * 10, // 5-15A
      fase: 'L1',
      factorPotencia: 0.85 + Math.random() * 0.15,
      ubicacion: 'Sala de Pruebas',
      marcaTiempo: new Date().toISOString(),
    };

    emitir('dispositivo:actualizacion_corriente', datos);
    
    toast({
      title: 'Evento Simulado',
      description: `Corriente: ${datos.corriente.toFixed(2)}A`,
      duration: 2000,
    });

    setContadorEventos(prev => ({ ...prev, corriente: prev.corriente + 1 }));
  };

  /**
   * Generar datos simulados de potencia
   */
  const simularPotencia = () => {
    const potenciaActiva = 1000 + Math.random() * 2000; // 1-3kW
    const datos: ActualizacionPotenciaDispositivo = {
      idDispositivo: 'test-device-001',
      potenciaActiva,
      potenciaReactiva: potenciaActiva * 0.2,
      potenciaAparente: potenciaActiva * 1.1,
      energia: potenciaActiva * 0.001, // kWh
      costo: potenciaActiva * 0.001 * 0.15, // $0.15/kWh
      ubicacion: 'Sala de Pruebas',
      marcaTiempo: new Date().toISOString(),
    };

    emitir('dispositivo:actualizacion_potencia', datos);
    
    toast({
      title: 'Evento Simulado',
      description: `Potencia: ${datos.potenciaActiva.toFixed(0)}W`,
      duration: 2000,
    });

    setContadorEventos(prev => ({ ...prev, potencia: prev.potencia + 1 }));
  };

  /**
   * Generar alerta simulada
   */
  const simularAlerta = () => {
    const severidades: Array<'baja' | 'media' | 'alta' | 'critica'> = ['baja', 'media', 'alta', 'critica'];
    const tipos: Array<'umbral' | 'anomalia' | 'prediccion' | 'sistema'> = ['umbral', 'anomalia', 'prediccion', 'sistema'];
    
    const severidad = severidades[Math.floor(Math.random() * severidades.length)];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];

    const datos: AlertaIoT = {
      id: `alert-${Date.now()}`,
      idDispositivo: 'test-device-001',
      tipo,
      severidad,
      titulo: `Alerta de ${tipo}`,
      mensaje: `Alerta de prueba con severidad ${severidad}`,
      marcaTiempo: new Date().toISOString(),
      resuelta: false,
    };

    emitir('iot:alerta:nueva', datos);
    
    toast({
      title: 'Alerta Simulada',
      description: datos.mensaje,
      variant: severidad === 'critica' || severidad === 'alta' ? 'destructive' : 'default',
      duration: 3000,
    });

    setContadorEventos(prev => ({ ...prev, alertas: prev.alertas + 1 }));
  };

  /**
   * Generar notificación simulada
   */
  const simularNotificacion = () => {
    const tipos: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];

    const datos: NotificacionData = {
      id: `notif-${Date.now()}`,
      titulo: `Notificación de ${tipo}`,
      mensaje: `Esta es una notificación de prueba de tipo ${tipo}`,
      tipo,
      marcaTiempo: new Date().toISOString(),
    };

    emitir('notificacion:recibida', datos);
    
    toast({
      title: datos.titulo,
      description: datos.mensaje,
      variant: tipo === 'error' ? 'destructive' : 'default',
      duration: 3000,
    });

    setContadorEventos(prev => ({ ...prev, notificaciones: prev.notificaciones + 1 }));
  };

  /**
   * Simular resultado de comando hardware
   */
  const simularComandoHardware = () => {
    const exitoso = Math.random() > 0.2; // 80% éxito

    const datos: ResultadoComandoHardware = {
      idComando: `cmd-${Date.now()}`,
      idDispositivo: 'test-device-001',
      exitoso,
      resultado: exitoso ? { estado: 'completado', valor: 'OK' } : {},
      error: exitoso ? undefined : 'Error simulado de prueba',
      tiempoEjecucion: Math.random() * 1000,
    };

    emitir('hardware:resultado_comando', datos);
    
    toast({
      title: exitoso ? 'Comando Exitoso' : 'Comando Fallido',
      description: exitoso ? 'El comando se ejecutó correctamente' : datos.error,
      variant: exitoso ? 'default' : 'destructive',
      duration: 2000,
    });

    setContadorEventos(prev => ({ ...prev, hardware: prev.hardware + 1 }));
  };

  /**
   * Simular actualización de sensor
   */
  const simularSensor = () => {
    const tipos: Array<'temperatura' | 'humedad' | 'presion'> = ['temperatura', 'humedad', 'presion'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    
    let valor: number;
    let unidad: string;
    
    switch (tipo) {
      case 'temperatura':
        valor = 20 + Math.random() * 10; // 20-30°C
        unidad = '°C';
        break;
      case 'humedad':
        valor = 40 + Math.random() * 40; // 40-80%
        unidad = '%';
        break;
      case 'presion':
        valor = 1000 + Math.random() * 50; // 1000-1050 hPa
        unidad = 'hPa';
        break;
    }

    const datos: ActualizacionSensorHardware = {
      idDispositivo: 'test-device-001',
      idSensor: `sensor-${tipo}`,
      tipo,
      valor,
      unidad,
      ubicacion: 'Sala de Pruebas',
      marcaTiempo: new Date().toISOString(),
    };

    emitir('hardware:actualizacion_sensor', datos);
    
    toast({
      title: 'Sensor Actualizado',
      description: `${tipo}: ${valor.toFixed(1)}${unidad}`,
      duration: 2000,
    });

    setContadorEventos(prev => ({ ...prev, hardware: prev.hardware + 1 }));
  };

  /**
   * Simular cambio de estado de conexión de dispositivo
   */
  const simularCambioConexion = () => {
    const estados: Array<'conectado' | 'desconectado' | 'reconectando'> = ['conectado', 'desconectado', 'reconectando'];
    const estado = estados[Math.floor(Math.random() * estados.length)];

    const datos: ActualizacionConexionDispositivo = {
      idDispositivo: 'test-device-001',
      estado,
      ultimaVez: new Date(),
      metadatos: { razon: 'simulacion' },
      marcaTiempo: new Date().toISOString(),
    };

    emitir('dispositivo:actualizacion_conexion', datos);
    
    toast({
      title: 'Estado de Dispositivo',
      description: `Dispositivo ahora está: ${estado}`,
      variant: estado === 'desconectado' ? 'destructive' : 'default',
      duration: 2000,
    });
  };

  /**
   * Iniciar simulación automática
   */
  useEffect(() => {
    if (!simulacionActiva || !estaConectado) {
      return;
    }

    const intervalo = setInterval(() => {
      // Simular eventos aleatorios
      const eventos = [
        simularVoltaje,
        simularCorriente,
        simularPotencia,
        simularSensor,
      ];

      // Ejecutar 1-3 eventos aleatorios
      const numEventos = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numEventos; i++) {
        const eventoAleatorio = eventos[Math.floor(Math.random() * eventos.length)];
        eventoAleatorio();
      }

      // Ocasionalmente simular alertas (10% de probabilidad)
      if (Math.random() < 0.1) {
        simularAlerta();
      }
    }, 3000); // Cada 3 segundos

    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulacionActiva, estaConectado]);

  /**
   * Escuchar todos los eventos para logging
   */
  useEffect(() => {
    if (!socket) return;

    const eventos = [
      'dispositivo:actualizacion_voltaje',
      'dispositivo:actualizacion_corriente',
      'dispositivo:actualizacion_potencia',
      'dispositivo:actualizacion_conexion',
      'iot:alerta:nueva',
      'notificacion:recibida',
      'hardware:resultado_comando',
      'hardware:actualizacion_sensor',
    ];

    const manejador = (evento: string) => (datos: any) => {
      setEventosRecibidos(prev => [
        { evento, datos, timestamp: new Date() },
        ...prev.slice(0, 49), // Mantener solo últimos 50
      ]);
    };

    eventos.forEach(evento => {
      socket.on(evento, manejador(evento));
    });

    return () => {
      eventos.forEach(evento => {
        socket.off(evento);
      });
    };
  }, [socket]);

  /**
   * Limpiar contadores
   */
  const limpiarContadores = () => {
    setContadorEventos({
      voltaje: 0,
      corriente: 0,
      potencia: 0,
      alertas: 0,
      notificaciones: 0,
      hardware: 0,
    });
    setEventosRecibidos([]);
  };

  /**
   * Simular desconexión forzada
   */
  const simularDesconexion = () => {
    desconectar();
    toast({
      title: 'Desconexión Simulada',
      description: 'La conexión se ha cerrado para probar reconexión',
      variant: 'default',
    });
  };

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development' || !visible) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Modo Test WebSocket
            </CardTitle>
            <CardDescription>
              Herramientas para probar y simular eventos WebSocket
            </CardDescription>
          </div>
          <Badge variant={estaConectado ? 'default' : 'destructive'}>
            {estadoConexion}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estado de Conexión */}
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {estaConectado ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>
                Estado: <strong>{estadoConexion}</strong>
              </span>
              {latencia !== null && (
                <>
                  <span className="mx-2">|</span>
                  <Clock className="h-4 w-4" />
                  <span>Latencia: {latencia}ms</span>
                </>
              )}
              {intentosReconexion > 0 && (
                <>
                  <span className="mx-2">|</span>
                  <RefreshCw className="h-4 w-4" />
                  <span>Intentos: {intentosReconexion}</span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={reconectar}
                disabled={estaConectado}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reconectar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={simularDesconexion}
                disabled={!estaConectado}
              >
                <WifiOff className="h-4 w-4 mr-1" />
                Desconectar
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {ultimoError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {ultimoError.message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="auto">Automático</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          {/* Simulación Manual */}
          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                onClick={simularVoltaje}
                disabled={!estaConectado}
                variant="outline"
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Voltaje ({contadorEventos.voltaje})
              </Button>

              <Button
                onClick={simularCorriente}
                disabled={!estaConectado}
                variant="outline"
                className="w-full"
              >
                <Activity className="h-4 w-4 mr-2" />
                Corriente ({contadorEventos.corriente})
              </Button>

              <Button
                onClick={simularPotencia}
                disabled={!estaConectado}
                variant="outline"
                className="w-full"
              >
                <Power className="h-4 w-4 mr-2" />
                Potencia ({contadorEventos.potencia})
              </Button>

              <Button
                onClick={simularAlerta}
                disabled={!estaConectado}
                variant="outline"
                className="w-full"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Alerta ({contadorEventos.alertas})
              </Button>

              <Button
                onClick={simularNotificacion}
                disabled={!estaConectado}
                variant="outline"
                className="w-full"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notificación ({contadorEventos.notificaciones})
              </Button>

              <Button
                onClick={simularComandoHardware}
                disabled={!estaConectado}
                variant="outline"
                className="w-full"
              >
                <Wifi className="h-4 w-4 mr-2" />
                Hardware ({contadorEventos.hardware})
              </Button>

              <Button
                onClick={simularSensor}
                disabled={!estaConectado}
                variant="outline"
                className="w-full"
              >
                <Thermometer className="h-4 w-4 mr-2" />
                Sensor
              </Button>

              <Button
                onClick={simularCambioConexion}
                disabled={!estaConectado}
                variant="outline"
                className="w-full"
              >
                <Wifi className="h-4 w-4 mr-2" />
                Conexión
              </Button>

              <Button
                onClick={limpiarContadores}
                variant="outline"
                className="w-full"
              >
                Limpiar
              </Button>
            </div>
          </TabsContent>

          {/* Simulación Automática */}
          <TabsContent value="auto" className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Simulación Automática</h3>
                <p className="text-sm text-muted-foreground">
                  Genera eventos aleatorios cada 3 segundos
                </p>
              </div>
              <Button
                onClick={() => setSimulacionActiva(!simulacionActiva)}
                disabled={!estaConectado}
                variant={simulacionActiva ? 'destructive' : 'default'}
              >
                {simulacionActiva ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Detener
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>
            </div>

            {simulacionActiva && (
              <Alert>
                <Activity className="h-4 w-4 animate-pulse" />
                <AlertDescription>
                  Simulación activa - Generando eventos automáticamente...
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{contadorEventos.voltaje}</div>
                <div className="text-sm text-muted-foreground">Voltaje</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{contadorEventos.corriente}</div>
                <div className="text-sm text-muted-foreground">Corriente</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{contadorEventos.potencia}</div>
                <div className="text-sm text-muted-foreground">Potencia</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{contadorEventos.alertas}</div>
                <div className="text-sm text-muted-foreground">Alertas</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{contadorEventos.notificaciones}</div>
                <div className="text-sm text-muted-foreground">Notificaciones</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{contadorEventos.hardware}</div>
                <div className="text-sm text-muted-foreground">Hardware</div>
              </div>
            </div>
          </TabsContent>

          {/* Logs de Eventos */}
          <TabsContent value="logs" className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Últimos Eventos Recibidos</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEventosRecibidos([])}
              >
                Limpiar
              </Button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {eventosRecibidos.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No hay eventos recibidos aún
                </div>
              ) : (
                eventosRecibidos.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg text-sm space-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">{item.evento}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(item.datos, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
