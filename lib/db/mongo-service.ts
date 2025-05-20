import mongoose, { FilterQuery, UpdateQuery, PopulateOptions, Model, Document, PipelineStage } from 'mongoose';
import cacheManager from '../cache/cacheManager';
import { conectarDB } from './mongo-helpers';
import { convertirAObjectId, sanitizarConsulta } from './mongo-helpers';

/**
 * Clase genérica para operaciones CRUD con MongoDB usando caché
 * Proporciona funcionalidades comunes para trabajar con modelos de mongoose
 */
export class MongoService<T extends Document> {
  protected readonly modelo: Model<T>;
  protected readonly nombreModelo: string;
  protected readonly nombreCache: string;
  protected readonly defaultTTL: number;
  protected readonly maxCacheItems: number;
  
  /**
   * Constructor para el servicio de MongoDB
   * @param modelo El modelo de mongoose
   * @param options Opciones de configuración del servicio
   */
  constructor(
    modelo: Model<T>,
    options?: {
      nombreCache?: string;
      defaultTTL?: number;
      maxCacheItems?: number;
      cachePorDefecto?: boolean;
    }
  ) {
    if (!modelo) {
      throw new Error('El modelo es requerido');
    }
    
    this.modelo = modelo;
    this.nombreModelo = modelo.modelName;
    this.nombreCache = options?.nombreCache || `${modelo.modelName.toLowerCase()}_cache`;
    this.defaultTTL = options?.defaultTTL || 5 * 60 * 1000; // 5 minutos por defecto
    this.maxCacheItems = options?.maxCacheItems || 500;
    
    // Inicializar el caché para este modelo
    cacheManager.getCache(this.nombreCache, {
      ttl: this.defaultTTL,
      maxItems: this.maxCacheItems
    });
  }

  /**
   * Crear un nuevo documento
   * @param datos Datos para crear el documento
   */
  async crear(datos: Partial<T>): Promise<T> {
    await conectarDB();
    
    try {
      const nuevoDocumento = new this.modelo(datos);
      await nuevoDocumento.save();
      
      // Invalidar caché relacionado con listados
      this.invalidarCacheDeListas();
      
      return nuevoDocumento;
    } catch (error) {
      console.error(`Error al crear ${this.nombreModelo}:`, error);
      throw error;
    }
  }

  /**
   * Obtener un documento por su ID
   * @param id ID del documento
   * @param opciones Opciones adicionales como populate o selección de campos
   */
  async obtenerPorId(
    id: string,
    opciones?: {
      populate?: string | string[] | PopulateOptions | PopulateOptions[];
      select?: string;
      bypassCache?: boolean;
    }
  ): Promise<T | null> {
    if (!id) {
      throw new Error('ID es requerido');
    }
    
    await conectarDB();
    
    // Generar clave de caché
    const cacheKey = cacheManager.generateKey(`${this.nombreModelo}_id`, {
      id,
      populate: opciones?.populate,
      select: opciones?.select
    });
    
    // Función para ejecutar la consulta
    const ejecutarConsulta = async (): Promise<T | null> => {
      try {
        let query = this.modelo.findById(convertirAObjectId(id));
        
        if (opciones?.populate) {
          query = query.populate(opciones.populate);
        }
        
        if (opciones?.select) {
          query = query.select(opciones.select);
        }
        
        return await query.exec();
      } catch (error) {
        console.error(`Error al obtener ${this.nombreModelo} por ID:`, error);
        throw error;
      }
    };
    
    // Usar el caché si no se solicita bypasear
    return cacheManager.wrap<T | null>(
      this.nombreCache,
      cacheKey,
      ejecutarConsulta,
      {
        bypassCache: opciones?.bypassCache,
        ttl: this.defaultTTL
      }
    );
  }

  /**
   * Obtener documentos según un filtro
   * @param filtro Filtro para la consulta
   * @param opciones Opciones adicionales
   */
  async obtener(
    filtro: FilterQuery<T> = {},
    opciones?: {
      ordenarPor?: string;
      direccion?: 'asc' | 'desc';
      limite?: number;
      salto?: number;
      populate?: string | string[] | PopulateOptions | PopulateOptions[];
      select?: string;
      bypassCache?: boolean;
    }
  ): Promise<T[]> {
    await conectarDB();
    
    // Sanear el filtro para evitar inyecciones
    const filtroSaneado = sanitizarConsulta(filtro);
    
    // Generar clave de caché
    const cacheKey = cacheManager.generateKey(`${this.nombreModelo}_find`, {
      filtro: filtroSaneado,
      ordenarPor: opciones?.ordenarPor,
      direccion: opciones?.direccion,
      limite: opciones?.limite,
      salto: opciones?.salto,
      populate: opciones?.populate,
      select: opciones?.select
    });
    
    // Función para ejecutar la consulta
    const ejecutarConsulta = async (): Promise<T[]> => {
      try {
        // Construir la consulta base
        let query = this.modelo.find(filtroSaneado);
        
        // Aplicar ordenamiento
        if (opciones?.ordenarPor) {
          const orden = opciones.direccion === 'desc' ? `-${opciones.ordenarPor}` : opciones.ordenarPor;
          query = query.sort(orden);
        }
        
        // Aplicar paginación
        if (opciones?.limite !== undefined) {
          query = query.limit(opciones.limite);
          
          if (opciones?.salto !== undefined) {
            query = query.skip(opciones.salto);
          }
        }
        
        // Aplicar populate
        if (opciones?.populate) {
          query = query.populate(opciones.populate);
        }
        
        // Aplicar selección de campos
        if (opciones?.select) {
          query = query.select(opciones.select);
        }
        
        // Ejecutar la consulta
        return await query.exec();
      } catch (error) {
        console.error(`Error al obtener ${this.nombreModelo}:`, error);
        throw error;
      }
    };
    
    // Usar el caché si no se solicita bypasear
    return cacheManager.wrap<T[]>(
      this.nombreCache,
      cacheKey,
      ejecutarConsulta,
      {
        bypassCache: opciones?.bypassCache,
        ttl: this.defaultTTL
      }
    );
  }

  /**
   * Actualizar un documento por su ID
   * @param id ID del documento
   * @param actualizacion Campos a actualizar
   * @param opciones Opciones adicionales
   */
  async actualizar(
    id: string,
    actualizacion: UpdateQuery<T>,
    opciones?: {
      new?: boolean;
      runValidators?: boolean;
      populate?: string | string[] | PopulateOptions | PopulateOptions[];
    }
  ): Promise<T | null> {
    if (!id) {
      throw new Error('ID es requerido');
    }
    
    await conectarDB();
    
    try {
      // Definir opciones por defecto
      const opcionesPorDefecto = {
        new: true,
        runValidators: true,
        ...opciones
      };
      
      // Ejecutar la actualización
      let query = this.modelo.findByIdAndUpdate(
        convertirAObjectId(id),
        actualizacion,
        opcionesPorDefecto
      );
      
      // Aplicar populate si es necesario
      if (opciones?.populate) {
        query = query.populate(opciones.populate);
      }
      
      const resultado = await query.exec();
      
      // Invalidar la entrada de caché para este documento
      if (resultado) {
        this.invalidarCacheDeDocumento(id);
        this.invalidarCacheDeListas();
      }
      
      return resultado;
    } catch (error) {
      console.error(`Error al actualizar ${this.nombreModelo}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un documento por su ID
   * @param id ID del documento a eliminar
   */
  async eliminar(id: string): Promise<T | null> {
    if (!id) {
      throw new Error('ID es requerido');
    }
    
    await conectarDB();
    
    try {
      const resultado = await this.modelo.findByIdAndDelete(convertirAObjectId(id)).exec();
      
      // Invalidar caché si se eliminó correctamente
      if (resultado) {
        this.invalidarCacheDeDocumento(id);
        this.invalidarCacheDeListas();
      }
      
      return resultado;
    } catch (error) {
      console.error(`Error al eliminar ${this.nombreModelo}:`, error);
      throw error;
    }
  }

  /**
   * Obtener documentos con paginación
   * @param filtro Filtro para la consulta
   * @param opciones Opciones de paginación
   */
  async obtenerPaginado(
    filtro: FilterQuery<T> = {},
    opciones?: {
      pagina?: number;
      limite?: number;
      ordenarPor?: string;
      direccion?: 'asc' | 'desc';
      populate?: string | string[] | PopulateOptions | PopulateOptions[];
      select?: string;
      bypassCache?: boolean;
    }
  ): Promise<{
    datos: T[];
    paginacion: {
      total: number;
      paginas: number;
      paginaActual: number;
      limite: number;
      haySiguiente: boolean;
      hayAnterior: boolean;
    };
  }> {
    await conectarDB();
    
    // Valores por defecto
    const pagina = opciones?.pagina || 1;
    const limite = opciones?.limite || 10;
    const salto = (pagina - 1) * limite;
    
    // Sanear el filtro para evitar inyecciones
    const filtroSaneado = sanitizarConsulta(filtro);
    
    // Generar clave de caché
    const cacheKey = cacheManager.generateKey(`${this.nombreModelo}_paginated`, {
      filtro: filtroSaneado,
      pagina,
      limite,
      ordenarPor: opciones?.ordenarPor,
      direccion: opciones?.direccion,
      populate: opciones?.populate,
      select: opciones?.select
    });
    
    // Función para ejecutar la consulta
    const ejecutarConsulta = async () => {
      try {
        // Obtener los documentos para la página actual
        const datos = await this.obtener(filtroSaneado, {
          ordenarPor: opciones?.ordenarPor,
          direccion: opciones?.direccion,
          limite,
          salto,
          populate: opciones?.populate,
          select: opciones?.select,
          bypassCache: true // Evitar caché anidado
        });
        
        // Contar el total de documentos sin paginación
        const total = await this.modelo.countDocuments(filtroSaneado).exec();
        
        // Calcular número total de páginas
        const paginas = Math.ceil(total / limite);
        
        return {
          datos,
          paginacion: {
            total,
            paginas,
            paginaActual: pagina,
            limite,
            haySiguiente: pagina < paginas,
            hayAnterior: pagina > 1
          }
        };
      } catch (error) {
        console.error(`Error al obtener ${this.nombreModelo} paginado:`, error);
        throw error;
      }
    };
    
    // Usar el caché si no se solicita bypasear
    return cacheManager.wrap(
      this.nombreCache,
      cacheKey,
      ejecutarConsulta,
      {
        bypassCache: opciones?.bypassCache,
        ttl: this.defaultTTL
      }
    );
  }

  /**
   * Ejecutar una operación de agregación con caché
   * @param pipeline Pipeline de agregación
   * @param opciones Opciones adicionales
   */
  async agregar<R = any>(
    pipeline: PipelineStage[],
    opciones?: {
      allowDiskUse?: boolean;
      bypassCache?: boolean;
      ttl?: number;
    }
  ): Promise<R[]> {
    await conectarDB();
    
    // Generar clave de caché
    const cacheKey = cacheManager.generateKey(`${this.nombreModelo}_aggregate`, {
      pipeline,
      allowDiskUse: opciones?.allowDiskUse
    });
    
    // Función para ejecutar la agregación
    const ejecutarAgregacion = async (): Promise<R[]> => {
      try {
        const aggregateOptions = {
          allowDiskUse: opciones?.allowDiskUse ?? true
        };
        
        return await this.modelo.aggregate(pipeline, aggregateOptions).exec();
      } catch (error) {
        console.error(`Error en agregación de ${this.nombreModelo}:`, error);
        throw error;
      }
    };
    
    // Usar el caché si no se solicita bypasear
    return cacheManager.wrap<R[]>(
      this.nombreCache,
      cacheKey,
      ejecutarAgregacion,
      {
        bypassCache: opciones?.bypassCache,
        ttl: opciones?.ttl || this.defaultTTL
      }
    );
  }

  /**
   * Contar documentos que coinciden con un filtro
   * @param filtro Filtro para contar documentos
   * @param opciones Opciones adicionales
   */
  async contar(
    filtro: FilterQuery<T> = {},
    opciones?: {
      bypassCache?: boolean;
    }
  ): Promise<number> {
    await conectarDB();
    
    // Sanear el filtro para evitar inyecciones
    const filtroSaneado = sanitizarConsulta(filtro);
    
    // Generar clave de caché
    const cacheKey = cacheManager.generateKey(`${this.nombreModelo}_count`, {
      filtro: filtroSaneado
    });
    
    // Función para ejecutar el conteo
    const ejecutarConteo = async (): Promise<number> => {
      try {
        return await this.modelo.countDocuments(filtroSaneado).exec();
      } catch (error) {
        console.error(`Error al contar ${this.nombreModelo}:`, error);
        throw error;
      }
    };
    
    // Usar el caché si no se solicita bypasear
    return cacheManager.wrap<number>(
      this.nombreCache,
      cacheKey,
      ejecutarConteo,
      {
        bypassCache: opciones?.bypassCache,
        ttl: this.defaultTTL
      }
    );
  }

  /**
   * Invalidar caché específico para un documento
   * @param id ID del documento
   */
  invalidarCacheDeDocumento(id: string): void {
    cacheManager.invalidatePattern(this.nombreCache, id);
  }

  /**
   * Invalidar caché relacionado con listados
   */
  invalidarCacheDeListas(): void {
    cacheManager.invalidatePattern(this.nombreCache, `${this.nombreModelo}_find`);
    cacheManager.invalidatePattern(this.nombreCache, `${this.nombreModelo}_paginated`);
    cacheManager.invalidatePattern(this.nombreCache, `${this.nombreModelo}_count`);
    cacheManager.invalidatePattern(this.nombreCache, `${this.nombreModelo}_aggregate`);
  }

  /**
   * Limpiar todo el caché para este modelo
   */
  limpiarCache(): void {
    cacheManager.clear(this.nombreCache);
  }

  /**
   * Obtener estadísticas de uso del caché
   */
  obtenerEstadisticasCache(): any {
    return cacheManager.getStats(this.nombreCache);
  }
}

export default MongoService; 