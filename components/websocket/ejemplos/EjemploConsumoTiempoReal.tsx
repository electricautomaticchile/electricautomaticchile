"use client";

/**
 * EjemploConsumoTiempoReal - Ejemplo de uso de componentes WebSocket
 * 
 * Este es un componente de ejemplo que muestra cómo integrar
 * los componentes de WebSocket para mostrar datos de consumo eléctrico
 * en tiempo real.
 * 
 * Puedes usar este ejemplo como referencia para crear tus propios
 * componentes que consuman datos en tiempo real.
 */

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/lib/websocket/useWebSocket';
import {
  VisualizacionDatosEnTiempoReal,
  ValorEnTiempoReal,
} from '@/components/websocket';
import type { ActualizacionPotenciaDispositivo } from '@/lib/websocket/tipos';
import { Zap, Activity, DollarSign } from 'lucide-react';

export interface EjemploConsumoTiempoRealProps {
  /** ID del dispositivo a monitorear */
  idDispositivo: string;
  
  /** Mostrar información de costo */
  mostrarCosto?: boolean;
}

/**
 * Componente de ejemplo para mostrar consumo eléctrico en tiempo real
 */
export function EjemploConsumoTiempoReal({
  idDispositivo,
  mostrarCosto = true,
}: EjemploConsumoTiempoRealProps) {
  const [datos, setDatos] = useState<ActualizacionPotenciaDispositivo | null>(null);
  const [cargando, setCargando] = useState(true);

  // Escuchar eventos de actualización de potencia
  useWebSocket<ActualizacionPotenciaDispositivo>(
    'dispositivo:actualizacion_potencia',
    (nuevoDatos) => {
      // Filtrar solo los datos del dispositivo que nos interesa
      if (nuevoDatos.idDispositivo === idDispositivo) {
        setDatos(nuevoDatos);
        setCargando(false);
      }
    }
  );

  // Simular carga inicial (en producción, esto vendría de una API)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!datos) {
        setCargando(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [datos]);

  return (
    <VisualizacionDatosEnTiempoReal
      titulo="Consumo Eléctrico en Tiempo Real"
      ultimaActualizacion={datos?.marcaTiempo}
      cargando={cargando}
      variante="card"
      mensajeSinDatos="Esperando datos del dispositivo..."
    >
      {datos && (
        <div className="space-y-4">
          {/* Fila principal de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ValorEnTiempoReal
              etiqueta="Potencia Activa"
              valor={datos.potenciaActiva.toFixed(2)}
              unidad="W"
              icono={<Zap className="h-4 w-4" />}
            />
            
            <ValorEnTiempoReal
              etiqueta="Energía Consumida"
              valor={datos.energia.toFixed(2)}
              unidad="kWh"
              icono={<Activity className="h-4 w-4" />}
            />
            
            {mostrarCosto && datos.costo && (
              <ValorEnTiempoReal
                etiqueta="Costo Estimado"
                valor={`$${datos.costo.toLocaleString('es-CL')}`}
                icono={<DollarSign className="h-4 w-4" />}
              />
            )}
          </div>

          {/* Métricas adicionales (si están disponibles) */}
          {(datos.potenciaReactiva || datos.potenciaAparente) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              {datos.potenciaReactiva && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    Potencia Reactiva
                  </span>
                  <span className="text-lg font-semibold">
                    {datos.potenciaReactiva.toFixed(2)} VAR
                  </span>
                </div>
              )}
              
              {datos.potenciaAparente && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    Potencia Aparente
                  </span>
                  <span className="text-lg font-semibold">
                    {datos.potenciaAparente.toFixed(2)} VA
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Ubicación (si está disponible) */}
          {datos.ubicacion && (
            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground">
                Ubicación: <span className="font-medium">{datos.ubicacion}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </VisualizacionDatosEnTiempoReal>
  );
}

