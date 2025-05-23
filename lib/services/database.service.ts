/**
 * Servicio centralizado para operaciones de base de datos
 */

import { Document, Model, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongoose';
import { logger } from '@/lib/utils/logger';
import { 
  BaseDocument, 
  PaginationParams, 
  PaginationInfo, 
  SearchFilters,
  CreateInput,
  UpdateInput,
  ApiResponse 
} from '@/lib/types/database';

export class DatabaseService<T extends BaseDocument> {
  private model: Model<T>;
  private modelName: string;

  constructor(model: Model<T>) {
    this.model = model;
    this.modelName = model.modelName;
  }

  /**
   * Conecta a la base de datos antes de cualquier operación
   */
  private async ensureConnection(): Promise<void> {
    await connectToDatabase();
  }

  /**
   * Crear un nuevo documento
   */
  async create(data: CreateInput<T>): Promise<T> {
    try {
      await this.ensureConnection();
      
      const document = new this.model(data);
      const saved = await document.save();
      
      logger.database('info', `Documento creado en ${this.modelName}`, {
        id: saved._id,
        model: this.modelName
      });
      
      return saved;
    } catch (error) {
      logger.database('error', `Error creando documento en ${this.modelName}`, { error });
      throw error;
    }
  }

  /**
   * Buscar documento por ID
   */
  async findById(id: string, populate?: string[]): Promise<T | null> {
    try {
      await this.ensureConnection();
      
      let query = this.model.findById(id);
      
      if (populate) {
        populate.forEach(path => {
          query = query.populate(path);
        });
      }
      
      const document = await query.exec();
      
      if (document) {
        logger.database('debug', `Documento encontrado en ${this.modelName}`, {
          id,
          model: this.modelName
        });
      }
      
      return document;
    } catch (error) {
      logger.database('error', `Error buscando documento por ID en ${this.modelName}`, { error, id });
      throw error;
    }
  }

  /**
   * Buscar un documento por filtros
   */
  async findOne(filter: FilterQuery<T>, populate?: string[]): Promise<T | null> {
    try {
      await this.ensureConnection();
      
      let query = this.model.findOne(filter);
      
      if (populate) {
        populate.forEach(path => {
          query = query.populate(path);
        });
      }
      
      return await query.exec();
    } catch (error) {
      logger.database('error', `Error buscando documento en ${this.modelName}`, { error, filter });
      throw error;
    }
  }

  /**
   * Buscar múltiples documentos con paginación
   */
  async findMany(
    filter: FilterQuery<T> = {},
    pagination: PaginationParams = {},
    populate?: string[]
  ): Promise<{
    documents: T[];
    pagination: PaginationInfo;
  }> {
    try {
      await this.ensureConnection();
      
      const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = pagination;
      const skip = (page - 1) * limit;
      
      // Construir query
      let query = this.model.find(filter);
      
      // Aplicar población
      if (populate) {
        populate.forEach(path => {
          query = query.populate(path);
        });
      }
      
      // Aplicar ordenamiento
      const sortObj: any = {};
      sortObj[sort] = order === 'asc' ? 1 : -1;
      query = query.sort(sortObj);
      
      // Aplicar paginación
      query = query.skip(skip).limit(limit);
      
      // Ejecutar query y contar total
      const [documents, total] = await Promise.all([
        query.exec(),
        this.model.countDocuments(filter)
      ]);
      
      const pages = Math.ceil(total / limit);
      
      const paginationInfo: PaginationInfo = {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      };
      
      logger.database('debug', `Documentos encontrados en ${this.modelName}`, {
        count: documents.length,
        total,
        page,
        model: this.modelName
      });
      
      return {
        documents,
        pagination: paginationInfo
      };
    } catch (error) {
      logger.database('error', `Error buscando documentos en ${this.modelName}`, { error, filter });
      throw error;
    }
  }

  /**
   * Actualizar documento por ID
   */
  async updateById(
    id: string, 
    update: any, 
    options: QueryOptions = { new: true }
  ): Promise<T | null> {
    try {
      await this.ensureConnection();
      
      const document = await this.model.findByIdAndUpdate(id, update, options) as T | null;
      
      if (document) {
        logger.database('info', `Documento actualizado en ${this.modelName}`, {
          id,
          model: this.modelName
        });
      }
      
      return document;
    } catch (error) {
      logger.database('error', `Error actualizando documento en ${this.modelName}`, { error, id });
      throw error;
    }
  }

  /**
   * Actualizar múltiples documentos
   */
  async updateMany(
    filter: FilterQuery<T>,
    update: any
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      await this.ensureConnection();
      
      const result = await this.model.updateMany(filter, update);
      
      logger.database('info', `Documentos actualizados en ${this.modelName}`, {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        model: this.modelName
      });
      
      return {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      };
    } catch (error) {
      logger.database('error', `Error actualizando documentos en ${this.modelName}`, { error, filter });
      throw error;
    }
  }

  /**
   * Eliminar documento por ID
   */
  async deleteById(id: string): Promise<T | null> {
    try {
      await this.ensureConnection();
      
      const document = await this.model.findByIdAndDelete(id);
      
      if (document) {
        logger.database('info', `Documento eliminado en ${this.modelName}`, {
          id,
          model: this.modelName
        });
      }
      
      return document;
    } catch (error) {
      logger.database('error', `Error eliminando documento en ${this.modelName}`, { error, id });
      throw error;
    }
  }

  /**
   * Eliminar múltiples documentos
   */
  async deleteMany(filter: FilterQuery<T>): Promise<{ deletedCount: number }> {
    try {
      await this.ensureConnection();
      
      const result = await this.model.deleteMany(filter);
      
      logger.database('info', `Documentos eliminados en ${this.modelName}`, {
        deleted: result.deletedCount,
        model: this.modelName
      });
      
      return {
        deletedCount: result.deletedCount || 0
      };
    } catch (error) {
      logger.database('error', `Error eliminando documentos en ${this.modelName}`, { error, filter });
      throw error;
    }
  }

  /**
   * Contar documentos
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      await this.ensureConnection();
      return await this.model.countDocuments(filter);
    } catch (error) {
      logger.database('error', `Error contando documentos en ${this.modelName}`, { error, filter });
      throw error;
    }
  }

  /**
   * Verificar si existe un documento
   */
  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      await this.ensureConnection();
      const document = await this.model.findOne(filter).select('_id').lean();
      return !!document;
    } catch (error) {
      logger.database('error', `Error verificando existencia en ${this.modelName}`, { error, filter });
      throw error;
    }
  }

  /**
   * Búsqueda con texto completo (si el modelo tiene índices de texto)
   */
  async search(
    searchTerm: string,
    filters: SearchFilters = {},
    pagination: PaginationParams = {}
  ): Promise<{
    documents: T[];
    pagination: PaginationInfo;
  }> {
    try {
      await this.ensureConnection();
      
      const query: FilterQuery<T> = {
        $text: { $search: searchTerm },
        ...filters
      } as FilterQuery<T>;
      
      return await this.findMany(query, pagination);
    } catch (error) {
      logger.database('error', `Error en búsqueda de texto en ${this.modelName}`, { error, searchTerm });
      throw error;
    }
  }

  /**
   * Agregación personalizada
   */
  async aggregate(pipeline: any[]): Promise<any[]> {
    try {
      await this.ensureConnection();
      
      const result = await this.model.aggregate(pipeline);
      
      logger.database('debug', `Agregación ejecutada en ${this.modelName}`, {
        stages: pipeline.length,
        results: result.length,
        model: this.modelName
      });
      
      return result;
    } catch (error) {
      logger.database('error', `Error en agregación en ${this.modelName}`, { error, pipeline });
      throw error;
    }
  }

  /**
   * Crear respuesta API estandarizada
   */
  createApiResponse<D = T>(
    success: boolean,
    message: string,
    data?: D,
    error?: string,
    pagination?: PaginationInfo
  ): ApiResponse<D> {
    return {
      success,
      message,
      data,
      error,
      meta: {
        pagination,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };
  }
} 