import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/electricautomaticchile';

if (!process.env.MONGODB_URI) {
  console.warn("La variable de entorno MONGODB_URI no está configurada. Usando URI local por defecto.");
}

// Configurar mongoose globalmente
mongoose.set('strictQuery', false);

/**
 * Variables globales para la conexión
 */
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnecting: boolean;
}

// Guardar la conexión en una variable global para reutilizarla
let cached: CachedConnection = (global as any).mongoose || { 
  conn: null, 
  promise: null, 
  isConnecting: false 
};

if (!(global as any).mongoose) {
  (global as any).mongoose = cached;
}

// Contador de intentos de conexión
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

/**
 * Conectar a MongoDB con reconexión
 */
export async function connectToDatabase() {
  if (cached.conn) {
    // Verificar si la conexión está activa
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    }
    // Si no está activa, resetear para intentar de nuevo
    console.warn('Conexión inactiva, reiniciando...');
    cached.conn = null;
    cached.promise = null;
  }

  // Evitar múltiples intentos de conexión simultáneos
  if (cached.isConnecting) {
    console.log('Conexión en progreso, esperando...');
    try {
      // Esperar hasta que la conexión en progreso termine
      if (cached.promise) {
        return await cached.promise;
      }
    } catch (error) {
      // Si hay error durante la espera, continuar con un nuevo intento
      console.error('Error mientras esperaba conexión:', error);
      cached.isConnecting = false;
    }
  }

  try {
    cached.isConnecting = true;

    if (!cached.promise) {
      // Configuración de conexión robusta
      const opts = {
        bufferCommands: true,  // Permitir comandos en búfer
        autoIndex: true,       // Construir índices
        maxPoolSize: 10,       // Máximo número de conexiones en el pool
        minPoolSize: 3,        // Mínimo número de conexiones en el pool
        serverSelectionTimeoutMS: 10000, // ⬅️ Reducido a 10 segundos
        socketTimeoutMS: 30000,  // ⬅️ Reducido a 30 segundos
        connectTimeoutMS: 10000, // ⬅️ Tiempo de conexión 10 segundos
        heartbeatFrequencyMS: 5000, // Frecuencia de comprobación
        family: 4,              // Usar IPv4
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
        retryWrites: true,      // Reintentar escrituras fallidas
        retryReads: true,       // Reintentar lecturas fallidas
      };

      console.log(`Intentando conexión a MongoDB (intento ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})...`);

      // Agregar oyentes de eventos para manejo de errores y reconexión
      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
        // No resetear conexión aquí para evitar bucles
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting to reconnect...');
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          cached.conn = null;
          cached.promise = null;
          cached.isConnecting = false;
          // No llamar a connectToDatabase() aquí para evitar bucles
        } else {
          console.error(`Máximo número de intentos alcanzado (${MAX_RECONNECT_ATTEMPTS}). Deteniendo reconexión.`);
        }
      });

      mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
        reconnectAttempts = 0; // Resetear contador cuando se conecta exitosamente
      });

      // Crear la promesa de conexión
      cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
        return mongoose;
      });
    }
    
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error('Error al conectar a MongoDB:', e);
    cached.promise = null;
    throw e;
  } finally {
    cached.isConnecting = false;
  }
}

export default connectToDatabase; 