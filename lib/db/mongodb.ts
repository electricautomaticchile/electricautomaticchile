import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/electricautomaticchile';

if (!process.env.MONGODB_URI) {
  console.warn("La variable de entorno MONGODB_URI no está configurada. Usando URI local por defecto.");
}

/**
 * Variables globales para la conexión
 */
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Guardar la conexión en una variable global para reutilizarla
let cached: CachedConnection = (global as any).mongoose || { conn: null, promise: null };

if (!(global as any).mongoose) {
  (global as any).mongoose = cached;
}

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
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    // Configuración de conexión robusta
    const opts = {
      bufferCommands: true,  // Permitir comandos en búfer
      autoIndex: true,       // Construir índices
      maxPoolSize: 10,       // Máximo número de conexiones en el pool
      serverSelectionTimeoutMS: 30000, // Tiempo para seleccionar un servidor
      socketTimeoutMS: 45000,  // Tiempo para timeout de operaciones de socket
      family: 4,              // Usar IPv4
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    };

    // Agregar oyentes de eventos para manejo de errores y reconexión
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
      cached.conn = null;
      cached.promise = null;
    });

    // Crear la promesa de conexión
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      console.log('MongoDB connected successfully');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase; 