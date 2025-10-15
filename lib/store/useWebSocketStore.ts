import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Estado de conexión WebSocket
 */
export type EstadoConexion =
  | "conectado"
  | "conectando"
  | "desconectado"
  | "reconectando";

/**
 * Tipos de eventos WebSocket almacenados
 */
export interface EventoAlmacenado {
  tipo: string;
  datos: any;
  marcaTiempo: number;
}

/**
 * Información de reconexión
 */
export interface InfoReconexion {
  intentos: number;
  ultimoIntento: number | null;
  proximoIntento: number | null;
}

/**
 * Métricas de conexión
 */
export interface MetricasConexion {
  latencia: number | null;
  ultimaConexion: number | null;
  tiempoConectado: number;
  eventosRecibidos: number;
  eventosEnviados: number;
}

/**
 * Estado del store WebSocket
 */
interface EstadoWebSocket {
  // Estado de conexión
  estaConectado: boolean;
  estadoConexion: EstadoConexion;
  ultimoError: Error | null;

  // Información de reconexión
  infoReconexion: InfoReconexion;

  // Métricas
  metricas: MetricasConexion;

  // Últimos eventos recibidos (limitado a 100)
  ultimosEventos: EventoAlmacenado[];

  // Configuración
  maxEventosAlmacenados: number;
}

/**
 * Acciones del store WebSocket
 */
interface AccionesWebSocket {
  // Acciones de estado de conexión
  establecerConectado: (conectado: boolean) => void;
  establecerEstadoConexion: (estado: EstadoConexion) => void;
  establecerError: (error: Error | null) => void;

  // Acciones de reconexión
  incrementarIntentosReconexion: () => void;
  reiniciarIntentosReconexion: () => void;
  establecerProximoIntento: (tiempo: number | null) => void;

  // Acciones de métricas
  actualizarLatencia: (latencia: number) => void;
  registrarConexion: () => void;
  registrarDesconexion: () => void;
  incrementarEventosRecibidos: () => void;
  incrementarEventosEnviados: () => void;
  reiniciarMetricas: () => void;

  // Acciones de eventos
  agregarEvento: (tipo: string, datos: any) => void;
  obtenerEventosPorTipo: (tipo: string) => EventoAlmacenado[];
  limpiarEventos: () => void;
  limpiarEventosPorTipo: (tipo: string) => void;

  // Acciones de utilidad
  reiniciarStore: () => void;
}

/**
 * Tipo completo del store WebSocket
 */
export type AlmacenamientoWebSocket = EstadoWebSocket & AccionesWebSocket;

/**
 * Estado inicial del store
 */
const estadoInicial: EstadoWebSocket = {
  estaConectado: false,
  estadoConexion: "desconectado",
  ultimoError: null,
  infoReconexion: {
    intentos: 0,
    ultimoIntento: null,
    proximoIntento: null,
  },
  metricas: {
    latencia: null,
    ultimaConexion: null,
    tiempoConectado: 0,
    eventosRecibidos: 0,
    eventosEnviados: 0,
  },
  ultimosEventos: [],
  maxEventosAlmacenados: 100,
};

/**
 * Store de WebSocket usando Zustand
 * Gestiona el estado global de la conexión WebSocket
 */
export const useWebSocketStore = create<AlmacenamientoWebSocket>()(
  devtools(
    (set, get) => ({
      ...estadoInicial,

      // Acciones de estado de conexión
      establecerConectado: (conectado) => {
        set(
          (state) => {
            const nuevoEstado: Partial<EstadoWebSocket> = {
              estaConectado: conectado,
            };

            // Si se conecta, actualizar estado y reiniciar intentos
            if (conectado) {
              nuevoEstado.estadoConexion = "conectado";
              nuevoEstado.ultimoError = null;
              nuevoEstado.infoReconexion = {
                intentos: 0,
                ultimoIntento: null,
                proximoIntento: null,
              };
            } else {
              nuevoEstado.estadoConexion = "desconectado";
            }

            return nuevoEstado;
          },
          false,
          "websocket/establecerConectado"
        );
      },

      establecerEstadoConexion: (estado) => {
        set(
          { estadoConexion: estado },
          false,
          "websocket/establecerEstadoConexion"
        );
      },

      establecerError: (error) => {
        set({ ultimoError: error }, false, "websocket/establecerError");
      },

      // Acciones de reconexión
      incrementarIntentosReconexion: () => {
        set(
          (state) => ({
            infoReconexion: {
              ...state.infoReconexion,
              intentos: state.infoReconexion.intentos + 1,
              ultimoIntento: Date.now(),
            },
          }),
          false,
          "websocket/incrementarIntentosReconexion"
        );
      },

      reiniciarIntentosReconexion: () => {
        set(
          (state) => ({
            infoReconexion: {
              intentos: 0,
              ultimoIntento: null,
              proximoIntento: null,
            },
          }),
          false,
          "websocket/reiniciarIntentosReconexion"
        );
      },

      establecerProximoIntento: (tiempo) => {
        set(
          (state) => ({
            infoReconexion: {
              ...state.infoReconexion,
              proximoIntento: tiempo,
            },
          }),
          false,
          "websocket/establecerProximoIntento"
        );
      },

      // Acciones de métricas
      actualizarLatencia: (latencia) => {
        set(
          (state) => ({
            metricas: {
              ...state.metricas,
              latencia,
            },
          }),
          false,
          "websocket/actualizarLatencia"
        );
      },

      registrarConexion: () => {
        set(
          (state) => ({
            metricas: {
              ...state.metricas,
              ultimaConexion: Date.now(),
            },
          }),
          false,
          "websocket/registrarConexion"
        );
      },

      registrarDesconexion: () => {
        set(
          (state) => {
            const tiempoConectado =
              state.metricas.ultimaConexion !== null
                ? Date.now() - state.metricas.ultimaConexion
                : 0;

            return {
              metricas: {
                ...state.metricas,
                tiempoConectado:
                  state.metricas.tiempoConectado + tiempoConectado,
              },
            };
          },
          false,
          "websocket/registrarDesconexion"
        );
      },

      incrementarEventosRecibidos: () => {
        set(
          (state) => ({
            metricas: {
              ...state.metricas,
              eventosRecibidos: state.metricas.eventosRecibidos + 1,
            },
          }),
          false,
          "websocket/incrementarEventosRecibidos"
        );
      },

      incrementarEventosEnviados: () => {
        set(
          (state) => ({
            metricas: {
              ...state.metricas,
              eventosEnviados: state.metricas.eventosEnviados + 1,
            },
          }),
          false,
          "websocket/incrementarEventosEnviados"
        );
      },

      reiniciarMetricas: () => {
        set(
          {
            metricas: {
              latencia: null,
              ultimaConexion: null,
              tiempoConectado: 0,
              eventosRecibidos: 0,
              eventosEnviados: 0,
            },
          },
          false,
          "websocket/reiniciarMetricas"
        );
      },

      // Acciones de eventos
      agregarEvento: (tipo, datos) => {
        set(
          (state) => {
            const nuevoEvento: EventoAlmacenado = {
              tipo,
              datos,
              marcaTiempo: Date.now(),
            };

            // Mantener solo los últimos N eventos
            const eventosActualizados = [
              nuevoEvento,
              ...state.ultimosEventos,
            ].slice(0, state.maxEventosAlmacenados);

            return {
              ultimosEventos: eventosActualizados,
            };
          },
          false,
          "websocket/agregarEvento"
        );

        // También incrementar contador de eventos recibidos
        get().incrementarEventosRecibidos();
      },

      obtenerEventosPorTipo: (tipo) => {
        return get().ultimosEventos.filter((evento) => evento.tipo === tipo);
      },

      limpiarEventos: () => {
        set({ ultimosEventos: [] }, false, "websocket/limpiarEventos");
      },

      limpiarEventosPorTipo: (tipo) => {
        set(
          (state) => ({
            ultimosEventos: state.ultimosEventos.filter(
              (evento) => evento.tipo !== tipo
            ),
          }),
          false,
          "websocket/limpiarEventosPorTipo"
        );
      },

      // Acciones de utilidad
      reiniciarStore: () => {
        set(estadoInicial, false, "websocket/reiniciarStore");
      },
    }),
    {
      name: "WebSocket Store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// Hooks selectores para optimizar re-renders
export const useEstadoConexion = () =>
  useWebSocketStore((state) => ({
    estaConectado: state.estaConectado,
    estadoConexion: state.estadoConexion,
    ultimoError: state.ultimoError,
    establecerConectado: state.establecerConectado,
    establecerEstadoConexion: state.establecerEstadoConexion,
    establecerError: state.establecerError,
  }));

export const useInfoReconexion = () =>
  useWebSocketStore((state) => ({
    infoReconexion: state.infoReconexion,
    incrementarIntentosReconexion: state.incrementarIntentosReconexion,
    reiniciarIntentosReconexion: state.reiniciarIntentosReconexion,
    establecerProximoIntento: state.establecerProximoIntento,
  }));

export const useMetricasWebSocket = () =>
  useWebSocketStore((state) => ({
    metricas: state.metricas,
    actualizarLatencia: state.actualizarLatencia,
    registrarConexion: state.registrarConexion,
    registrarDesconexion: state.registrarDesconexion,
    incrementarEventosRecibidos: state.incrementarEventosRecibidos,
    incrementarEventosEnviados: state.incrementarEventosEnviados,
    reiniciarMetricas: state.reiniciarMetricas,
  }));

export const useEventosWebSocket = () =>
  useWebSocketStore((state) => ({
    ultimosEventos: state.ultimosEventos,
    agregarEvento: state.agregarEvento,
    obtenerEventosPorTipo: state.obtenerEventosPorTipo,
    limpiarEventos: state.limpiarEventos,
    limpiarEventosPorTipo: state.limpiarEventosPorTipo,
  }));
