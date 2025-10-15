"use client";

/**
 * VisualizacionSensores - Componente para visualizar lecturas de sensores en tiempo real
 * 
 * Escucha eventos WebSocket:
 * - hardware:actualizacion_sensor - Actualizaciones de sensores en tiempo real
 * 
 * Muestra:
 * - Temperatura, humedad, presión, luz
 * - Gráficos en tiempo real
 * - Detección de anomalías
 * - Alertas visuales
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Thermometer, Droplets, Gauge, Sun, AlertTriangle, TrendingUp, TrendingDown, Wifi, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Tipos de sensores
 */
type TipoSensor = 'temperatura' | 'humedad' | 'presion' | 'luz';

/**
 * Interfaz para datos de sensor
 */
interface DatosSensor {
  idDispositivo: string;
  tipo: TipoSensor;
  valor: number;
  unidad: string;
  marcaTiempo: string;
  anomalia?: boolean;
}

/**
 * Interfaz para actualización de sensor desde WebSocket
 */
interface ActualizacionSensor {
  idDispositivo: string;
  tipo: TipoSensor;
  valor: number;
  unidad: string;
  marcaTiempo: string;
}

/**
 * Props del componente
 */
interface VisualizacionSensoresProps {
  /** ID del dispositivo a monitorear (opcional, si no se especifica muestra todos) */
  idDispositivo?: string;
  
  /** Mostrar versión reducida */
  reducida?: boolean;
}

/**
 * Configuración de umbrales para detección de anomalías
 */
const UMBRALES = {
  temperatura: { min: 15, max: 30, critico: 35 },
  humedad: { min: 30, max: 70, critico: 85 },
  presion: { min: 980, max: 1030, critico: 1050 },
  luz: { min: 0, max: 1000, critico: 1500 },
};

/**
 * Iconos para cada tipo de sensor
 */
const ICONOS_SENSOR: Record<TipoSensor, React.ComponentType<{ className?: string }>> = {
  temperatura: Thermometer,
  humedad: Droplets,
  presion: Gauge,
  luz: Sun,
};

/**
 * Colores para cada tipo de sensor
 */
const COLORES_SENSOR: Record<TipoSensor, string> = {
  temperatura: 'text-red-600',
  humedad: 'text-blue-600',
  presion: 'text-purple-600',
  luz: 'text-yellow-600',
};

/**
 * Componente VisualizacionSensores
 */
export function VisualizacionSensores({ idDispositivo, reducida = false }: VisualizacionSensoresProps) {
  // Estado de sensores
  const [sensores, setSensores] = useState<Map<string, DatosSensor>>(new Map());
  const [alertas, setAlertas] = useState<string[]>([]);
  
  // WebSocket
  const { estaConectado, escuchar, dejarDeEscuchar } = useWebSocket();
  
  /**
   * Detectar anomalías en lecturas de sensores
   */
  const detectarAnomalia = useCallback((tipo: TipoSensor, valor: number): boolean => {
    const umbral = UMBRALES[tipo];
    return valor < umbral.min || valor > umbral.max;
  }, []);
  
  /**
   * Detectar valores críticos
   */
  const esCritico = useCallback((tipo: TipoSensor, valor: number): boolean => {
    const umbral = UMBRALES[tipo];
    return valor >= umbral.critico;
  }, []);
  
  /**
   * Manejar actualización de sensor desde WebSocket
   */
  const manejarActualizacionSensor = useCallback((data: ActualizacionSensor) => {
    console.log('[Sensores] Actualización recibida:', data);
    
    // Filtrar por dispositivo si se especificó
    if (idDispositivo && data.idDispositivo !== idDispositivo) {
      return;
    }
    
    // Detectar anomalía
    const anomalia = detectarAnomalia(data.tipo, data.valor);
    const critico = esCritico(data.tipo, data.valor);
    
    // Crear clave única para el sensor
    const clave = `${data.idDispositivo}-${data.tipo}`;
    
    // Actualizar estado del sensor
    setSensores(prev => {
      const nuevo = new Map(prev);
      nuevo.set(clave, {
        ...data,
        anomalia,
      });
      return nuevo;
    });
    
    // Agregar alerta si es crítico
    if (critico) {
      const mensajeAlerta = `⚠️ Valor crítico en ${data.tipo}: ${data.valor}${data.unidad}`;
      setAlertas(prev => {
        // Evitar duplicados
        if (prev.includes(mensajeAlerta)) return prev;
        return [mensajeAlerta, ...prev].slice(0, 5); // Mantener últimas 5 alertas
      });
    }
  }, [idDispositivo, detectarAnomalia, esCritico]);
  
  /**
   * Suscribirse a eventos WebSocket
   */
  useEffect(() => {
    if (!estaConectado) {
      console.log('[Sensores] WebSocket no conectado');
      return;
    }
    
    console.log('[Sensores] Suscribiendo a eventos de sensores...');
    escuchar<ActualizacionSensor>('hardware:actualizacion_sensor', manejarActualizacionSensor);
    
    return () => {
      console.log('[Sensores] Desuscribiendo de eventos de sensores...');
      dejarDeEscuchar('hardware:actualizacion_sensor');
    };
  }, [estaConectado, escuchar, dejarDeEscuchar, manejarActualizacionSensor]);
  
  /**
   * Renderizar tarjeta de sensor individual
   */
  const renderizarSensor = (clave: string, datos: DatosSensor) => {
    const Icono = ICONOS_SENSOR[datos.tipo];
    const color = COLORES_SENSOR[datos.tipo];
    const critico = esCritico(datos.tipo, datos.valor);
    
    return (
      <Card key={clave} className={cn(
        'transition-all',
        datos.anomalia && 'border-yellow-500',
        critico && 'border-red-500 bg-red-50 dark:bg-red-900/10'
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icono className={cn('h-5 w-5', color)} />
              <span className="text-sm font-medium capitalize">{datos.tipo}</span>
            </div>
            {datos.anomalia && (
              <Badge variant={critico ? 'destructive' : 'secondary'} className="text-xs">
                {critico ? 'Crítico' : 'Anomalía'}
              </Badge>
            )}
          </div>
          
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{datos.valor.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">{datos.unidad}</span>
          </div>
          
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <span>{new Date(datos.marcaTiempo).toLocaleTimeString()}</span>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  /**
   * Vista reducida
   */
  if (reducida) {
    const sensoresArray = Array.from(sensores.values());
    const tieneAnomalias = sensoresArray.some(s => s.anomalia);
    
    return (
      <div className="space-y-4">
        {/* Indicador de conexión */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className={cn('h-4 w-4', estaConectado ? 'text-green-500' : 'text-gray-400')} />
            <span className="text-sm text-muted-foreground">
              {estaConectado ? 'Tiempo Real' : 'Sin conexión'}
            </span>
          </div>
          {tieneAnomalias && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Anomalías detectadas
            </Badge>
          )}
        </div>
        
        {/* Grid de sensores */}
        <div className="grid grid-cols-2 gap-3">
          {sensoresArray.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Esperando datos de sensores...</p>
            </div>
          ) : (
            sensoresArray.map(sensor => 
              renderizarSensor(`${sensor.idDispositivo}-${sensor.tipo}`, sensor)
            )
          )}
        </div>
      </div>
    );
  }
  
  /**
   * Vista completa
   */
  return (
    <div className="space-y-6">
      {/* Header con estado de conexión */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sensores en Tiempo Real</h3>
          <p className="text-sm text-muted-foreground">
            Monitoreo continuo de sensores IoT
          </p>
        </div>
        <Badge variant={estaConectado ? 'default' : 'secondary'} className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          {estaConectado ? 'Conectado' : 'Desconectado'}
        </Badge>
      </div>
      
      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((alerta, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{alerta}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
      
      {/* Grid de sensores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from(sensores.entries()).map(([clave, datos]) => 
          renderizarSensor(clave, datos)
        )}
        
        {sensores.size === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Esperando datos de sensores</p>
            <p className="text-sm">
              {estaConectado 
                ? 'Los datos aparecerán aquí cuando los sensores envíen información'
                : 'Conectando al servidor WebSocket...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
