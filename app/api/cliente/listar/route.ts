import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { connectToDatabase } from '@/lib/db/mongodb';
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    // Conectar a la base de datos
    const db = await clientPromise;
    const clientesCollection = db.db("electricautomaticchile").collection("clientes");
    
    // Buscar todos los clientes con role="empresa"
    const clientes = await clientesCollection.find({
      role: "empresa"
    }).sort({ fechaRegistro: -1 }).toArray(); // Ordenar por fecha de registro, más reciente primero
    
    return NextResponse.json({ 
      clientes
    }, { status: 200 });
    
  } catch (error: any) {
    logger.error('Error al listar clientes de la base de datos', error);
    
    return NextResponse.json({ 
      message: "Error al listar clientes",
      error: error.message 
    }, { status: 500 });
  }
} 