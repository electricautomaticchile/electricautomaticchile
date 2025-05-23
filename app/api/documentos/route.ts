import { NextRequest, NextResponse } from 'next/server';
import documentoService from '@/lib/services/documento-service';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { bucketConfig } from '@/lib/aws/s3-config';
import { logger } from '@/lib/utils/logger';

// Función para validar el tipo de archivo
function esTipoArchivoPermitido(mimetype: string): boolean {
  return bucketConfig.allowedFileTypes.includes(mimetype);
}

// Función para validar el tamaño del archivo
function esTamañoArchivoPermitido(size: number): boolean {
  return size <= bucketConfig.maxFileSize;
}

// Función para registrar errores detallados
function logError(error: any, context: string) {
  logger.error(`${context}`, {
    message: error.message,
    name: error.name,
    code: error.code,
    stack: error.stack,
    cause: error.cause,
    status: error.status || error.statusCode,
    // Para errores de AWS
    $metadata: error.$metadata,
    // Para errores de Axios
    response: error.response ? {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    } : undefined,
    request: error.request ? 'Request object present' : undefined,
    // Variables de entorno relacionadas con AWS (redactando valores sensibles)
    env: {
      REGION: process.env.REGION || 'no configurado',
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'no configurado',
      ACCESS_KEY_ID: process.env.ACCESS_KEY_ID ? 'configurado' : 'no configurado',
      SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY ? 'configurado' : 'no configurado'
    }
  });
}

// Manejador de solicitudes POST (subir documento)
export async function POST(request: NextRequest) {
  try {
    // Verificar si es un formulario de contacto
    const esFormularioContacto = request.headers.get('X-Form-Type') === 'contacto';
    
    logger.file('info', 'Iniciando proceso de subida de documento');
    
    if (esFormularioContacto) {
      logger.api('info', `Es formulario de contacto: ${esFormularioContacto}`);
    }
    
    // Si no es formulario de contacto, verificar autenticación
    if (!esFormularioContacto) {
      logger.file('info', 'Verificando autenticación del usuario');
      
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.email) {
        logger.api('warn', 'Usuario no autenticado, devolviendo error 401');
        return NextResponse.json(
          { message: 'Usuario no autenticado' },
          { status: 401 }
        );
      }
      
      logger.api('info', `Usuario autenticado: ${session.user.id || session.user.email}`);
    }
    
    // Procesar formulario
    logger.file('info', 'Extrayendo datos del formulario');
    
    const formData = await request.formData();
    const archivo = formData.get('archivo') as File;
    
    if (!archivo) {
      logger.file('warn', 'No se encontró archivo en la solicitud');
      return NextResponse.json(
        { message: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }
    
    logger.file('info', `Archivo recibido: ${archivo.name}, tipo: ${archivo.type}, tamaño: ${archivo.size} bytes`);
    
    // Validaciones de archivo
    if (!esTipoArchivoPermitido(archivo.type)) {
      logger.file('warn', `Tipo de archivo no permitido: ${archivo.type}`);
      return NextResponse.json(
        { 
          message: 'Tipo de archivo no permitido',
          tiposPermitidos: bucketConfig.allowedFileTypes
        },
        { status: 400 }
      );
    }
    
    // Validar tamaño (50MB máximo)
    const tamañoMaximo = 50 * 1024 * 1024; // 50MB en bytes
    if (archivo.size > tamañoMaximo) {
      logger.file('warn', `Tamaño de archivo excedido: ${archivo.size} bytes`);
      return NextResponse.json(
        { 
          message: 'El archivo es demasiado grande. Tamaño máximo: 50MB',
          tamañoActual: `${(archivo.size / 1024 / 1024).toFixed(2)}MB`,
          tamañoMaximo: '50MB'
        },
        { status: 400 }
      );
    }
    
    // Obtener metadatos del documento
    const tipoDocumento = formData.get('tipoDocumento') as string;
    const entidadRelacionada = formData.get('entidadRelacionada') as string;
    const referenciaId = formData.get('referenciaId') as string;
    const entidadModelo = formData.get('entidadModelo') as string;
    const nombre = formData.get('nombre') as string || archivo.name;
    const descripcion = formData.get('descripcion') as string;
    const esPublico = formData.get('esPublico') === 'true';
    const etiquetasRaw = formData.get('etiquetas') as string;
    
    // Solo loggear metadatos en desarrollo para debugging
    logger.file('debug', 'Metadatos del documento', {
      tipoDocumento,
      entidadRelacionada,
      referenciaId,
      entidadModelo,
      nombre,
      esPublico,
      etiquetas: etiquetasRaw ? 'presente' : 'no presente',
      archivoNombre: archivo.name,
      archivoTamaño: archivo.size
    });
    
    // Validar campos requeridos
    if (!tipoDocumento || !entidadRelacionada || !referenciaId || !entidadModelo) {
      logger.file('warn', 'Faltan campos requeridos en la solicitud');
      return NextResponse.json(
        { message: 'Faltan campos requeridos: tipoDocumento, entidadRelacionada, referenciaId y entidadModelo' },
        { status: 400 }
      );
    }
    
    // Procesar etiquetas
    let etiquetas: string[] = [];
    if (etiquetasRaw) {
      try {
        // Intentar parsearlo como JSON primero
        etiquetas = JSON.parse(etiquetasRaw);
        logger.file('debug', `Etiquetas procesadas como JSON: ${etiquetas?.length || 0} etiquetas`);
      } catch {
        // Si falla, tratarlo como string separado por comas
        etiquetas = etiquetasRaw.split(',').map(tag => tag.trim()).filter(Boolean);
        logger.file('debug', `Etiquetas procesadas como string separado por comas: ${etiquetas?.length || 0} etiquetas`);
      }
    }
    
    // Determinar usuario
    let usuario = 'anonimo';
    if (!esFormularioContacto) {
      const session = await getServerSession(authOptions);
      usuario = session?.user?.id || session?.user?.email || 'usuario_autenticado';
      logger.api('debug', `Usuario asignado al documento: ${usuario}`);
    }
    
    // Leer archivo como ArrayBuffer
    logger.file('debug', 'Leyendo archivo como ArrayBuffer');
    const arrayBuffer = await archivo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    logger.file('debug', `Buffer de archivo creado: ${buffer.length} bytes`);
    
    // Verificar configuración S3
    logger.file('debug', 'Verificando configuración de S3', {
      bucket: process.env.S3_BUCKET_NAME ? 'configurado' : 'no configurado',
      accessKey: process.env.ACCESS_KEY_ID ? 'configurado' : 'no configurado',
      secretKey: process.env.SECRET_ACCESS_KEY ? 'configurado' : 'no configurado',
      region: process.env.REGION ? 'configurado' : 'no configurado'
    });
    
    // Subir archivo y guardar en BD
    logger.file('info', 'Iniciando subida de documento a S3 y MongoDB');
    const documento = await documentoService.subirDocumento(
      {
        buffer,
        originalname: archivo.name,
        mimetype: archivo.type,
        size: archivo.size
      },
      {
        nombre,
        descripcion,
        tipoDocumento: tipoDocumento as any,
        entidadRelacionada: entidadRelacionada as any,
        referenciaId,
        entidadModelo,
        esPublico,
        usuario,
        etiquetas
      }
    );
    
    logger.file('info', `Documento subido exitosamente: ${documento._id}`);
    
    // Responder con documento creado
    return NextResponse.json(
      {
        message: 'Documento subido correctamente',
        documento: {
          id: documento._id,
          nombre: documento.nombre,
          url: documento.url,
          tipoDocumento: documento.tipoDocumento,
          tipoArchivo: documento.tipoArchivo,
          tamaño: documento.tamaño,
          fechaSubida: documento.fechaSubida
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Usar la función de registro de errores detallada
    logError(error, 'Subida de documento');
    
    return NextResponse.json(
      { 
        error: 'Error al procesar el documento', 
        mensaje: error.message || 'Ocurrió un error al procesar el documento',
        detalle: process.env.NODE_ENV === 'development' ? {
          nombre: error.name,
          codigo: error.code,
          stack: error.stack,
        } : undefined,
        s3Configurado: {
          bucket: !!process.env.S3_BUCKET_NAME,
          region: !!process.env.REGION,
          credenciales: !!(process.env.ACCESS_KEY_ID && process.env.SECRET_ACCESS_KEY)
        }
      },
      { status: 500 }
    );
  }
}

// Manejador de solicitudes GET (obtener documentos)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const entidad = searchParams.get('entidad');
    const referencia = searchParams.get('referencia');
    const tipo = searchParams.get('tipo');
    const usuario = searchParams.get('usuario');
    const pagina = searchParams.get('pagina');
    const limite = searchParams.get('limite');
    const busqueda = searchParams.get('busqueda');
    
    // Verificar si es una solicitud de documentos públicos o verificar autenticación
    const esConsultaPublica = searchParams.get('publico') === 'true';
    
    if (!esConsultaPublica) {
      const session = await getServerSession(authOptions);
      
      if (!session || !session.user) {
        return NextResponse.json(
          { error: 'No autorizado', mensaje: 'Debe iniciar sesión para consultar documentos' },
          { status: 401 }
        );
      }
    }
    
    // Si se solicitan documentos de una entidad específica
    if (entidad && referencia) {
      const documentos = await documentoService.buscarPorEntidad(
        entidad as any,
        referencia as string
      );
      
      return NextResponse.json({
        documentos,
        total: documentos.length
      });
    }
    
    // Búsqueda con filtros avanzados
    const resultado = await documentoService.buscarAvanzado({
      tipoDocumento: tipo as any,
      entidadRelacionada: entidad as any,
      usuario: usuario as string,
      pagina: pagina ? parseInt(pagina, 10) : undefined,
      limite: limite ? parseInt(limite, 10) : undefined,
      busqueda: busqueda as string
    });
    
    return NextResponse.json(resultado);
  } catch (error: any) {
    logger.error('Error al obtener documentos', error);
    return NextResponse.json(
      { error: 'Error al obtener documentos', mensaje: error.message || 'Ocurrió un error al obtener los documentos' },
      { status: 500 }
    );
  }
} 