import { NextRequest, NextResponse } from 'next/server';
import documentoService from '@/lib/services/documento-service';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { bucketConfig } from '@/lib/aws/s3-config';

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
  console.error(`[ERROR] ${context}:`, {
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
    console.log('[INFO] Iniciando proceso de subida de documento');
    
    // Verificar si es una solicitud del formulario de contacto público
    const esFormularioContacto = request.headers.get('x-form-type') === 'contacto';
    console.log(`[INFO] Es formulario de contacto: ${esFormularioContacto}`);
    
    // Si no es formulario de contacto, verificar autenticación
    if (!esFormularioContacto) {
      console.log('[INFO] Verificando autenticación del usuario');
      const session = await getServerSession(authOptions);
      
      if (!session || !session.user) {
        console.log('[INFO] Usuario no autenticado, devolviendo error 401');
        return NextResponse.json(
          { error: 'No autorizado', mensaje: 'Debe iniciar sesión para subir documentos' },
          { status: 401 }
        );
      }
      console.log(`[INFO] Usuario autenticado: ${session.user.id || session.user.email}`);
    }
    
    // Parsear la solicitud como FormData
    console.log('[INFO] Extrayendo datos del formulario');
    const formData = await request.formData();
    
    // Obtener el archivo
    const archivo = formData.get('archivo');
    
    if (!archivo || !(archivo instanceof File)) {
      console.log('[INFO] No se encontró archivo en la solicitud');
      return NextResponse.json(
        { error: 'No se ha subido ningún archivo', mensaje: 'Debe proporcionar un archivo para subir' },
        { status: 400 }
      );
    }
    
    console.log(`[INFO] Archivo recibido: ${archivo.name}, tipo: ${archivo.type}, tamaño: ${archivo.size} bytes`);
    
    // Validar tipo de archivo
    if (!esTipoArchivoPermitido(archivo.type)) {
      console.log(`[INFO] Tipo de archivo no permitido: ${archivo.type}`);
      return NextResponse.json(
        { 
          error: 'Tipo de archivo no permitido', 
          mensaje: `Tipo de archivo no permitido: ${archivo.type}. Tipos permitidos: ${bucketConfig.allowedFileTypes.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Validar tamaño de archivo
    if (!esTamañoArchivoPermitido(archivo.size)) {
      console.log(`[INFO] Tamaño de archivo excedido: ${archivo.size} bytes`);
      return NextResponse.json(
        { 
          error: 'Tamaño de archivo excedido', 
          mensaje: `El archivo no debe superar ${bucketConfig.maxFileSize / (1024 * 1024)}MB` 
        },
        { status: 400 }
      );
    }
    
    // Obtener los metadatos del formulario
    const tipoDocumento = formData.get('tipoDocumento') as string;
    const entidadRelacionada = formData.get('entidadRelacionada') as string;
    const referenciaId = formData.get('referenciaId') as string;
    const entidadModelo = formData.get('entidadModelo') as string;
    const nombre = formData.get('nombre') as string || archivo.name;
    const descripcion = formData.get('descripcion') as string;
    const esPublico = formData.get('esPublico') === 'true';
    const etiquetasRaw = formData.get('etiquetas') as string;
    
    console.log('[INFO] Metadatos del documento:', {
      tipoDocumento,
      entidadRelacionada,
      referenciaId,
      entidadModelo,
      nombre,
      esPublico,
      etiquetasExisten: !!etiquetasRaw
    });
    
    // Validar campos requeridos
    if (!tipoDocumento || !entidadRelacionada || !referenciaId || !entidadModelo) {
      console.log('[INFO] Faltan campos requeridos en la solicitud');
      return NextResponse.json(
        { 
          error: 'Faltan campos requeridos', 
          mensaje: 'Los campos tipoDocumento, entidadRelacionada, referenciaId y entidadModelo son obligatorios' 
        },
        { status: 400 }
      );
    }
    
    // Procesar etiquetas si existen
    let etiquetas: string[] | undefined;
    if (etiquetasRaw) {
      try {
        etiquetas = JSON.parse(etiquetasRaw);
        console.log(`[INFO] Etiquetas procesadas como JSON: ${etiquetas?.length || 0} etiquetas`);
      } catch (e) {
        // Si no es JSON válido, intentamos separar por comas
        etiquetas = etiquetasRaw.split(',').map(e => e.trim());
        console.log(`[INFO] Etiquetas procesadas como string separado por comas: ${etiquetas?.length || 0} etiquetas`);
      }
    }
    
    // Obtener usuario de la sesión o usar valor por defecto para formulario público
    let usuario = 'formulario-publico';
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      usuario = session.user.id;
    }
    console.log(`[INFO] Usuario asignado al documento: ${usuario}`);
    
    // Leer el archivo como ArrayBuffer
    console.log('[INFO] Leyendo archivo como ArrayBuffer');
    const buffer = Buffer.from(await archivo.arrayBuffer());
    console.log(`[INFO] Buffer de archivo creado: ${buffer.length} bytes`);
    
    // Verificar configuración de S3
    console.log('[INFO] Verificando configuración de S3:', {
      bucketNameConfigured: !!bucketConfig.bucketName,
      accessKeyConfigured: !!process.env.ACCESS_KEY_ID,
      secretKeyConfigured: !!process.env.SECRET_ACCESS_KEY,
      regionConfigured: !!process.env.REGION
    });
    
    // Subir documento utilizando el servicio
    console.log('[INFO] Iniciando subida de documento a S3 y MongoDB');
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
    
    console.log(`[INFO] Documento subido exitosamente: ${documento._id}`);
    
    // Responder con documento creado
    return NextResponse.json(
      {
        mensaje: 'Documento subido correctamente',
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
    console.error('Error al obtener documentos:', error);
    return NextResponse.json(
      { error: 'Error al obtener documentos', mensaje: error.message || 'Ocurrió un error al obtener los documentos' },
      { status: 500 }
    );
  }
} 