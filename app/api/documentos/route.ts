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

// Manejador de solicitudes POST (subir documento)
export async function POST(request: NextRequest) {
  try {
    // Verificar si es una solicitud del formulario de contacto público
    const esFormularioContacto = request.headers.get('x-form-type') === 'contacto';
    
    // Si no es formulario de contacto, verificar autenticación
    if (!esFormularioContacto) {
      const session = await getServerSession(authOptions);
      
      if (!session || !session.user) {
        return NextResponse.json(
          { error: 'No autorizado', mensaje: 'Debe iniciar sesión para subir documentos' },
          { status: 401 }
        );
      }
    }
    
    // Parsear la solicitud como FormData
    const formData = await request.formData();
    
    // Obtener el archivo
    const archivo = formData.get('archivo');
    
    if (!archivo || !(archivo instanceof File)) {
      return NextResponse.json(
        { error: 'No se ha subido ningún archivo', mensaje: 'Debe proporcionar un archivo para subir' },
        { status: 400 }
      );
    }
    
    // Validar tipo de archivo
    if (!esTipoArchivoPermitido(archivo.type)) {
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
    
    // Validar campos requeridos
    if (!tipoDocumento || !entidadRelacionada || !referenciaId || !entidadModelo) {
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
      } catch (e) {
        // Si no es JSON válido, intentamos separar por comas
        etiquetas = etiquetasRaw.split(',').map(e => e.trim());
      }
    }
    
    // Obtener usuario de la sesión o usar valor por defecto para formulario público
    let usuario = 'formulario-publico';
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      usuario = session.user.id;
    }
    
    // Leer el archivo como ArrayBuffer
    const buffer = Buffer.from(await archivo.arrayBuffer());
    
    // Subir documento utilizando el servicio
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
    console.error('Error al subir documento:', error);
    
    // Capturar detalles más específicos sobre el error
    let mensajeError = error.message || 'Ocurrió un error al procesar el documento';
    let errorDetallado = null;
    
    if (error.name === 'AxiosError') {
      // Error de comunicación con S3 u otro servicio externo
      mensajeError = `Error de comunicación: ${error.code} - ${error.message}`;
      errorDetallado = {
        code: error.code,
        request: error.request?.method || 'unknown',
        response: error.response?.status || 'unknown',
      };
    } else if (error.name === 'MongooseError' || error.name === 'ValidationError') {
      // Error de base de datos
      mensajeError = `Error de base de datos: ${error.message}`;
      errorDetallado = {
        name: error.name,
        code: error.code,
        keyPattern: error.keyPattern,
      };
    } else if (error.stack) {
      // Incluir información del stack para depuración
      errorDetallado = {
        stack: error.stack.split('\n').slice(0, 3),
      };
    }
    
    console.error('Detalles adicionales:', errorDetallado);
    
    return NextResponse.json(
      { 
        error: 'Error al procesar el documento', 
        mensaje: mensajeError,
        detalles: process.env.NODE_ENV === 'development' ? errorDetallado : undefined
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