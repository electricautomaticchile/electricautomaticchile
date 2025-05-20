import { MongoService } from '../db/mongo-service';
import Documento, { IDocumento, TipoDocumento, EntidadRelacionada } from '../models/documento';
import s3Service from '../aws/s3-service';
import mongoose from 'mongoose';
import { conectarDB } from '../db/mongo-helpers';

/**
 * Servicio para gestionar documentos almacenados en S3 y MongoDB
 */
export class DocumentoService extends MongoService<IDocumento> {
  private static instance: DocumentoService;

  private constructor() {
    super(Documento, {
      nombreCache: 'documentos_cache',
      defaultTTL: 15 * 60 * 1000, // 15 minutos
      maxCacheItems: 300
    });
  }

  /**
   * Obtener instancia única del servicio de documentos
   */
  public static getInstance(): DocumentoService {
    if (!DocumentoService.instance) {
      DocumentoService.instance = new DocumentoService();
    }
    return DocumentoService.instance;
  }

  /**
   * Subir un nuevo documento
   * @param archivo Buffer del archivo
   * @param metadatos Metadatos del documento
   */
  async subirDocumento(
    archivo: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
      size: number;
    },
    metadatos: {
      nombre?: string;
      descripcion?: string;
      tipoDocumento: TipoDocumento;
      entidadRelacionada: EntidadRelacionada;
      referenciaId: string;
      entidadModelo: string;
      esPublico?: boolean;
      fechaExpiracion?: Date;
      usuario: string;
      etiquetas?: string[];
      metadatosAdicionales?: Record<string, any>;
    }
  ): Promise<IDocumento> {
    await conectarDB();

    try {
      // 1. Generar clave única para S3
      const prefijo = metadatos.entidadRelacionada;
      const claveS3 = s3Service.generarClave(archivo.originalname, prefijo);

      // 2. Subir archivo a S3
      const resultadoS3 = await s3Service.subirArchivo(
        archivo.buffer,
        claveS3,
        archivo.mimetype
      );

      // 3. Crear entrada en MongoDB
      const documentoData: any = {
        nombre: metadatos.nombre || archivo.originalname,
        descripcion: metadatos.descripcion,
        tipoDocumento: metadatos.tipoDocumento,
        tipoArchivo: archivo.mimetype,
        tamaño: archivo.size,
        url: resultadoS3.url,
        claveS3: resultadoS3.clave,
        entidadRelacionada: metadatos.entidadRelacionada,
        entidadModelo: metadatos.entidadModelo,
        esPublico: metadatos.esPublico || false,
        fechaSubida: new Date(),
        fechaExpiracion: metadatos.fechaExpiracion,
        etiquetas: metadatos.etiquetas,
        metadatos: metadatos.metadatosAdicionales
      };
      
      // Manejar IDs: si es un formato válido de ObjectId, convertirlo
      // Si no, guardarlo como string para casos especiales como formularios públicos
      if (mongoose.Types.ObjectId.isValid(metadatos.referenciaId)) {
        documentoData.referenciaId = new mongoose.Types.ObjectId(metadatos.referenciaId);
      } else {
        // Para casos especiales como 'formulario-contacto'
        documentoData.referenciaId = metadatos.referenciaId;
      }
      
      // Manejar el ID de usuario de manera similar
      if (mongoose.Types.ObjectId.isValid(metadatos.usuario)) {
        documentoData.usuario = new mongoose.Types.ObjectId(metadatos.usuario);
      } else {
        // Para casos especiales como 'formulario-publico'
        documentoData.usuario = metadatos.usuario;
      }
      
      const documento = await this.crear(documentoData);

      return documento;
    } catch (error) {
      console.error('Error al subir documento:', error);
      throw error;
    }
  }

  /**
   * Obtener URL prefirmada para un documento
   * @param documentoId ID del documento
   * @param duracionSegundos Duración de la URL en segundos
   */
  async obtenerURLPrefirmada(documentoId: string, duracionSegundos: number = 3600): Promise<string> {
    const documento = await this.obtenerPorId(documentoId);
    if (!documento) {
      throw new Error(`Documento no encontrado con ID: ${documentoId}`);
    }

    // Si es un documento público, devolver la URL pública
    if (documento.esPublico) {
      return documento.url;
    }

    // Generar URL prefirmada
    return await s3Service.generarURLPrefirmada(documento.claveS3, duracionSegundos);
  }

  /**
   * Eliminar un documento (de S3 y MongoDB)
   * @param documentoId ID del documento
   */
  async eliminarDocumento(documentoId: string): Promise<boolean> {
    const documento = await this.obtenerPorId(documentoId);
    if (!documento) {
      throw new Error(`Documento no encontrado con ID: ${documentoId}`);
    }

    try {
      // 1. Eliminar de S3
      await s3Service.eliminarArchivo(documento.claveS3);

      // 2. Eliminar de MongoDB
      await this.eliminar(documentoId);

      return true;
    } catch (error) {
      console.error(`Error al eliminar documento ${documentoId}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar metadatos de un documento
   * @param documentoId ID del documento
   * @param actualizacion Campos a actualizar
   */
  async actualizarMetadatos(
    documentoId: string,
    actualizacion: {
      nombre?: string;
      descripcion?: string;
      tipoDocumento?: TipoDocumento;
      esPublico?: boolean;
      fechaExpiracion?: Date | null;
      etiquetas?: string[];
      metadatos?: Record<string, any>;
    }
  ): Promise<IDocumento | null> {
    // No permitimos actualizar campos críticos como claveS3, url, entidad relacionada, etc.
    const camposPermitidos: Record<string, any> = {};

    if (actualizacion.nombre !== undefined) camposPermitidos.nombre = actualizacion.nombre;
    if (actualizacion.descripcion !== undefined) camposPermitidos.descripcion = actualizacion.descripcion;
    if (actualizacion.tipoDocumento !== undefined) camposPermitidos.tipoDocumento = actualizacion.tipoDocumento;
    if (actualizacion.esPublico !== undefined) camposPermitidos.esPublico = actualizacion.esPublico;
    if (actualizacion.fechaExpiracion !== undefined) camposPermitidos.fechaExpiracion = actualizacion.fechaExpiracion;
    if (actualizacion.etiquetas !== undefined) camposPermitidos.etiquetas = actualizacion.etiquetas;
    if (actualizacion.metadatos !== undefined) camposPermitidos.metadatos = actualizacion.metadatos;

    return await this.actualizar(documentoId, camposPermitidos);
  }

  /**
   * Buscar documentos por entidad
   * @param entidad Tipo de entidad
   * @param id ID de la entidad
   */
  async buscarPorEntidad(
    entidad: EntidadRelacionada,
    id: string
  ): Promise<IDocumento[]> {
    return await this.obtener(
      {
        entidadRelacionada: entidad,
        referenciaId: new mongoose.Types.ObjectId(id)
      },
      {
        ordenarPor: 'fechaSubida',
        direccion: 'desc',
        populate: 'usuario'
      }
    );
  }

  /**
   * Buscar documentos con filtros avanzados
   * @param opciones Opciones de filtrado
   */
  async buscarAvanzado(
    opciones: {
      tipoDocumento?: TipoDocumento;
      entidadRelacionada?: EntidadRelacionada;
      usuario?: string;
      fechaDesde?: Date;
      fechaHasta?: Date;
      etiquetas?: string[];
      busqueda?: string;
      pagina?: number;
      limite?: number;
    }
  ): Promise<{
    datos: IDocumento[];
    paginacion: {
      total: number;
      paginas: number;
      paginaActual: number;
      limite: number;
      haySiguiente: boolean;
      hayAnterior: boolean;
    };
  }> {
    // Construir filtro
    const filtro: any = {};

    if (opciones.tipoDocumento) {
      filtro.tipoDocumento = opciones.tipoDocumento;
    }

    if (opciones.entidadRelacionada) {
      filtro.entidadRelacionada = opciones.entidadRelacionada;
    }

    if (opciones.usuario) {
      filtro.usuario = new mongoose.Types.ObjectId(opciones.usuario);
    }

    // Filtrar por rango de fechas
    if (opciones.fechaDesde || opciones.fechaHasta) {
      filtro.fechaSubida = {};
      if (opciones.fechaDesde) {
        filtro.fechaSubida.$gte = opciones.fechaDesde;
      }
      if (opciones.fechaHasta) {
        filtro.fechaSubida.$lte = opciones.fechaHasta;
      }
    }

    // Filtrar por etiquetas
    if (opciones.etiquetas && opciones.etiquetas.length > 0) {
      filtro.etiquetas = { $all: opciones.etiquetas };
    }

    // Búsqueda por texto
    if (opciones.busqueda) {
      const termino = opciones.busqueda.trim();
      const regexBusqueda = new RegExp(termino, 'i');
      
      // Buscar en nombre y descripción
      filtro.$or = [
        { nombre: regexBusqueda },
        { descripcion: regexBusqueda }
      ];
    }

    // Realizar consulta paginada
    return await this.obtenerPaginado(filtro, {
      pagina: opciones.pagina || 1,
      limite: opciones.limite || 20,
      ordenarPor: 'fechaSubida',
      direccion: 'desc',
      populate: 'usuario'
    });
  }
}

// Exportar singleton
const documentoService = DocumentoService.getInstance();
export default documentoService; 