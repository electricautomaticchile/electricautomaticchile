"use client";

/**
 * ProveedorWebSocket - Provider component para gestionar la conexión WebSocket global
 * 
 * Responsabilidades:
 * - Inicializar AdministradorWebSocket en mount
 * - Conectar automáticamente cuando hay token JWT
 * - Desconectar en unmount o logout
 * - Reconectar cuando cambia el token
 * - Exponer estado de conexión a través del contexto
 */

import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AdministradorWebSocket } from './AdministradorWebSocket';
import { ContextoWebSocket, type ValorContextoWebSocket } from './WebSocketContext';
import { TokenManager } from '../api/utils/tokenManager';
import { useWebSocketStore } from '../store/useWebSocketStore';
import { useToast } from '@/components/ui/use-toast';
import type { EstadoConexion } from './tipos';
import {
  manejarErrorAutenticacion,
  manejarErrorRed,
  detectarTipoError,
  TipoErrorWebSocket,
  crearMensajeUsuario,
  debeNotificarUsuario,
} from './errorHandlers';

/**
 * Props del ProveedorWebSocket
 */
interface ProveedorWebSocketProps {
  /** Elementos hijos que tendrán acceso al contexto */
  children: ReactNode;
  
  /** URL del servidor WebSocket (opcional, usa variable de entorno por defecto) */
  url?: string;
  
  /** Si debe conectar automáticamente cuando hay token (default: true) */
  conectarAutomaticamente?: boolean;
}

/**
 * ProveedorWebSocket Component
 * 
 * Debe envolver la aplicación o las partes que necesiten acceso a WebSocket.
 * Gestiona una única instancia de conexión WebSocket compartida por toda la app.
 * 
 * @example
 * ```tsx
 * <ProveedorWebSocket>
 *   <App />
 * </ProveedorWebSocket>
 * ```
 */
export function ProveedorWebSocket({
  children,
  url,
  conectarAutomaticamente = true,
}: ProveedorWebSocketProps) {
  // Hooks
  const router = useRouter();
  const { toast } = useToast();
  
  // Referencia al administrador de WebSocket (persiste entre renders)
  const administradorRef = useRef<AdministradorWebSocket | null>(null);
  
  // Estado local del componente
  const [estaConectado, setEstaConectado] = useState(false);
  const [estadoConexion, setEstadoConexion] = useState<EstadoConexion>('desconectado');
  const [ultimoError, setUltimoError] = useState<Error | null>(null);
  const [intentosReconexion, setIntentosReconexion] = useState(0);
  const [latencia, setLatencia] = useState<number | null>(null);
  
  // Acciones del store de Zustand
  const {
    establecerConectado,
    establecerEstadoConexion,
    establecerError,
    incrementarIntentosReconexion,
    reiniciarIntentosReconexion,
    actualizarLatencia,
    registrarConexion,
    registrarDesconexion,
  } = useWebSocketStore();
  
  // Obtener URL del WebSocket (de props o variable de entorno)
  const wsUrl = url || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';
  
  /**
   * Manejar errores de conexión con clasificación y acciones apropiadas
   */
  const manejarError = useCallback((error: any, contexto?: Record<string, any>) => {
    const tipoError = detectarTipoError(error);
    
    // Actualizar estado de error
    setUltimoError(error);
    establecerError(error);
    
    // Manejar según el tipo de error
    switch (tipoError) {
      case TipoErrorWebSocket.AUTENTICACION: {
        const resultado = manejarErrorAutenticacion(error, contexto);
        
        // Mostrar notificación al usuario
        toast({
          title: 'Sesión expirada',
          description: resultado.mensajeUsuario,
          variant: 'destructive',
        });
        
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          router.push(resultado.rutaRedireccion);
        }, 2000);
        
        break;
      }
      
      case TipoErrorWebSocket.RED: {
        const resultado = manejarErrorRed(error, contexto);
        
        // Solo mostrar notificación si no se va a reintentar automáticamente
        if (!resultado.debeReintentar || intentosReconexion > 3) {
          toast({
            title: 'Error de conexión',
            description: resultado.mensajeUsuario,
            variant: 'destructive',
          });
        }
        
        break;
      }
      
      case TipoErrorWebSocket.TIMEOUT: {
        // Para timeouts, solo notificar si es persistente
        if (intentosReconexion > 2) {
          toast({
            title: 'Conexión lenta',
            description: 'La conexión está tardando más de lo esperado',
            variant: 'default',
          });
        }
        break;
      }
      
      default: {
        // Para otros errores, mostrar mensaje genérico si es necesario
        if (debeNotificarUsuario(error)) {
          toast({
            title: 'Error de conexión',
            description: crearMensajeUsuario(error),
            variant: 'destructive',
          });
        }
        break;
      }
    }
  }, [router, toast, establecerError, intentosReconexion]);
  
  /**
   * Inicializar el administrador de WebSocket
   */
  useEffect(() => {
    if (!administradorRef.current) {
      console.log('[ProveedorWebSocket] Inicializando AdministradorWebSocket');
      
      administradorRef.current = new AdministradorWebSocket(wsUrl, {
        conectarAutomaticamente: false, // Controlamos la conexión manualmente
        reconexion: true,
        intentosReconexion: 5,
        retrasoReconexion: 1000,
        retrasoReconexionMax: 30000,
        timeout: 20000,
        intervaloHeartbeat: 25000,
        timeoutHeartbeat: 60000,
      });
      
      // Suscribirse a cambios de estado
      administradorRef.current.suscribirseAEstado('provider', (nuevoEstado) => {
        console.log('[ProveedorWebSocket] Cambio de estado:', nuevoEstado);
        setEstadoConexion(nuevoEstado);
        establecerEstadoConexion(nuevoEstado);
        
        // Actualizar estado de conexión
        const conectado = nuevoEstado === 'conectado';
        setEstaConectado(conectado);
        establecerConectado(conectado);
        
        // Registrar métricas
        if (conectado) {
          registrarConexion();
          reiniciarIntentosReconexion();
          setIntentosReconexion(0);
          setUltimoError(null);
          establecerError(null);
        } else if (nuevoEstado === 'desconectado') {
          registrarDesconexion();
        } else if (nuevoEstado === 'reconectando') {
          incrementarIntentosReconexion();
          setIntentosReconexion(prev => prev + 1);
        }
      });
    }
    
    // Cleanup al desmontar
    return () => {
      if (administradorRef.current) {
        console.log('[ProveedorWebSocket] Limpiando conexión WebSocket');
        administradorRef.current.desuscribirseDeEstado('provider');
        administradorRef.current.desconectar();
        administradorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl]); // Solo re-inicializar si cambia la URL
  
  /**
   * Conectar automáticamente cuando hay token disponible
   */
  useEffect(() => {
    if (!conectarAutomaticamente || !administradorRef.current) {
      return;
    }
    
    const token = TokenManager.getToken();
    
    if (token && !estaConectado && estadoConexion === 'desconectado') {
      console.log('[ProveedorWebSocket] Token detectado, conectando automáticamente...');
      
      administradorRef.current
        .conectar(token)
        .then(() => {
          console.log('[ProveedorWebSocket] Conexión establecida exitosamente');
        })
        .catch((error) => {
          manejarError(error, { contexto: 'conexion_automatica' });
        });
    } else if (!token && estaConectado) {
      // Si no hay token pero estamos conectados, desconectar
      console.log('[ProveedorWebSocket] Token no disponible, desconectando...');
      administradorRef.current.desconectar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conectarAutomaticamente, estaConectado, estadoConexion]);
  
  /**
   * Monitorear cambios en el token (para reconectar cuando cambia)
   */
  useEffect(() => {
    if (!administradorRef.current) {
      return;
    }
    
    // Verificar token periódicamente
    const intervalo = setInterval(() => {
      const token = TokenManager.getToken();
      
      // Si hay token y no estamos conectados, intentar conectar
      if (token && !estaConectado && estadoConexion === 'desconectado') {
        console.log('[ProveedorWebSocket] Token disponible, reconectando...');
        
        administradorRef.current
          ?.conectar(token)
          .catch((error) => {
            manejarError(error, { contexto: 'reconexion_periodica' });
          });
      }
      // Si no hay token y estamos conectados, desconectar
      else if (!token && estaConectado) {
        console.log('[ProveedorWebSocket] Token removido, desconectando...');
        administradorRef.current?.desconectar();
      }
    }, 5000); // Verificar cada 5 segundos
    
    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estaConectado, estadoConexion]);
  
  /**
   * Escuchar eventos de latencia (pong)
   */
  useEffect(() => {
    if (!administradorRef.current || !estaConectado) {
      return;
    }
    
    const manejarPong = (data: { timestamp: number }) => {
      const latenciaActual = Date.now() - data.timestamp;
      setLatencia(latenciaActual);
      actualizarLatencia(latenciaActual);
    };
    
    administradorRef.current.escuchar('pong', manejarPong);
    
    return () => {
      administradorRef.current?.dejarDeEscuchar('pong', manejarPong);
    };
  }, [estaConectado, actualizarLatencia]);
  
  /**
   * Función para reconectar manualmente
   */
  const reconectar = useCallback(() => {
    if (!administradorRef.current) {
      console.warn('[ProveedorWebSocket] No hay administrador disponible para reconectar');
      return;
    }
    
    const token = TokenManager.getToken();
    
    if (!token) {
      const error = new Error('No hay token de autenticación disponible');
      manejarError(error, { contexto: 'reconexion_manual' });
      return;
    }
    
    console.log('[ProveedorWebSocket] Reconexión manual iniciada');
    
    // Desconectar primero si está conectado
    if (estaConectado) {
      administradorRef.current.desconectar();
    }
    
    // Intentar conectar
    administradorRef.current
      .conectar(token)
      .then(() => {
        console.log('[ProveedorWebSocket] Reconexión manual exitosa');
        toast({
          title: 'Reconectado',
          description: 'La conexión se ha restablecido exitosamente',
          variant: 'default',
        });
      })
      .catch((error) => {
        manejarError(error, { contexto: 'reconexion_manual' });
      });
  }, [estaConectado, manejarError, toast]);
  
  /**
   * Función para desconectar manualmente
   */
  const desconectar = useCallback(() => {
    if (!administradorRef.current) {
      console.warn('[ProveedorWebSocket] No hay administrador disponible para desconectar');
      return;
    }
    
    console.log('[ProveedorWebSocket] Desconexión manual iniciada');
    administradorRef.current.desconectar();
  }, []);
  
  /**
   * Valor del contexto que se expone a los consumidores
   */
  const valorContexto: ValorContextoWebSocket = {
    socket: administradorRef.current?.obtenerSocket() || null,
    estaConectado,
    estadoConexion,
    ultimoError,
    intentosReconexion,
    latencia,
    reconectar,
    desconectar,
  };
  
  return (
    <ContextoWebSocket.Provider value={valorContexto}>
      {children}
    </ContextoWebSocket.Provider>
  );
}
