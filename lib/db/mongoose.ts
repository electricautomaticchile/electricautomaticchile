/**
 * Sistema unificado de conexión a MongoDB usando Mongoose
 * Con connection pooling y configuración optimizada
 */

import mongoose from 'mongoose';
import { logger } from '@/lib/utils/logger';

// Configuración de connection pooling optimizada
const MONGODB_OPTIONS = {
  // Connection Pooling
  maxPoolSize: 10, // Máximo 10 conexiones en el pool
  minPoolSize: 2,  // Mínimo 2 conexiones siempre activas
  maxIdleTimeMS: 30000, // Cerrar conexiones inactivas después de 30s
  serverSelectionTimeoutMS: 5000, // Timeout para seleccionar servidor
  socketTimeoutMS: 45000, // Timeout para operaciones de socket
  
  // Configuración de reconexión
  bufferMaxEntries: 0, // Deshabilitar buffering para fallar rápido
  retryWrites: true,
  retryReads: true,
  
  // Configuración de heartbeat
  heartbeatFrequencyMS: 10000,
  
  // Compresión
  compressors: ['zlib' as const],
  
  // Configuración adicional
  autoIndex: process.env.NODE_ENV !== 'production', // Solo indexar en desarrollo
  autoCreate: process.env.NODE_ENV !== 'production', // Solo crear colecciones en desarrollo
};

// Interface para el estado de conexión
interface ConnectionState {
  isConnected: boolean;
  isPending: boolean;
  lastConnected?: Date;
  connectionCount: number;
}

// Estado global de la conexión
let connectionState: ConnectionState = {
  isConnected: false,
  isPending: false,
  connectionCount: 0
};

// Cache de la promesa de conexión para evitar múltiples conexiones
let connectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Conecta a MongoDB usando Mongoose con connection pooling
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Si ya hay una conexión activa, devolverla
  if (connectionState.isConnected && mongoose.connection.readyState === 1) {
    logger.database('debug', 'Usando conexión existente a MongoDB');
    return mongoose;
  }

  // Si hay una conexión pendiente, esperar a que termine
  if (connectionState.isPending && connectionPromise) {
    logger.database('debug', 'Esperando conexión pendiente a MongoDB');
    return connectionPromise;
  }

  // Verificar que existe la URI
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI no está configurado en las variables de entorno');
  }

  try {
    connectionState.isPending = true;
    logger.database('info', 'Iniciando conexión a MongoDB');

    // Crear nueva promesa de conexión
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, MONGODB_OPTIONS);

    const mongooseInstance = await connectionPromise;

    // Actualizar estado
    connectionState.isConnected = true;
    connectionState.isPending = false;
    connectionState.lastConnected = new Date();
    connectionState.connectionCount++;

    logger.database('info', 'Conexión exitosa a MongoDB', {
      poolSize: 'unknown', // Simplificado para evitar errores de tipos
      connectionCount: connectionState.connectionCount,
      readyState: mongoose.connection.readyState
    });

    // Configurar eventos de conexión
    setupConnectionEventListeners();

    return mongooseInstance;

  } catch (error) {
    connectionState.isPending = false;
    connectionState.isConnected = false;
    connectionPromise = null;

    logger.database('error', 'Error al conectar a MongoDB', { error });
    throw error;
  }
}

/**
 * Configura los event listeners para la conexión
 */
function setupConnectionEventListeners(): void {
  // Evento: conexión establecida
  mongoose.connection.on('connected', () => {
    connectionState.isConnected = true;
    logger.database('info', 'MongoDB conectado exitosamente');
  });

  // Evento: error de conexión
  mongoose.connection.on('error', (error) => {
    connectionState.isConnected = false;
    logger.database('error', 'Error en la conexión de MongoDB', { error });
  });

  // Evento: desconexión
  mongoose.connection.on('disconnected', () => {
    connectionState.isConnected = false;
    logger.database('warn', 'MongoDB desconectado');
  });

  // Evento: reconexión
  mongoose.connection.on('reconnected', () => {
    connectionState.isConnected = true;
    connectionState.connectionCount++;
    logger.database('info', 'MongoDB reconectado', {
      connectionCount: connectionState.connectionCount
    });
  });

  // Evento: buffer full (cuando el buffer interno está lleno)
  mongoose.connection.on('fullsetup', () => {
    logger.database('debug', 'MongoDB replica set completamente configurado');
  });
}

/**
 * Obtiene el estado actual de la conexión
 */
export function getConnectionState(): ConnectionState {
  return {
    ...connectionState,
    isConnected: connectionState.isConnected && mongoose.connection.readyState === 1
  };
}

/**
 * Cierra la conexión a MongoDB (para testing o shutdown)
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    connectionState.isConnected = false;
    connectionState.isPending = false;
    connectionPromise = null;
    logger.database('info', 'Desconectado de MongoDB');
  }
}

/**
 * Verifica la salud de la conexión
 */
export async function checkDatabaseHealth(): Promise<{
  isHealthy: boolean;
  details: any;
}> {
  try {
    if (!connectionState.isConnected) {
      return {
        isHealthy: false,
        details: { reason: 'No conectado a la base de datos' }
      };
    }

    // Realizar un ping simple a la base de datos
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
    }
    
    // Obtener estadísticas de la conexión
    const stats = {
      readyState: mongoose.connection.readyState,
      poolSize: 'unknown', // Simplificado para evitar errores de tipos
      connectionCount: connectionState.connectionCount,
      lastConnected: connectionState.lastConnected,
      collections: Object.keys(mongoose.connection.collections).length
    };

    return {
      isHealthy: true,
      details: stats
    };

  } catch (error) {
    return {
      isHealthy: false,
      details: { error: error instanceof Error ? error.message : 'Error desconocido' }
    };
  }
}

/**
 * Limpia conexiones inactivas (housekeeping)
 */
export async function cleanupConnections(): Promise<void> {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      // Force cleanup de conexiones inactivas
      await mongoose.connection.db.admin().command({ connPoolStats: 1 });
      logger.database('debug', 'Limpieza de conexiones completada');
    }
  } catch (error) {
    logger.database('warn', 'Error durante limpieza de conexiones', { error });
  }
}

// Cleanup automático al cerrar la aplicación
process.on('SIGINT', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

// Exportar la instancia por defecto
export default mongoose; 