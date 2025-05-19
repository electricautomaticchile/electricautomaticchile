import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import mongoose from 'mongoose';
import { ContactoFormulario } from '@/lib/models/contacto-formulario';

// Marcar explícitamente como ruta dinámica
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/electricautomaticchile");
    
    // Obtener parámetro seguro para exportación estática
    const estado = request.nextUrl ? request.nextUrl.searchParams.get('estado') : null;
    
    // Construir filtro
    let filter: any = {};
    if (estado) {
      filter.estado = estado;
    }
    
    // Consultar cotizaciones
    const cotizaciones = await ContactoFormulario.find(filter)
      .sort({ fecha: -1 }) // Ordenar por fecha descendente (más recientes primero)
      .lean();
      
    return NextResponse.json({ cotizaciones }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error al obtener cotizaciones:', error);
    
    return NextResponse.json({ 
      message: "Error al obtener cotizaciones",
      error: error.message 
    }, { status: 500 });
  } finally {
    // Cerrar conexión
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

// Actualizar el estado de una cotización
export async function PUT(request: NextRequest) {
  try {
    const rawData = await request.text();
    const data = JSON.parse(rawData);
    
    if (!data.id || !data.estado) {
      return NextResponse.json({ 
        message: "Se requiere ID y estado para actualizar la cotización" 
      }, { status: 400 });
    }
    
    // Validar estado
    const estadosValidos = ['pendiente', 'revisado', 'cotizado', 'aprobado', 'rechazado'];
    if (!estadosValidos.includes(data.estado)) {
      return NextResponse.json({ 
        message: "Estado no válido" 
      }, { status: 400 });
    }
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/electricautomaticchile");
    
    // Actualizar cotización
    const resultado = await ContactoFormulario.findByIdAndUpdate(
      data.id,
      { 
        estado: data.estado,
        ...(data.monto && { monto: data.monto }),
        ...(data.comentarios && { comentarios: data.comentarios })
      },
      { new: true }
    );
    
    if (!resultado) {
      return NextResponse.json({ 
        message: "Cotización no encontrada" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Cotización actualizada correctamente",
      cotizacion: resultado
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error al actualizar cotización:', error);
    
    return NextResponse.json({ 
      message: "Error al actualizar cotización",
      error: error.message 
    }, { status: 500 });
  } finally {
    // Cerrar conexión
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
} 