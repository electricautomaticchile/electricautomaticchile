"use client";

/**
 * EstadoDispositivosRealTime - Componente para monitorear estado de conexión de dispositivos
 * 
 * Escucha eventos WebSocket:
 * - dispositivo:actualizacion_conexion - Cambios de estado de conexión
 * 
 * Muestra:
 * - Indicadores online/offline
 * - Última vez visto
 * - Alertas cuando dispositivo se desconecta
 * - Historial de conexiones
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wifi, 
  WifiOff, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Activity,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Estado de conexión de dispositivo
 */
type EstadoConexion = 'conectado' | 'desconectado' | 'reconectando';

/**
 * Interfaz para datos de dispositivo
 */
interface DatosDispositivo {
  idDispositivo: string;
  nombre?: string;
  estado: EstadoConexion;
  ultimaVez: Date;
  metadatos?: {
    ubicacion?: string;
    tipo?: string;
    cliente?: string;
  };
  marcaTiempo: string;
}

/**
 * Interfaz para actualización de conexión desde WebSocket
 */
interface ActualizacionConexionDispositivo {
  idDispositivo: string;
  estado: EstadoConexion;
  ultimaVez: Date;
  metadatos?: Record<string, any>;
  marcaTiempo: string;
}

/**
 * Props del componente
 */
interface EstadoDispositivosRealTimeProps {
  /** Mostrar versión reducida */
  reducida?: boolean;
  
  /** Filtrar por cliente específico */
  idCliente?: string;
}

/**
 * Componente EstadoDispositivosRealTime
 */
export function EstadoDispositivosRealTime({ reducida = false, idCliente }: EstadoDispositivosRealTimeProps) {
  // Estado de dispositivos
  const [dispositivos, setDispositivos] = useState<Map<string, DatosDispositivo>>(new Map());
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date>(new Date());
  
  // WebSocket
  const { estaConectado, escuchar, dejarDeEscuchar } = useWebSocket();
  const { toast } = useToast();
  
  /**
   * Formatear tiempo relativo (ej: "hace 2 minutos")
   */
  const formatearTiempoRelativo = useCallback((fecha: Date): string => {
    const ahora = new Date();
    const diferencia = ahora.getTime() - new Date(fecha).getTime();
    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (segundos < 60) return 'Ahora';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas} h`;
    return `Hace ${dias} días`;
  }, []);
  
  /**
   * Manejar actualización de conexión desde WebSocket
   */
  const manejarActualizacionConexion = useCallback((data: ActualizacionConexionDispositivo) => {
    console.log('[Estado Dispositivos] Actualización recibida:', data);
    
    // Filtrar por cliente si se especificó
    if (idCliente && data.metadatos?.cliente !== idCliente) {
      return;
    }
    
    // Obtener estado anterior
    const dispositivoAnterior = dispositivos.get(data.idDispositivo);
    
    // Actualizar estado del dispositivo
    setDispositivos(prev => {
      const nuevo = new Map(prev);
      nuevo.set(data.idDispositivo, {
        idDispositivo: data.idDispositivo,
        nombre: data.metadatos?.nombre || data.idDispositivo,
        estado: data.estado,
        ultimaVez: new Date(data.ultimaVez),
        metadatos: data.metadatos,
        marcaTiempo: data.marcaTiempo,
      });
      return nuevo;
    });
    
    setUltimaActualizacion(new Date());
    
    // Mostrar notificación si cambió el estado
    if (dispositivoAnterior && dispositivoAnterior.estado !== data.estado) {
      if (data.estado === 'desconectado') {
        toast({
          title: 'Dispositivo desconectado',
          description: `${data.metadatos?.nombre || data.idDispositivo} se ha desconectado`,
          variant: 'destructive',
        });
      } else if (data.estado === 'conectado' && dispositivoAnterior.estado === 'desconectado') {
        toast({
          title: 'Dispositivo reconectado',
          description: `${data.metadatos?.nombre || data.idDispositivo} está ahora conectado`,
        });
      }
    }
  }, [idCliente, dispositivos, toast]);
  
  /**
   * Suscribirse a eventos WebSocket
   */
  useEffect(() => {
    if (!estaConectado) {
      console.log('[Estado Dispositivos] WebSocket no conectado');
      return;
    }
    
    console.log('[Estado Dispositivos] Suscribiendo a eventos de conexión...');
    escuchar<ActualizacionConexionDispositivo>('dispositivo:actualizacion_conexion', manejarActualizacionConexion);
    
    return () => {
      console.log('[Estado Dispositivos] Desuscribiendo de eventos de conexión...');
      dejarDeEscuchar('dispositivo:actualizacion_conexion');
    };
  }, [estaConectado, escuchar, dejarDeEscuchar, manejarActualizacionConexion]);
  
  /**
   * Calcular estadísticas
   */
  const estadisticas = React.useMemo(() => {
    const dispositivosArray = Array.from(dispositivos.values());
    const conectados = dispositivosArray.filter(d => d.estado === 'conectado').length;
    const desconectados = dispositivosArray.filter(d => d.estado === 'desconectado').length;
    const reconectando = dispositivosArray.filter(d => d.estado === 'reconectando').length;
    const total = dispositivosArray.length;
    
    return { conectados, desconectados, reconectando, total };
  }, [dispositivos]);
  
  /**
   * Renderizar tarjeta de dispositivo individual
   */
  const renderizarDispositivo = (dispositivo: DatosDispositivo) => {
    const IconoEstado = dispositivo.estado === 'conectado' ? CheckCircle2 : 
                        dispositivo.estado === 'reconectando' ? RefreshCw : AlertCircle;
    const colorEstado = dispositivo.estado === 'conectado' ? 'text-green-600' : 
                        dispositivo.estado === 'reconectando' ? 'text-yellow-600' : 'text-red-600';
    const bgEstado = dispositivo.estado === 'conectado' ? 'bg-green-50 dark:bg-green-900/10' : 
                     dispositivo.estado === 'reconectando' ? 'bg-yellow-50 dark:bg-yellow-900/10' : 'bg-red-50 dark:bg-red-900/10';
    
    return (
      <Card key={dispositivo.idDispositivo} className={cn('transition-all', bgEstado)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconoEstado className={cn('h-5 w-5', colorEstado, dispositivo.estado === 'reconectando' && 'animate-spin')} />
              <div>
                <p className="font-medium text-sm">{dispositivo.nombre || dispositivo.idDispositivo}</p>
                {dispositivo.metadatos?.ubicacion && (
                  <p className="text-xs text-muted-foreground">{dispositivo.metadatos.ubicacion}</p>
                )}
              </div>
            </div>
            <Badge variant={dispositivo.estado === 'conectado' ? 'default' : 'secondary'} className="capitalize">
              {dispositivo.estado}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Última vez: {formatearTiempoRelativo(dispositivo.ultimaVez)}</span>
          </div>
          
          {dispositivo.metadatos?.cliente && (
            <div className="mt-2 text-xs text-muted-foreground">
              Cliente: {dispositivo.metadatos.cliente}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  /**
   * Vista reducida
   */
  if (reducida) {
    return (
      <div className="space-y-4">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-600">{estadisticas.conectados}</p>
            <p className="text-xs text-muted-foreground">Conectados</p>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-600">{estadisticas.desconectados}</p>
            <p className="text-xs text-muted-foreground">Desconectados</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
            <RefreshCw className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-yellow-600">{estadisticas.reconectando}</p>
            <p className="text-xs text-muted-foreground">Reconectando</p>
          </div>
        </div>
        
        {/* Indicador de WebSocket */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Wifi className={cn('h-4 w-4', estaConectado ? 'text-green-500' : 'text-gray-400')} />
            <span className="text-muted-foreground">
              {estaConectado ? 'Monitoreo activo' : 'Sin conexión'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Actualizado: {formatearTiempoRelativo(ultimaActualizacion)}
          </span>
        </div>
      </div>
    );
  }
  
  /**
   * Vista completa
   */
  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Estado de Dispositivos</h3>
          <p className="text-sm text-muted-foreground">
            Monitoreo en tiempo real de {estadisticas.total} dispositivos
          </p>
        </div>
        <Badge variant={estaConectado ? 'default' : 'secondary'} className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          {estaConectado ? 'Conectado' : 'Desconectado'}
        </Badge>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-900/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conectados</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.conectados}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 dark:bg-red-900/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Desconectados</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.desconectados}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reconectando</p>
                <p className="text-2xl font-bold text-yellow-600">{estadisticas.reconectando}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Lista de dispositivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from(dispositivos.values()).map(dispositivo => 
          renderizarDispositivo(dispositivo)
        )}
        
        {dispositivos.size === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Esperando datos de dispositivos</p>
            <p className="text-sm">
              {estaConectado 
                ? 'Los dispositivos aparecerán aquí cuando se conecten'
                : 'Conectando al servidor WebSocket...'}
            </p>
          </div>
        )}
      </div>
      
      {/* Footer con última actualización */}
      <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Última actualización: {formatearTiempoRelativo(ultimaActualizacion)}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setUltimaActualizacion(new Date())}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>
    </div>
  );
}
