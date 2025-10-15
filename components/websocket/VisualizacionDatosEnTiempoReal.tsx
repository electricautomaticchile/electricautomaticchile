"use client";

/**
 * VisualizacionDatosEnTiempoReal - Componente para mostrar datos en tiempo real
 * 
 * Responsabilidades:
 * - Mostrar datos en tiempo real cuando están disponibles
 * - Mostrar último estado conocido cuando offline
 * - Agregar timestamp de última actualización
 * - Manejar estados de carga apropiadamente
 * - Degradar gracefully cuando no hay WebSocket
 * 
 * Este es un componente genérico que puede ser usado para mostrar
 * cualquier tipo de datos en tiempo real con indicadores de estado.
 */

import React, { ReactNode } from 'react';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, Wifi, WifiOff, Loader2 } from 'lucide-react';

export interface VisualizacionDatosEnTiempoRealProps {
  /** Título del componente */
  titulo?: string;
  
  /** Contenido a mostrar (datos) */
  children: ReactNode;
  
  /** Timestamp de la última actualización */
  ultimaActualizacion?: Date | string | null;
  
  /** Indica si los datos están cargando */
  cargando?: boolean;
  
  /** Mensaje a mostrar cuando no hay datos */
  mensajeSinDatos?: string;
  
  /** Mostrar indicador de conexión */
  mostrarIndicadorConexion?: boolean;
  
  /** Mostrar timestamp de última actualización */
  mostrarTimestamp?: boolean;
  
  /** Clase CSS adicional */
  className?: string;
  
  /** Variante de estilo */
  variante?: 'default' | 'card' | 'minimal';
}

/**
 * Componente VisualizacionDatosEnTiempoReal
 */
export function VisualizacionDatosEnTiempoReal({
  titulo,
  children,
  ultimaActualizacion,
  cargando = false,
  mensajeSinDatos = 'No hay datos disponibles',
  mostrarIndicadorConexion = true,
  mostrarTimestamp = true,
  className,
  variante = 'default',
}: VisualizacionDatosEnTiempoRealProps) {
  const { estaConectado, estadoConexion } = useWebSocket();

  // Formatear timestamp
  const formatearTimestamp = (timestamp: Date | string | null | undefined): string => {
    if (!timestamp) return 'Nunca';
    
    const fecha = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const ahora = new Date();
    const diferencia = ahora.getTime() - fecha.getTime();
    
    // Menos de 1 minuto
    if (diferencia < 60000) {
      return 'Hace unos segundos';
    }
    
    // Menos de 1 hora
    if (diferencia < 3600000) {
      const minutos = Math.floor(diferencia / 60000);
      return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    }
    
    // Menos de 24 horas
    if (diferencia < 86400000) {
      const horas = Math.floor(diferencia / 3600000);
      return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    }
    
    // Formato completo
    return fecha.toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determinar si mostrar datos o mensaje de sin datos
  const tieneContenido = React.Children.count(children) > 0;

  // Estilos según variante
  const obtenerEstilosVariante = () => {
    switch (variante) {
      case 'card':
        return 'rounded-lg border bg-card p-4 shadow-sm';
      case 'minimal':
        return 'border-b pb-4';
      case 'default':
      default:
        return 'rounded-md border bg-background p-4';
    }
  };

  return (
    <div className={cn(obtenerEstilosVariante(), className)}>
      {/* Encabezado */}
      {(titulo || mostrarIndicadorConexion) && (
        <div className="flex items-center justify-between mb-4">
          {/* Título */}
          {titulo && (
            <h3 className="text-sm font-semibold text-foreground">
              {titulo}
            </h3>
          )}

          {/* Indicador de conexión */}
          {mostrarIndicadorConexion && (
            <div className="flex items-center gap-2">
              {estaConectado ? (
                <Badge variant="default" className="gap-1.5">
                  <Wifi className="h-3 w-3" />
                  <span className="text-xs">En vivo</span>
                </Badge>
              ) : estadoConexion === 'conectando' || estadoConexion === 'reconectando' ? (
                <Badge variant="secondary" className="gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">Conectando</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1.5">
                  <WifiOff className="h-3 w-3" />
                  <span className="text-xs">Offline</span>
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {/* Contenido */}
      <div className="relative">
        {/* Estado de carga */}
        {cargando ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Cargando datos...</p>
            </div>
          </div>
        ) : tieneContenido ? (
          <>
            {/* Datos */}
            <div className={cn(!estaConectado && 'opacity-75')}>
              {children}
            </div>

            {/* Indicador de datos offline */}
            {!estaConectado && (
              <div className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <WifiOff className="h-3 w-3" />
                  Mostrando último estado conocido (sin conexión en tiempo real)
                </p>
              </div>
            )}
          </>
        ) : (
          /* Sin datos */
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">{mensajeSinDatos}</p>
          </div>
        )}
      </div>

      {/* Timestamp de última actualización */}
      {mostrarTimestamp && ultimaActualizacion && !cargando && (
        <div className="mt-4 pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Última actualización: {formatearTimestamp(ultimaActualizacion)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Componente auxiliar para mostrar un valor individual con etiqueta
 */
export interface ValorEnTiempoRealProps {
  /** Etiqueta del valor */
  etiqueta: string;
  
  /** Valor a mostrar */
  valor: string | number;
  
  /** Unidad del valor (opcional) */
  unidad?: string;
  
  /** Icono (opcional) */
  icono?: ReactNode;
  
  /** Clase CSS adicional */
  className?: string;
}

export function ValorEnTiempoReal({
  etiqueta,
  valor,
  unidad,
  icono,
  className,
}: ValorEnTiempoRealProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        {icono && <span className="text-muted-foreground">{icono}</span>}
        <span className="text-sm text-muted-foreground">{etiqueta}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{valor}</span>
        {unidad && <span className="text-sm text-muted-foreground">{unidad}</span>}
      </div>
    </div>
  );
}

