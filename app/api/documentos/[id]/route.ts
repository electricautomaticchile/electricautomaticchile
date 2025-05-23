import { NextRequest, NextResponse } from 'next/server';
import documentoService from '@/lib/services/documento-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { logger } from '@/lib/utils/logger';

// Manejador de solicitudes GET (obtener un documento por ID)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentoId = params.id;
    
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const generar = searchParams.get('generar') === 'true';
    const duracion = searchParams.get('duracion');
    
    // Verificar autenticación excepto para documentos públicos
    const session = await getServerSession(authOptions);
    
    // Obtener el documento primero para verificar si es público
    const documento = await documentoService.obtenerPorId(documentoId);
    
    if (!documento) {
      return NextResponse.json(
        { error: 'Documento no encontrado', mensaje: 'El documento solicitado no existe' },
        { status: 404 }
      );
    }
    
    // Si no es público y no hay sesión, denegar acceso
    if (!documento.esPublico && (!session || !session.user)) {
      return NextResponse.json(
        { error: 'No autorizado', mensaje: 'Debe iniciar sesión para acceder a este documento' },
        { status: 401 }
      );
    }
    
    // Si se solicita generar URL prefirmada
    if (generar) {
      const duracionSegundos = duracion ? parseInt(duracion, 10) : 3600; // 1 hora por defecto
      const url = await documentoService.obtenerURLPrefirmada(documentoId, duracionSegundos);
      
      return NextResponse.json({
        url,
        expira: new Date(Date.now() + duracionSegundos * 1000).toISOString()
      });
    }
    
    // Devolver el documento
    return NextResponse.json({ documento });
  } catch (error: any) {
    logger.error(`Error al obtener documento: ${error.message}`, error);
    return NextResponse.json(
      { error: 'Error al obtener documento', mensaje: error.message },
      { status: 500 }
    );
  }
}

// Manejador de solicitudes PUT (actualizar metadatos)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentoId = params.id;
    
    // Verificar autenticación 
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado', mensaje: 'Debe iniciar sesión para actualizar documentos' },
        { status: 401 }
      );
    }
    
    // Obtener datos de actualización
    const datos = await request.json();
    
    // Campos permitidos para actualización
    const actualizacion = {
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      tipoDocumento: datos.tipoDocumento,
      esPublico: datos.esPublico,
      fechaExpiracion: datos.fechaExpiracion,
      etiquetas: datos.etiquetas,
      metadatos: datos.metadatos
    };
    
    // Actualizar documento
    const documentoActualizado = await documentoService.actualizarMetadatos(documentoId, actualizacion);
    
    if (!documentoActualizado) {
      return NextResponse.json(
        { error: 'Documento no encontrado', mensaje: 'El documento que intenta actualizar no existe' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      mensaje: 'Documento actualizado correctamente',
      documento: documentoActualizado
    });
  } catch (error: any) {
    logger.error(`Error al actualizar documento: ${error.message}`, error);
    return NextResponse.json(
      { error: 'Error al actualizar documento', mensaje: error.message },
      { status: 500 }
    );
  }
}

// Manejador de solicitudes DELETE (eliminar documento)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentoId = params.id;
    
    // Verificar autenticación 
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado', mensaje: 'Debe iniciar sesión para eliminar documentos' },
        { status: 401 }
      );
    }
    
    // Eliminar documento
    await documentoService.eliminarDocumento(documentoId);
    
    return NextResponse.json({
      mensaje: 'Documento eliminado correctamente',
      id: documentoId
    });
  } catch (error: any) {
    // Si el error es que no se encontró el documento
    if (error.message.includes('no encontrado')) {
      return NextResponse.json(
        { error: 'Documento no encontrado', mensaje: error.message },
        { status: 404 }
      );
    }
    
    logger.error(`Error al eliminar documento: ${error.message}`, error);
    return NextResponse.json(
      { error: 'Error al eliminar documento', mensaje: error.message },
      { status: 500 }
    );
  }
} 