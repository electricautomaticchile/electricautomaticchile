import mongoose from 'mongoose';
import dbConnection from './mongoose-connect';
import { conectarDB, crearIndiceCompuesto, crearIndiceTTL } from './mongo-helpers';

/**
 * Clase para gestionar la arquitectura de microservicios con MongoDB
 * Implementa patrones para asegurar la coherencia de datos entre microservicios
 */
export class DatabaseManager {
  private static instance: DatabaseManager;
  private isInitialized: boolean = false;
  private serviceName: string = '';
  private indicesCreados: Set<string> = new Set();

  private constructor() {}

  // Patrón Singleton
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  // Inicializar el gestor de base de datos
  public async initialize(serviceName: string): Promise<void> {
    if (this.isInitialized) {
      console.log(`DatabaseManager ya está inicializado para el servicio ${this.serviceName}`);
      return;
    }

    this.serviceName = serviceName;
    await conectarDB();
    
    console.log(`DatabaseManager inicializado para el servicio: ${serviceName}`);
    this.isInitialized = true;
    
    // Crear índices específicos para este servicio
    await this.crearIndicesParaServicio(serviceName);
  }

  // Verificar estado de la conexión
  public getStatus(): { isConnected: boolean; readyState: number; serviceName: string } {
    const { isConnected, readyState } = dbConnection.getStatus();
    return {
      isConnected,
      readyState,
      serviceName: this.serviceName
    };
  }

  // Crear índices específicos para cada servicio
  private async crearIndicesParaServicio(serviceName: string): Promise<void> {
    console.log(`Creando índices para el servicio: ${serviceName}`);
    
    switch (serviceName) {
      case 'dispositivos':
        await this.crearIndicesDispositivosService();
        break;
      case 'mediciones':
        await this.crearIndicesMedicionesService();
        break;
      case 'usuarios':
        await this.crearIndicesUsuariosService();
        break;
      case 'alertas':
        await this.crearIndicesAlertasService();
        break;
      case 'autenticacion':
        await this.crearIndicesAutenticacionService();
        break;
      default:
        console.log(`No hay índices específicos definidos para el servicio: ${serviceName}`);
    }
  }

  // Índices para el servicio de dispositivos
  private async crearIndicesDispositivosService(): Promise<void> {
    if (this.indicesCreados.has('dispositivos')) return;
    
    try {
      // Índices para consultas frecuentes de dispositivos
      await crearIndiceCompuesto('Dispositivo', { idDispositivo: 1 }, { unique: true });
      await crearIndiceCompuesto('Dispositivo', { cliente: 1, estado: 1 });
      await crearIndiceCompuesto('Dispositivo', { tipoDispositivo: 1, estado: 1 });
      await crearIndiceCompuesto('Dispositivo', { fechaUltimaConexion: -1 });
      
      this.indicesCreados.add('dispositivos');
    } catch (error) {
      console.error('Error al crear índices para servicio de dispositivos:', error);
    }
  }

  // Índices para el servicio de mediciones
  private async crearIndicesMedicionesService(): Promise<void> {
    if (this.indicesCreados.has('mediciones')) return;
    
    try {
      // Índices para consultas de mediciones
      await crearIndiceCompuesto('Medicion', { dispositivo: 1, fechaMedicion: -1 });
      await crearIndiceCompuesto('Medicion', { fechaMedicion: -1 });
      await crearIndiceCompuesto('Medicion', { 'consumo.valor': 1, fechaMedicion: -1 });
      await crearIndiceCompuesto('Medicion', { anomaliaDetectada: 1, fechaMedicion: -1 });
      
      // TTL índice para datos históricos (ejemplo: mantener mediciones detalladas por 90 días)
      await crearIndiceTTL('Medicion', 'fechaMedicion', 90 * 24 * 60 * 60); // 90 días
      
      this.indicesCreados.add('mediciones');
    } catch (error) {
      console.error('Error al crear índices para servicio de mediciones:', error);
    }
  }

  // Índices para el servicio de usuarios
  private async crearIndicesUsuariosService(): Promise<void> {
    if (this.indicesCreados.has('usuarios')) return;
    
    try {
      // Índices para el modelo Cliente
      await crearIndiceCompuesto('Cliente', { email: 1 }, { unique: true });
      await crearIndiceCompuesto('Cliente', { numeroCliente: 1 }, { unique: true });
      await crearIndiceCompuesto('Cliente', { rolCliente: 1 });
      
      this.indicesCreados.add('usuarios');
    } catch (error) {
      console.error('Error al crear índices para servicio de usuarios:', error);
    }
  }

  // Índices para el servicio de alertas
  private async crearIndicesAlertasService(): Promise<void> {
    if (this.indicesCreados.has('alertas')) return;
    
    try {
      // Índices para el modelo de notificaciones
      await crearIndiceCompuesto('Notificacion', { 'receptor.id': 1, leida: 1, fecha: -1 });
      await crearIndiceCompuesto('Notificacion', { tipo: 1, prioridad: 1, fecha: -1 });
      
      this.indicesCreados.add('alertas');
    } catch (error) {
      console.error('Error al crear índices para servicio de alertas:', error);
    }
  }

  // Índices para el servicio de autenticación
  private async crearIndicesAutenticacionService(): Promise<void> {
    if (this.indicesCreados.has('autenticacion')) return;
    
    try {
      // Índices para el modelo de registro de acceso
      await crearIndiceCompuesto('RegistroAcceso', { idUsuario: 1, timestamp: -1 });
      await crearIndiceCompuesto('RegistroAcceso', { ip: 1, exitoso: 1, timestamp: -1 });
      
      // TTL índice para registros de acceso antiguos (mantener por 180 días)
      await crearIndiceTTL('RegistroAcceso', 'timestamp', 180 * 24 * 60 * 60); // 180 días
      
      this.indicesCreados.add('autenticacion');
    } catch (error) {
      console.error('Error al crear índices para servicio de autenticación:', error);
    }
  }

  // Método para ejecutar operaciones atómicas entre microservicios
  public async executeMultiServiceOperation<T>(
    callback: (session: mongoose.ClientSession) => Promise<T>
  ): Promise<T> {
    if (!this.isInitialized) {
      throw new Error('DatabaseManager no está inicializado');
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      console.error('Error en operación multi-servicio:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Verificar estado de todos los servicios
  public async healthCheck(): Promise<Record<string, boolean>> {
    const services = ['dispositivos', 'mediciones', 'usuarios', 'alertas', 'autenticacion'];
    const health: Record<string, boolean> = {};
    
    try {
      const { isConnected } = dbConnection.getStatus();
      
      // Base de datos principal
      health.database = isConnected;
      
      // Comprobar cada servicio (aquí podríamos hacer más verificaciones específicas)
      for (const service of services) {
        health[service] = isConnected;
      }
      
      return health;
    } catch (error) {
      console.error('Error en health check:', error);
      return {
        database: false,
        ...services.reduce((acc, service) => ({ ...acc, [service]: false }), {})
      };
    }
  }

  // Obtener estadísticas de uso por servicio
  public async getDatabaseStats(): Promise<Record<string, any>> {
    try {
      await conectarDB();
      const db = mongoose.connection.db;
      
      if (!db) {
        throw new Error('No se pudo acceder a la base de datos');
      }
      
      const stats = await db.stats();
      const collections = await db.listCollections().toArray();
      
      const collectionStats: Record<string, any> = {};
      
      for (const collection of collections) {
        const collName = collection.name;
        // Usamos command para obtener stats ya que el método stats() no está tipado correctamente
        const collStats = await db.command({ collStats: collName });
        
        collectionStats[collName] = {
          count: collStats.count,
          size: collStats.size,
          avgObjSize: collStats.avgObjSize
        };
      }
      
      return {
        dbName: stats.db,
        collections: collections.length,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        collectionDetails: collectionStats
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de la base de datos:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
const dbManager = DatabaseManager.getInstance();
export default dbManager; 