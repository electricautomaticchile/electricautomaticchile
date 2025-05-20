import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, bucketConfig } from './s3-config';
import { createHash } from 'crypto';
import { parse } from 'path';

/**
 * Servicio para manejar documentos en AWS S3
 */
export class S3Service {
  private static instance: S3Service;
  private readonly bucketName: string;

  /**
   * Constructor privado (Singleton)
   */
  private constructor() {
    this.bucketName = bucketConfig.bucketName;
  }

  /**
   * Obtener instancia única del servicio S3
   */
  public static getInstance(): S3Service {
    if (!S3Service.instance) {
      S3Service.instance = new S3Service();
    }
    return S3Service.instance;
  }

  /**
   * Generar clave única para el objeto en S3
   * @param originalName Nombre original del archivo
   * @param prefijo Prefijo para la clave (ej: 'clientes', 'dispositivos', etc.)
   * @returns Clave única para S3
   */
  public generarClave(originalName: string, prefijo: string = 'documentos'): string {
    const timestamp = Date.now();
    const hash = createHash('md5').update(`${originalName}${timestamp}`).digest('hex').substring(0, 8);
    const { name, ext } = parse(originalName);
    const nombreSanitizado = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${prefijo}/${timestamp}-${hash}-${nombreSanitizado}${ext}`;
  }

  /**
   * Sube un archivo al bucket de S3
   * @param buffer Buffer del archivo
   * @param clave Clave (ruta) en S3
   * @param tipoContenido Tipo MIME del contenido
   * @returns Datos del archivo subido
   */
  public async subirArchivo(
    buffer: Buffer,
    clave: string,
    tipoContenido: string
  ): Promise<{
    url: string;
    clave: string;
    tamaño: number;
    tipo: string;
  }> {
    try {
      // Validar tipo de archivo
      if (!bucketConfig.allowedFileTypes.includes(tipoContenido)) {
        throw new Error(`Tipo de archivo no permitido: ${tipoContenido}`);
      }

      // Validar tamaño
      if (buffer.length > bucketConfig.maxFileSize) {
        throw new Error(`El archivo excede el tamaño máximo permitido de ${bucketConfig.maxFileSize / (1024 * 1024)}MB`);
      }

      // Preparar comando para subir
      const comando = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: clave,
        Body: buffer,
        ContentType: tipoContenido,
      });

      // Subir archivo
      await s3Client.send(comando);

      // Generar URL pública
      const url = `https://${this.bucketName}.s3.amazonaws.com/${clave}`;

      return {
        url,
        clave,
        tamaño: buffer.length,
        tipo: tipoContenido,
      };
    } catch (error) {
      console.error(`Error al subir archivo a S3:`, error);
      throw error;
    }
  }

  /**
   * Genera una URL prefirmada para acceso temporal a un archivo
   * @param clave Clave del objeto en S3
   * @param expiracionSegundos Tiempo de expiración en segundos
   * @returns URL prefirmada
   */
  public async generarURLPrefirmada(
    clave: string,
    expiracionSegundos: number = 3600
  ): Promise<string> {
    try {
      const comando = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: clave,
      });

      // Generar URL firmada con tiempo de expiración
      return await getSignedUrl(s3Client, comando, {
        expiresIn: expiracionSegundos,
      });
    } catch (error) {
      console.error(`Error al generar URL prefirmada:`, error);
      throw error;
    }
  }

  /**
   * Elimina un archivo del bucket de S3
   * @param clave Clave del objeto en S3
   * @returns true si se eliminó correctamente
   */
  public async eliminarArchivo(clave: string): Promise<boolean> {
    try {
      const comando = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: clave,
      });

      await s3Client.send(comando);
      return true;
    } catch (error) {
      console.error(`Error al eliminar archivo de S3:`, error);
      throw error;
    }
  }

  /**
   * Verifica si un archivo existe en S3
   * @param clave Clave del objeto en S3
   * @returns true si el archivo existe
   */
  public async existeArchivo(clave: string): Promise<boolean> {
    try {
      const comando = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: clave,
      });

      await s3Client.send(comando);
      return true;
    } catch (error) {
      // Si el error es porque no existe, devolvemos false
      return false;
    }
  }

  /**
   * Lista archivos en una carpeta específica
   * @param prefijo Prefijo (carpeta) para listar
   * @param limite Límite de resultados
   * @returns Lista de objetos
   */
  public async listarArchivos(
    prefijo: string,
    limite: number = 100
  ): Promise<{
    clave: string;
    ultimaModificacion: Date;
    tamaño: number;
    url: string;
  }[]> {
    try {
      const comando = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefijo,
        MaxKeys: limite,
      });

      const respuesta = await s3Client.send(comando);

      if (!respuesta.Contents || respuesta.Contents.length === 0) {
        return [];
      }

      return respuesta.Contents.map((item) => ({
        clave: item.Key || '',
        ultimaModificacion: item.LastModified || new Date(),
        tamaño: item.Size || 0,
        url: `https://${this.bucketName}.s3.amazonaws.com/${item.Key}`,
      }));
    } catch (error) {
      console.error(`Error al listar archivos de S3:`, error);
      throw error;
    }
  }
}

// Exportar singleton
const s3Service = S3Service.getInstance();
export default s3Service; 