import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/electricautomaticchile';

if (!process.env.MONGODB_URI) {
  console.warn("La variable de entorno MONGODB_URI no está configurada. Usando URI local por defecto.");
}

/**
 * Variables globales
 */
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: CachedConnection = (global as any).mongoose || { conn: null, promise: null };

if (!(global as any).mongoose) {
  (global as any).mongoose = cached;
}

/**
 * Conectar a MongoDB
 */
export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
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