/**
 * Ejemplo de Uso de Manejadores WebSocket
 * 
 * Este archivo muestra ejemplos prácticos de cómo usar los manejadores
 * de eventos WebSocket en componentes React.
 */

'use client';

import { useEffect, useState } from 'react';
import { useWebSocket } from '@/lib/websocket';
import {
  obtenerAlertasActivas,
  obtenerNotificacionesNoLeidas,
  obtenerUltimasActualizacionesDispositivo,
  obtenerEstadoRelesDispositivo,
  obtenerLecturasSensoresDispositivo,
  controlarRele,
  useContadorNotificaciones,
} from '@/lib/websocket/manejadores';
import { useWebSocketStore } from '@/lib/store/useWebSocketStore';

/**
 * Ejemplo 1: Mostrar alertas activas en tiempo real
 */
export function EjemploAlertasActivas() {
  const [alertas, setAlertas] = useState(obtenerAlertasActivas());

  // Actualizar alertas cuando lleguen nuevos eventos
  useEffect(() => {
    const interval = setInterval(() => {
      setAlertas(obtenerAlertasActivas());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">Alertas Activas</h3>
      {alertas.length === 0 ? (
        <p className="text-gray-500">No hay alertas activas</p>
      ) : (
        <ul className="space-y-2">
          {alertas.map((alerta) => (
            <li
              key={alerta.id}
              className={`p-2 rounded ${
                alerta.severidad === 'critica'
                  ? 'bg-red-100'
                  : alerta.severidad === 'alta'
                  ? 'bg-orange-100'
                  : 'bg-yellow-100'
              }`}
            >
              <strong>{alerta.titulo}</strong>
              <p className="text-sm">{alerta.mensaje}</p>
              <span className="text-xs text-gray-600">
                {new Date(alerta.marcaTiempo).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Ejemplo 2: Contador de notificaciones no leídas
 */
export function EjemploContadorNotificaciones() {
  // Usar el hook personalizado que se actualiza automáticamente
  const contador = useContadorNotificaciones();

  return (
    <div className="relative">
      <button className="p-2 rounded bg-blue-500 text-white">
        🔔 Notificaciones
        {contador > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {contador}
          </span>
        )}
      </button>
    </div>
  );
}

/**
 * Ejemplo 3: Mostrar datos de dispositivo en tiempo real
 */
export function EjemploDispositivoTiempoReal({ idDispositivo }: { idDispositivo: string }) {
  const [actualizaciones, setActualizaciones] = useState(
    obtenerUltimasActualizacionesDispositivo(idDispositivo)
  );

  // Actualizar cuando lleguen nuevos eventos
  useEffect(() => {
    const interval = setInterval(() => {
      setActualizaciones(obtenerUltimasActualizacionesDispositivo(idDispositivo));
    }, 500);

    return () => clearInterval(interval);
  }, [idDispositivo]);

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">Dispositivo: {idDispositivo}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Voltaje */}
        <div className="p-2 bg-blue-50 rounded">
          <p className="text-sm text-gray-600">Voltaje</p>
          <p className="text-2xl font-bold">
            {actualizaciones.voltaje?.voltaje || '--'} V
          </p>
          {actualizaciones.voltaje && (
            <span
              className={`text-xs ${
                actualizaciones.voltaje.calidad === 'critica'
                  ? 'text-red-600'
                  : actualizaciones.voltaje.calidad === 'advertencia'
                  ? 'text-orange-600'
                  : 'text-green-600'
              }`}
            >
              {actualizaciones.voltaje.calidad}
            </span>
          )}
        </div>

        {/* Corriente */}
        <div className="p-2 bg-green-50 rounded">
          <p className="text-sm text-gray-600">Corriente</p>
          <p className="text-2xl font-bold">
            {actualizaciones.corriente?.corriente || '--'} A
          </p>
        </div>

        {/* Potencia */}
        <div className="p-2 bg-purple-50 rounded">
          <p className="text-sm text-gray-600">Potencia</p>
          <p className="text-2xl font-bold">
            {actualizaciones.potencia?.potenciaActiva || '--'} W
          </p>
        </div>

        {/* Estado de conexión */}
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Estado</p>
          <p className="text-lg font-bold">
            {actualizaciones.conexion?.estado === 'conectado' ? (
              <span className="text-green-600">🟢 Conectado</span>
            ) : (
              <span className="text-red-600">🔴 Desconectado</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Ejemplo 4: Control de relés
 */
export function EjemploControlReles({ idDispositivo }: { idDispositivo: string }) {
  const { socket, emitir } = useWebSocket();
  const [reles, setReles] = useState(obtenerEstadoRelesDispositivo(idDispositivo));

  // Actualizar estado de relés
  useEffect(() => {
    const interval = setInterval(() => {
      setReles(obtenerEstadoRelesDispositivo(idDispositivo));
    }, 500);

    return () => clearInterval(interval);
  }, [idDispositivo]);

  const handleToggleRele = (idRele: string, estadoActual: 'encendido' | 'apagado') => {
    const nuevoEstado = estadoActual === 'encendido' ? 'apagado' : 'encendido';
    controlarRele(idDispositivo, idRele, nuevoEstado, emitir);
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">Control de Relés</h3>
      
      {reles.length === 0 ? (
        <p className="text-gray-500">No hay relés disponibles</p>
      ) : (
        <div className="space-y-2">
          {reles.map((rele) => (
            <div
              key={rele.idRele}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div>
                <p className="font-medium">{rele.nombre || rele.idRele}</p>
                {rele.ubicacion && (
                  <p className="text-sm text-gray-600">{rele.ubicacion}</p>
                )}
              </div>
              
              <button
                onClick={() => handleToggleRele(rele.idRele, rele.estado)}
                className={`px-4 py-2 rounded font-medium ${
                  rele.estado === 'encendido'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {rele.estado === 'encendido' ? '🟢 ON' : '⚫ OFF'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Ejemplo 5: Lecturas de sensores
 */
export function EjemploLecturasSensores({ idDispositivo }: { idDispositivo: string }) {
  const [lecturas, setLecturas] = useState(obtenerLecturasSensoresDispositivo(idDispositivo));

  useEffect(() => {
    const interval = setInterval(() => {
      setLecturas(obtenerLecturasSensoresDispositivo(idDispositivo));
    }, 1000);

    return () => clearInterval(interval);
  }, [idDispositivo]);

  // Agrupar lecturas por tipo de sensor
  const lecturasPorTipo = lecturas.reduce((acc, lectura) => {
    if (!acc[lectura.tipo]) {
      acc[lectura.tipo] = [];
    }
    acc[lectura.tipo].push(lectura);
    return acc;
  }, {} as Record<string, typeof lecturas>);

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">Lecturas de Sensores</h3>
      
      {Object.keys(lecturasPorTipo).length === 0 ? (
        <p className="text-gray-500">No hay lecturas disponibles</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(lecturasPorTipo).map(([tipo, lecturasDelTipo]) => {
            const ultimaLectura = lecturasDelTipo[0]; // La más reciente
            
            return (
              <div key={tipo} className="p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-600 capitalize">{tipo}</p>
                <p className="text-3xl font-bold">
                  {ultimaLectura.valor} {ultimaLectura.unidad}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(ultimaLectura.marcaTiempo).toLocaleString()}
                </p>
                {ultimaLectura.ubicacion && (
                  <p className="text-xs text-gray-600 mt-1">
                    📍 {ultimaLectura.ubicacion}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Ejemplo 6: Dashboard completo con todos los componentes
 */
export function EjemploDashboardCompleto({ idDispositivo }: { idDispositivo: string }) {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard IoT</h1>
        <EjemploContadorNotificaciones />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EjemploDispositivoTiempoReal idDispositivo={idDispositivo} />
        <EjemploAlertasActivas />
        <EjemploControlReles idDispositivo={idDispositivo} />
        <EjemploLecturasSensores idDispositivo={idDispositivo} />
      </div>
    </div>
  );
}

/**
 * Ejemplo 7: Escuchar eventos personalizados del DOM
 */
export function EjemploEventosPersonalizados() {
  const [ultimoComando, setUltimoComando] = useState<any>(null);

  useEffect(() => {
    const handleComandoCompletado = (event: CustomEvent) => {
      setUltimoComando(event.detail);
    };

    window.addEventListener('hardware:comando-completado', handleComandoCompletado as EventListener);

    return () => {
      window.removeEventListener('hardware:comando-completado', handleComandoCompletado as EventListener);
    };
  }, []);

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">Último Comando Ejecutado</h3>
      {ultimoComando ? (
        <div className="space-y-1">
          <p>
            <strong>ID:</strong> {ultimoComando.idComando}
          </p>
          <p>
            <strong>Dispositivo:</strong> {ultimoComando.idDispositivo}
          </p>
          <p>
            <strong>Estado:</strong>{' '}
            {ultimoComando.exitoso ? (
              <span className="text-green-600">✅ Exitoso</span>
            ) : (
              <span className="text-red-600">❌ Fallido</span>
            )}
          </p>
          <p>
            <strong>Tiempo:</strong> {ultimoComando.tiempoEjecucion}ms
          </p>
        </div>
      ) : (
        <p className="text-gray-500">No hay comandos ejecutados</p>
      )}
    </div>
  );
}
