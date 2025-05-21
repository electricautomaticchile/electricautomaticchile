import { LRUCache } from 'lru-cache';
import { createHash } from 'crypto';

/**
 * Sistema de caché avanzado para MongoDB
 * Implementa LRU (Least Recently Used) para gestionar eficientemente la memoria
 */
export class CacheManager {
  private static instance: CacheManager;
  private caches: Map<string, LRUCache<string, any>>;
  private defaultTTL: number = 60 * 1000; // 1 minuto por defecto
  private defaultMaxItems: number = 1000;
  private stats: Record<string, {
    hits: number;
    misses: number;
    totalTime: number;
    queries: number;
  }>;

  private constructor() {
    this.caches = new Map();
    this.stats = {};
  }

  /**
   * Obtener la instancia única del CacheManager (Singleton)
   */
  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Crear o recuperar un caché para un namespace específico
   * @param namespace Namespace para segregar cachés por funcionalidad
   * @param options Opciones de configuración del caché
   */
  public getCache(
    namespace: string,
    options?: {
      ttl?: number;
      maxItems?: number;
      updateAgeOnGet?: boolean;
    }
  ): LRUCache<string, any> {
    if (!this.caches.has(namespace)) {
      const ttl = options?.ttl || this.defaultTTL;
      const maxItems = options?.maxItems || this.defaultMaxItems;
      const updateAgeOnGet = options?.updateAgeOnGet !== undefined ? options.updateAgeOnGet : true;

      this.caches.set(namespace, new LRUCache({
        max: maxItems,
        ttl: ttl,
        updateAgeOnGet: updateAgeOnGet,
        allowStale: false,
        dispose: (_value: any, key: string) => {
          console.debug(`[Cache ${namespace}] Eliminando clave: ${key.substring(0, 20)}...`);
        }
      }));

      // Inicializar estadísticas
      this.stats[namespace] = {
        hits: 0,
        misses: 0,
        totalTime: 0,
        queries: 0
      };

      console.info(`[Cache] Creado caché para namespace: ${namespace}`);
    }

    return this.caches.get(namespace)!;
  }

  /**
   * Generar una clave de caché a partir de una consulta y sus parámetros
   * @param query Consulta o identificador de la operación
   * @param params Parámetros de la consulta
   */
  public generateKey(query: string, params?: any): string {
    const paramString = params ? JSON.stringify(this.sortObjectDeep(params)) : '';
    const key = `${query}:${paramString}`;
    
    // Crear un hash para claves muy largas
    if (key.length > 100) {
      return createHash('md5').update(key).digest('hex');
    }
    
    return key;
  }

  /**
   * Ordenar un objeto profundamente para asegurar misma clave independiente del orden de propiedades
   */
  private sortObjectDeep(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectDeep(item));
    }

    return Object.keys(obj)
      .sort()
      .reduce((result: Record<string, any>, key) => {
        result[key] = this.sortObjectDeep(obj[key]);
        return result;
      }, {});
  }

  /**
   * Obtener un valor del caché, o ejecutar la función para calcularlo si no existe
   * @param namespace Espacio de nombres del caché
   * @param key Clave del valor en caché
   * @param fn Función para obtener el valor si no está en caché
   * @param options Opciones adicionales
   */
  public async wrap<T>(
    namespace: string,
    key: string,
    fn: () => Promise<T>,
    options?: {
      ttl?: number;
      bypassCache?: boolean;
      skipCache?: boolean;
    }
  ): Promise<T> {
    const cache = this.getCache(namespace);
    const bypassCache = options?.bypassCache || false;
    this.stats[namespace].queries++;
    
    const startTime = Date.now();
    let result: T;

    // Si se solicita bypasear el caché, ejecutar directo
    if (bypassCache) {
      result = await fn();
      
      // Si no se quiere guardar en caché
      if (options?.skipCache) {
        return result;
      }
      
      // Almacenar en caché con TTL específico o predeterminado
      const ttl = options?.ttl || null;
      if (ttl) {
        cache.set(key, result, { ttl });
      } else {
        cache.set(key, result);
      }
      
      this.stats[namespace].misses++;
      this.stats[namespace].totalTime += (Date.now() - startTime);
      return result;
    }

    // Verificar si existe en caché
    if (cache.has(key)) {
      this.stats[namespace].hits++;
      result = cache.get(key) as T;
    } else {
      // No existe en caché, ejecutar función
      result = await fn();
      
      // Almacenar en caché con TTL específico o predeterminado
      const ttl = options?.ttl || null;
      if (ttl) {
        cache.set(key, result, { ttl });
      } else {
        cache.set(key, result);
      }
      
      this.stats[namespace].misses++;
    }

    this.stats[namespace].totalTime += (Date.now() - startTime);
    return result;
  }

  /**
   * Invalida una clave específica en el caché
   * @param namespace Espacio de nombres del caché
   * @param key Clave a invalidar
   */
  public invalidate(namespace: string, key: string): boolean {
    if (!this.caches.has(namespace)) {
      return false;
    }
    
    return this.caches.get(namespace)!.delete(key);
  }

  /**
   * Invalidar múltiples claves basadas en un patrón
   * @param namespace Espacio de nombres del caché
   * @param pattern Patrón para coincidir con las claves (incluido en la clave)
   */
  public invalidatePattern(namespace: string, pattern: string): number {
    if (!this.caches.has(namespace)) {
      return 0;
    }
    
    const cache = this.caches.get(namespace)!;
    let count = 0;
    
    // Iterar sobre todas las claves y eliminar las que coincidan con el patrón
    const keys = Array.from(cache.keys());
    for (const key of keys) {
      if (key.includes(pattern)) {
        cache.delete(key);
        count++;
      }
    }
    
    return count;
  }

  /**
   * Limpiar todo el caché de un namespace
   * @param namespace Espacio de nombres del caché a limpiar
   */
  public clear(namespace: string): boolean {
    if (!this.caches.has(namespace)) {
      return false;
    }
    
    this.caches.get(namespace)!.clear();
    return true;
  }

  /**
   * Limpiar todos los cachés
   */
  public clearAll(): void {
    this.caches.forEach((cache, namespace) => {
      cache.clear();
      console.info(`[Cache] Limpiado caché: ${namespace}`);
    });
  }

  /**
   * Obtener estadísticas de uso del caché
   * @param namespace Opcional: espacio de nombres específico
   */
  public getStats(namespace?: string): any {
    if (namespace) {
      if (!this.stats[namespace]) {
        return null;
      }
      
      const stats = this.stats[namespace];
      const cache = this.caches.get(namespace);
      
      return {
        hits: stats.hits,
        misses: stats.misses,
        hitRatio: stats.queries > 0 ? stats.hits / stats.queries : 0,
        avgResponseTime: stats.queries > 0 ? stats.totalTime / stats.queries : 0,
        size: cache ? cache.size : 0,
        maxSize: cache ? (cache as any).max : 0
      };
    }
    
    // Estadísticas globales
    let totalHits = 0;
    let totalMisses = 0;
    let totalQueries = 0;
    let totalTime = 0;
    
    for (const ns in this.stats) {
      totalHits += this.stats[ns].hits;
      totalMisses += this.stats[ns].misses;
      totalQueries += this.stats[ns].queries;
      totalTime += this.stats[ns].totalTime;
    }
    
    return {
      namespaces: Object.keys(this.stats),
      totalCaches: this.caches.size,
      totalHits,
      totalMisses,
      hitRatio: totalQueries > 0 ? totalHits / totalQueries : 0,
      avgResponseTime: totalQueries > 0 ? totalTime / totalQueries : 0,
      cacheDetails: Object.keys(this.stats).map(ns => {
        const cache = this.caches.get(ns);
        return {
          namespace: ns,
          size: cache ? cache.size : 0,
          maxSize: cache ? (cache as any).max : 0,
          hitRatio: this.stats[ns].queries > 0 ? this.stats[ns].hits / this.stats[ns].queries : 0
        };
      })
    };
  }
}

// Exportar singleton
const cacheManager = CacheManager.getInstance();
export default cacheManager; 