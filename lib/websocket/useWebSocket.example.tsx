/**
 * Ejemplos de uso del hook useWebSocket
 * 
 * Este archivo contiene ejemplos de cómo usar el hook useWebSocket
 * en diferentes escenarios comunes.
 */

import { useWebSocket } from './useWebSocket';
import type { ActualizacionPotenciaDispositivo, AlertaIoT } from './tipos';

/**
 * Ejemplo 1: Uso básico - Solo acceso al socket y estado
 */
export function EjemploBasico() {
  const { socket, estaConectado, estadoConexion } = useWebSocket();
  
  return (
    <div>
      <p>Estado: {estadoConexion}</p>
      <p>Conectado: {estaConectado ? 'Sí' : 'No'}</p>
      <p>Socket ID: {socket?.id || 'N/A'}</p>
    </div>
  );
}

/**
 * Ejemplo 2: Escuchar evento automáticamente con cleanup
 */
export function EjemploConListener() {
  // El hook automáticamente registra el listener y lo limpia al desmontar
  useWebSocket<ActualizacionPotenciaDispositivo>(
    'dispositivo:actualizacion_potencia',
    (datos) => {
      console.log('Nueva potencia:', datos.potenciaActiva);
      console.log('Energía:', datos.energia);
      console.log('Costo:', datos.costo);
    }
  );
  
  return <div>Escuchando actualizaciones de potencia...</div>;
}

/**
 * Ejemplo 3: Usar métodos de emisión
 */
export function EjemploConEmision() {
  const { emitir, estaConectado } = useWebSocket();
  
  const enviarComando = () => {
    emitir('hardware:arduino_command', {
      deviceId: 'arduino-001',
      command: 'on',
      target: 'relay',
    });
  };
  
  return (
    <button onClick={enviarComando} disabled={!estaConectado}>
      Encender Relé
    </button>
  );
}

/**
 * Ejemplo 4: Escuchar múltiples eventos manualmente
 */
export function EjemploMultiplesEventos() {
  const { escuchar, dejarDeEscuchar, estaConectado } = useWebSocket();
  
  // Escuchar eventos manualmente cuando sea necesario
  const iniciarMonitoreo = () => {
    escuchar<ActualizacionPotenciaDispositivo>(
      'dispositivo:actualizacion_potencia',
      (datos) => {
        console.log('Potencia:', datos.potenciaActiva);
      }
    );
    
    escuchar<AlertaIoT>('iot:alerta:nueva', (alerta) => {
      console.log('Nueva alerta:', alerta.mensaje);
    });
  };
  
  const detenerMonitoreo = () => {
    dejarDeEscuchar('dispositivo:actualizacion_potencia');
    dejarDeEscuchar('iot:alerta:nueva');
  };
  
  return (
    <div>
      <button onClick={iniciarMonitoreo} disabled={!estaConectado}>
        Iniciar Monitoreo
      </button>
      <button onClick={detenerMonitoreo}>
        Detener Monitoreo
      </button>
    </div>
  );
}

/**
 * Ejemplo 5: Manejo de reconexión
 */
export function EjemploReconexion() {
  const {
    estaConectado,
    estadoConexion,
    intentosReconexion,
    ultimoError,
    reconectar,
  } = useWebSocket();
  
  return (
    <div>
      <p>Estado: {estadoConexion}</p>
      {estadoConexion === 'reconectando' && (
        <p>Intento de reconexión: {intentosReconexion}</p>
      )}
      {ultimoError && (
        <p style={{ color: 'red' }}>Error: {ultimoError.message}</p>
      )}
      {!estaConectado && (
        <button onClick={reconectar}>
          Reconectar Manualmente
        </button>
      )}
    </div>
  );
}

/**
 * Ejemplo 6: Componente completo con datos en tiempo real
 */
export function EjemploCompleto() {
  const [potencia, setPotencia] = React.useState<number>(0);
  const [alertas, setAlertas] = React.useState<AlertaIoT[]>([]);
  
  const { emitir, estaConectado, estadoConexion } = useWebSocket();
  
  // Escuchar actualizaciones de potencia
  useWebSocket<ActualizacionPotenciaDispositivo>(
    'dispositivo:actualizacion_potencia',
    (datos) => {
      setPotencia(datos.potenciaActiva);
    }
  );
  
  // Escuchar alertas
  useWebSocket<AlertaIoT>('iot:alerta:nueva', (alerta) => {
    setAlertas((prev) => [alerta, ...prev].slice(0, 10)); // Mantener últimas 10
  });
  
  const solicitarDatos = () => {
    emitir('dispositivo:solicitar_datos', {
      idDispositivo: 'device-001',
    });
  };
  
  return (
    <div>
      <div>
        <h3>Estado de Conexión</h3>
        <p>Estado: {estadoConexion}</p>
        <p>Conectado: {estaConectado ? 'Sí' : 'No'}</p>
      </div>
      
      <div>
        <h3>Potencia Actual</h3>
        <p>{potencia} W</p>
        <button onClick={solicitarDatos} disabled={!estaConectado}>
          Actualizar Datos
        </button>
      </div>
      
      <div>
        <h3>Alertas Recientes</h3>
        <ul>
          {alertas.map((alerta) => (
            <li key={alerta.id}>
              [{alerta.severidad}] {alerta.mensaje}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Nota: Importar React para el último ejemplo
import React from 'react';
