import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, getConnectionState, checkDatabaseHealth } from '@/lib/db/mongoose';
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    // Conectar usando el sistema unificado
    await connectToDatabase();
    
    // Obtener estado de la conexión
    const connectionState = getConnectionState();
    
    // Verificar salud de la base de datos
    const healthCheck = await checkDatabaseHealth();
    
    // Obtener información de las colecciones disponibles
    const collections = Object.keys((await import('mongoose')).default.connection.collections);
    
    return NextResponse.json({
      status: 'success',
      message: 'Conexión a MongoDB exitosa usando Mongoose unificado',
      connectionInfo: {
        isConnected: connectionState.isConnected,
        connectionCount: connectionState.connectionCount,
        lastConnected: connectionState.lastConnected,
        readyState: (await import('mongoose')).default.connection.readyState,
        collections: collections,
        poolingEnabled: true
      },
      healthCheck,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        mongodbUri: process.env.MONGODB_URI ? 'Configurado' : 'No configurado',
        authSecret: process.env.NEXTAUTH_SECRET ? 'Configurado' : 'No configurado',
        nextAuthUrl: process.env.NEXTAUTH_URL || 'No configurado'
      }
    });
  } catch (error: any) {
    logger.error('Error conectando a MongoDB', error);
    return NextResponse.json({ 
      status: 'error',
      message: "Error conectando a MongoDB",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 