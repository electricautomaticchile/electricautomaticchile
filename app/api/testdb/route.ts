import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    // Intentar conectar a MongoDB
    const client = await clientPromise;
    
    // Verificar que podemos obtener la lista de bases de datos
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    
    // Obtener información básica de la conexión
    const connectionInfo = {
      isConnected: !!client,
      databases: dbs.databases.map(db => db.name),
      environment: process.env.NODE_ENV,
      mongodbUri: process.env.MONGODB_URI ? 'Configurado' : 'No configurado',
      authSecret: process.env.NEXTAUTH_SECRET ? 'Configurado' : 'No configurado',
      nextAuthUrl: process.env.NEXTAUTH_URL || 'No configurado'
    };
    
    return NextResponse.json({
      status: 'success',
      message: 'Conexión a MongoDB exitosa',
      connectionInfo
    });
  } catch (error: any) {
    logger.error('Error conectando a MongoDB', error);
    return NextResponse.json({ 
      message: "Error conectando a MongoDB",
      error: error.message 
    }, { status: 500 });
  }
} 