import mongoose from 'mongoose';
import securityValidator from '../config/security';

// Obtener la configuración de seguridad validada
let mongodbUri: string;
try {
  const securityConfig = securityValidator.validateEnvironment();
  mongodbUri = securityConfig.mongodbUri;
} catch (error) {
  console.error('Error de configuración de seguridad:', error);
  throw error;
}

// Singleton para la conexión de Mongoose
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;
  private connectionPromise: Promise<typeof mongoose> | null = null;

  private constructor() {}

  // Patrón Singleton para garantizar una única instancia
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  // Conexión a MongoDB con opciones optimizadas
  public async connect(): Promise<typeof mongoose> {
    // Si ya estamos conectados, devolver la conexión existente
    if (this.isConnected) {
      return mongoose;
    }

    // Si ya hay una conexión en progreso, esperar a que termine
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Opciones optimizadas para la conexión a MongoDB
    const options = {
      serverSelectionTimeoutMS: 10000, // Tiempo de espera para la selección del servidor
      socketTimeoutMS: 45000,          // Tiempo de espera para las operaciones del socket
      connectTimeoutMS: 30000,         // Tiempo de espera para la conexión inicial
      maxPoolSize: 20,                 // Tamaño máximo del pool de conexiones
      minPoolSize: 5,                  // Tamaño mínimo del pool de conexiones
      // Nota: No configurar SSL/TLS ya que está en la URI
      retryWrites: true,               // Reintentar operaciones de escritura fallidas
      maxIdleTimeMS: 30000,            // Tiempo máximo de inactividad
      heartbeatFrequencyMS: 10000      // Frecuencia de comprobación de conexión
    };

    try {
      // Configurar eventos de Mongoose para monitoreo
      mongoose.connection.on('connected', () => {
        console.log('MongoDB conectado correctamente');
        this.isConnected = true;
      });

      mongoose.connection.on('error', (err) => {
        console.error('Error de conexión a MongoDB:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB desconectado');
        this.isConnected = false;
      });

      // Gestionar cierre de la aplicación
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('Conexión a MongoDB cerrada por terminación de la aplicación');
        process.exit(0);
      });

      // Realizar la conexión
      this.connectionPromise = mongoose.connect(mongodbUri, options);
      await this.connectionPromise;
      this.isConnected = true;
      this.connectionPromise = null;
      
      return mongoose;
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
      this.connectionPromise = null;
      this.isConnected = false;
      throw error;
    }
  }

  // Método para obtener la conexión actual
  public getConnection(): typeof mongoose {
    return mongoose;
  }

  // Método para verificar el estado de la conexión
  public getStatus(): { isConnected: boolean, readyState: number } {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState
    };
  }

  // Método para cerrar la conexión de manera segura
  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('Conexión a MongoDB cerrada exitosamente');
    }
  }
}

// Exportar una instancia única para uso en toda la aplicación
const dbConnection = DatabaseConnection.getInstance();

export default dbConnection; 