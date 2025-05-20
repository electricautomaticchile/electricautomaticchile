import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import clientPromise from '@/lib/mongodb';

// Ruta para actualizar la imagen de perfil del usuario
export async function POST(request: NextRequest) {
  try {
    // Verificar la sesión del usuario
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Obtener los datos de la solicitud
    const data = await request.json();
    
    if (!data.imageUrl) {
      return NextResponse.json({ error: 'No se proporcionó una imagen' }, { status: 400 });
    }
    
    // Conectar a la base de datos
    const db = await clientPromise;
    const clientesCollection = db.db("electricautomaticchile").collection("clientes");
    
    // Actualizar la imagen del usuario
    const resultado = await clientesCollection.updateOne(
      { numeroCliente: session.user.clientNumber },
      { $set: { imagen: data.imageUrl } }
    );
    
    if (resultado.matchedCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Imagen de perfil actualizada correctamente'
    });
    
  } catch (error) {
    console.error('Error al actualizar la imagen de perfil:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

// Ruta para eliminar la imagen de perfil
export async function DELETE(request: NextRequest) {
  try {
    // Verificar la sesión del usuario
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Conectar a la base de datos
    const db = await clientPromise;
    const clientesCollection = db.db("electricautomaticchile").collection("clientes");
    
    // Eliminar la imagen del usuario
    const resultado = await clientesCollection.updateOne(
      { numeroCliente: session.user.clientNumber },
      { $unset: { imagen: "" } }
    );
    
    if (resultado.matchedCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Imagen de perfil eliminada correctamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar la imagen de perfil:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 