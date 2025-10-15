/**
 * Tipos y interfaces para el sistema WebSocket
 */

export type EstadoConexion = 
  | 'conectado' 
  | 'conectando' 
  | 'desconectado' 
  | 'reconectando';

export interface OpcionesWebSocket {
  url: string;
  conectarAutomaticamente?: boolean;
  reconexion?: boolean;
  intentosReconexion?: number;
  retrasoReconexion?: number;
  retrasoReconexionMax?: number;
  timeout?: number;
  intervaloHeartbeat?: number;
  timeoutHeartbeat?: number;
}

export interface ActualizacionVoltajeDispositivo {
  idDispositivo: string;
  voltaje: number;
  fase?: string;
  calidad: 'buena' | 'advertencia' | 'critica';
  ubicacion?: string;
  marcaTiempo: string;
}

export interface ActualizacionCorrienteDispositivo {
  idDispositivo: string;
  corriente: number;
  fase?: string;
  factorPotencia?: number;
  ubicacion?: string;
  marcaTiempo: string;
}

export interface ActualizacionPotenciaDispositivo {
  idDispositivo: string;
  potenciaActiva: number;
  potenciaReactiva?: number;
  potenciaAparente?: number;
  energia: number;
  costo?: number;
  ubicacion?: string;
  marcaTiempo: string;
}

export interface ActualizacionConexionDispositivo {
  idDispositivo: string;
  estado: 'conectado' | 'desconectado' | 'reconectando';
  ultimaVez: Date;
  metadatos?: Record<string, any>;
  marcaTiempo: string;
}

export interface AlertaIoT {
  id: string;
  idDispositivo: string;
  tipo: 'umbral' | 'anomalia' | 'prediccion' | 'sistema';
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  titulo: string;
  mensaje: string;
  marcaTiempo: string;
  resuelta: boolean;
}

export interface ResultadoComandoHardware {
  idComando: string;
  idDispositivo: string;
  exitoso: boolean;
  resultado: Record<string, any>;
  error?: string;
  tiempoEjecucion: number;
}

export interface NotificacionData {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  marcaTiempo: string;
}

export interface ActualizacionSensorHardware {
  idDispositivo: string;
  idSensor: string;
  tipo: 'temperatura' | 'humedad' | 'presion' | 'luz' | 'movimiento' | 'otro';
  valor: number;
  unidad: string;
  ubicacion?: string;
  marcaTiempo: string;
}

export interface ActualizacionReleHardware {
  idDispositivo: string;
  idRele: string;
  estado: 'encendido' | 'apagado';
  nombre?: string;
  ubicacion?: string;
  marcaTiempo: string;
}
