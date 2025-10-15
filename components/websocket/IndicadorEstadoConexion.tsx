"use client";

/**
 * IndicadorEstadoConexion - Componente para mostrar el estado de la conexión WebSocket
 * 
 * Responsabilidades:
 * - Mostrar indicador visual del estado de conexión (verde/amarillo/rojo)
 * - Mostrar contador de intentos de reconexión
 * - Proveer tooltip con información detallada
 * - Proveer botón de reconexión manual
 * 
 * Estados:
 * - Conectado: Punto verde
 * - Conectando: Punto amarillo animado
 * - Desconectado: Punto rojo
 * - Reconectando: Punto amarillo con contador de intentos
 */

import React from 'react';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface IndicadorEstadoConexionProps {
  /** Mostrar como badge con texto (por defecto: solo icono) */
  mostrarTexto?: boolean;
  
  /** Clase CSS adicional */
  className?: string;
  
  /** Mostrar botón de reconexión manual */
  mostrarBotonReconectar?: boolean;
}

/**
 * Componente IndicadorEstadoConexion
 */
export function IndicadorEstadoConexion({
  mostrarTexto = false,
  className,
  mostrarBotonReconectar = true,
}: IndicadorEstadoConexionProps) {
  const {
    estaConectado,
    estadoConexion,
    intentosReconexion,
    latencia,
    ultimoError,
    reconectar,
  } = useWebSocket();

  // Determinar color y animación según el estado
  const obtenerEstiloIndicador = () => {
    switch (estadoConexion) {
      case 'conectado':
        return {
          color: 'bg-green-500',
          animacion: '',
          texto: 'Conectado',
          descripcion: 'Conexión WebSocket activa',
        };
      case 'conectando':
        return {
          color: 'bg-yellow-500',
          animacion: 'animate-pulse',
          texto: 'Conectando',
          descripcion: 'Estableciendo conexión...',
        };
      case 'reconectando':
        return {
          color: 'bg-yellow-500',
          animacion: 'animate-pulse',
          texto: `Reconectando (${intentosReconexion})`,
          descripcion: `Intento ${intentosReconexion} de reconexión`,
        };
      case 'desconectado':
        return {
          color: 'bg-red-500',
          animacion: '',
          texto: 'Desconectado',
          descripcion: 'Sin conexión WebSocket',
        };
      default:
        return {
          color: 'bg-gray-500',
          animacion: '',
          texto: 'Desconocido',
          descripcion: 'Estado desconocido',
        };
    }
  };

  const estilo = obtenerEstiloIndicador();

  // Formatear latencia
  const formatearLatencia = (lat: number | null): string => {
    if (lat === null) return 'N/A';
    if (lat < 100) return `${lat}ms (Excelente)`;
    if (lat < 300) return `${lat}ms (Buena)`;
    if (lat < 500) return `${lat}ms (Regular)`;
    return `${lat}ms (Lenta)`;
  };

  // Formatear última conexión (simulado - en producción vendría del contexto)
  const obtenerUltimaConexion = (): string => {
    if (estaConectado) return 'Ahora';
    return 'Hace unos momentos';
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent transition-colors',
            className
          )}
          aria-label={`Estado de conexión: ${estilo.texto}`}
        >
          {/* Indicador de punto */}
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              estilo.color,
              estilo.animacion
            )}
            aria-hidden="true"
          />
          
          {/* Texto opcional */}
          {mostrarTexto && (
            <span className="text-sm font-medium text-foreground">
              {estilo.texto}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* Encabezado */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Estado de Conexión WebSocket</h4>
            <Badge
              variant={estaConectado ? 'default' : 'destructive'}
              className="w-fit"
            >
              {estilo.texto}
            </Badge>
          </div>

          {/* Información detallada */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <span className="font-medium">{estilo.descripcion}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Latencia:</span>
              <span className="font-medium">{formatearLatencia(latencia)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Última conexión:</span>
              <span className="font-medium">{obtenerUltimaConexion()}</span>
            </div>

            {intentosReconexion > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Intentos:</span>
                <span className="font-medium">{intentosReconexion}</span>
              </div>
            )}
          </div>

          {/* Error (si existe) */}
          {ultimoError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm">
              <p className="font-medium text-destructive">Error:</p>
              <p className="text-muted-foreground mt-1">
                {ultimoError.message}
              </p>
            </div>
          )}

          {/* Botón de reconexión manual */}
          {mostrarBotonReconectar && !estaConectado && (
            <Button
              onClick={reconectar}
              variant="outline"
              size="sm"
              className="w-full"
              disabled={estadoConexion === 'conectando' || estadoConexion === 'reconectando'}
            >
              {estadoConexion === 'conectando' || estadoConexion === 'reconectando'
                ? 'Reconectando...'
                : 'Reconectar Manualmente'}
            </Button>
          )}

          {/* Información adicional */}
          <div className="text-xs text-muted-foreground border-t pt-3">
            <p>
              La conexión WebSocket permite recibir actualizaciones en tiempo real
              de dispositivos, alertas y notificaciones.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

