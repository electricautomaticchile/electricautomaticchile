"use client";

/**
 * AlertasEnTiempoReal - Componente para mostrar alertas IoT en tiempo real
 * 
 * Responsabilidades:
 * - Escuchar eventos de alertas IoT
 * - Mostrar toast notifications para alertas críticas
 * - Mantener lista de alertas activas
 * - Reproducir sonido opcional para alertas críticas
 */

import { useState, useEffect, useCallback } from "react";
import { useWebSocket } from "@/lib/websocket/useWebSocket";
import { toast } from "@/components/ui/use-toast";
import type { AlertaIoT } from "@/lib/websocket/tipos";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Bell,
  BellOff,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertasEnTiempoRealProps {
  /** Mostrar versión reducida */
  reducida?: boolean;
  
  /** Habilitar sonido para alertas críticas */
  sonidoHabilitado?: boolean;
  
  /** Callback cuando se resuelve una alerta */
  onResolverAlerta?: (alertaId: string) => void;
}

export function AlertasEnTiempoReal({
  reducida = false,
  sonidoHabilitado = false,
  onResolverAlerta,
}: AlertasEnTiempoRealProps) {
  const [alertas, setAlertas] = useState<AlertaIoT[]>([]);
  const [sonidoActivo, setSonidoActivo] = useState(sonidoHabilitado);
  const { estaConectado } = useWebSocket();

  /**
   * Manejar nueva alerta IoT
   */
  const manejarNuevaAlerta = useCallback((datos: AlertaIoT) => {
    console.log('[AlertasEnTiempoReal] Nueva alerta recibida:', datos);

    // Agregar alerta a la lista
    setAlertas((prev) => {
      // Evitar duplicados
      if (prev.some((a) => a.id === datos.id)) {
        return prev;
      }
      // Agregar al inicio y limitar a 50 alertas
      return [datos, ...prev].slice(0, 50);
    });

    // Determinar el tipo de toast según la severidad
    let variant: 'default' | 'destructive' = 'default';
    let icono = 'ℹ️';

    switch (datos.severidad) {
      case 'critica':
        variant = 'destructive';
        icono = '🚨';
        break;
      case 'alta':
        variant = 'destructive';
        icono = '⚠️';
        break;
      case 'media':
        variant = 'default';
        icono = '⚡';
        break;
      case 'baja':
        variant = 'default';
        icono = 'ℹ️';
        break;
    }

    // Mostrar notificación toast
    toast({
      title: `${icono} ${datos.titulo}`,
      description: datos.mensaje,
      variant,
      duration: datos.severidad === 'critica' ? 10000 : 5000,
    });

    // Reproducir sonido para alertas críticas si está habilitado
    if (datos.severidad === 'critica' && sonidoActivo) {
      reproducirSonidoAlerta();
    }
  }, [sonidoActivo]);

  // Escuchar eventos de alertas IoT
  useWebSocket<AlertaIoT>('iot:alerta:nueva', manejarNuevaAlerta);

  /**
   * Reproducir sonido de alerta
   */
  const reproducirSonidoAlerta = () => {
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch (error) {
      console.debug('[AlertasEnTiempoReal] No se pudo reproducir sonido:', error);
    }
  };

  /**
   * Resolver una alerta
   */
  const resolverAlerta = (alertaId: string) => {
    setAlertas((prev) =>
      prev.map((alerta) =>
        alerta.id === alertaId ? { ...alerta, resuelta: true } : alerta
      )
    );

    if (onResolverAlerta) {
      onResolverAlerta(alertaId);
    }
  };

  /**
   * Eliminar una alerta de la lista
   */
  const eliminarAlerta = (alertaId: string) => {
    setAlertas((prev) => prev.filter((alerta) => alerta.id !== alertaId));
  };

  /**
   * Obtener icono según severidad
   */
  const obtenerIconoSeveridad = (severidad: AlertaIoT['severidad']) => {
    switch (severidad) {
      case 'critica':
        return <AlertTriangle className="h-4 w-4" />;
      case 'alta':
        return <AlertCircle className="h-4 w-4" />;
      case 'media':
        return <Info className="h-4 w-4" />;
      case 'baja':
        return <Info className="h-4 w-4" />;
    }
  };

  /**
   * Obtener color según severidad
   */
  const obtenerColorSeveridad = (severidad: AlertaIoT['severidad']) => {
    switch (severidad) {
      case 'critica':
        return 'destructive';
      case 'alta':
        return 'destructive';
      case 'media':
        return 'default';
      case 'baja':
        return 'secondary';
    }
  };

  // Filtrar alertas activas (no resueltas)
  const alertasActivas = alertas.filter((a) => !a.resuelta);
  const alertasCriticas = alertasActivas.filter((a) => a.severidad === 'critica').length;
  const alertasAltas = alertasActivas.filter((a) => a.severidad === 'alta').length;

  // Versión reducida
  if (reducida) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Alertas del Sistema
            {alertasActivas.length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {alertasActivas.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Notificaciones y alertas en tiempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alertasActivas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
              <p className="text-sm text-gray-500">
                No hay alertas activas
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Todo funciona correctamente
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {alertasActivas.slice(0, 3).map((alerta) => (
                <div
                  key={alerta.id}
                  className={cn(
                    "p-3 rounded-lg border",
                    alerta.severidad === 'critica' && "border-red-500 bg-red-50 dark:bg-red-950",
                    alerta.severidad === 'alta' && "border-orange-500 bg-orange-50 dark:bg-orange-950",
                    alerta.severidad === 'media' && "border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
                    alerta.severidad === 'baja' && "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      {obtenerIconoSeveridad(alerta.severidad)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {alerta.titulo}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(alerta.marcaTiempo).toLocaleTimeString("es-CL")}
                        </p>
                      </div>
                    </div>
                    <Badge variant={obtenerColorSeveridad(alerta.severidad)} className="text-xs">
                      {alerta.severidad}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {alertasActivas.length > 3 && (
                <p className="text-xs text-center text-gray-500 pt-2">
                  +{alertasActivas.length - 3} alertas más
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Versión completa
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            Alertas del Sistema
          </h2>
          {alertasActivas.length > 0 && (
            <Badge variant="destructive">
              {alertasActivas.length} activas
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle de sonido */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSonidoActivo(!sonidoActivo)}
            title={sonidoActivo ? "Desactivar sonido" : "Activar sonido"}
          >
            {sonidoActivo ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
          </Button>

          {/* Indicador de conexión */}
          {estaConectado ? (
            <Badge variant="default" className="bg-green-500">
              En Vivo
            </Badge>
          ) : (
            <Badge variant="secondary">
              Offline
            </Badge>
          )}
        </div>
      </div>

      {/* Resumen de alertas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Alertas Críticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {alertasCriticas}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Alertas Altas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {alertasAltas}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {alertasActivas.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de alertas */}
      <div className="space-y-3">
        {alertasActivas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              No hay alertas activas
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Todos los sistemas funcionan correctamente
            </p>
          </div>
        ) : (
          alertasActivas.map((alerta) => (
            <div
              key={alerta.id}
              className={cn(
                "p-4 rounded-lg border",
                alerta.severidad === 'critica' && "border-red-500 bg-red-50 dark:bg-red-950",
                alerta.severidad === 'alta' && "border-orange-500 bg-orange-50 dark:bg-orange-950",
                alerta.severidad === 'media' && "border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
                alerta.severidad === 'baja' && "border-blue-500 bg-blue-50 dark:bg-blue-950"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {obtenerIconoSeveridad(alerta.severidad)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{alerta.titulo}</h3>
                      <Badge variant={obtenerColorSeveridad(alerta.severidad)} className="text-xs">
                        {alerta.severidad}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alerta.tipo}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {alerta.mensaje}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Dispositivo: {alerta.idDispositivo}</span>
                      <span>•</span>
                      <span>{new Date(alerta.marcaTiempo).toLocaleString("es-CL")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resolverAlerta(alerta.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolver
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarAlerta(alerta.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alertas resueltas */}
      {alertas.filter((a) => a.resuelta).length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-3 text-gray-500">
            Alertas Resueltas ({alertas.filter((a) => a.resuelta).length})
          </h3>
          <div className="space-y-2">
            {alertas
              .filter((a) => a.resuelta)
              .slice(0, 5)
              .map((alerta) => (
                <div
                  key={alerta.id}
                  className="p-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium line-through">
                        {alerta.titulo}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarAlerta(alerta.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
