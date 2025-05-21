import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../[...nextauth]/options';

export async function GET(request: NextRequest) {
  try {
    // Verificar variables de entorno esenciales
    const envStatus = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'no configurado',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'configurado' : 'no configurado',
      AUTH_SECRET: process.env.AUTH_SECRET ? 'configurado' : 'no configurado',
      MONGODB_URI: process.env.MONGODB_URI ? 'configurado' : 'no configurado',
      JWT_SECRET: process.env.JWT_SECRET ? 'configurado' : 'no configurado',
      NODE_ENV: process.env.NODE_ENV || 'no configurado',
      AUTH_GOOGLE_ID: process.env.GOOGLE_ID ? 'configurado' : 'no configurado',
      AUTH_GOOGLE_SECRET: process.env.GOOGLE_SECRET ? 'configurado' : 'no configurado',
    };
    
    // Verificar configuración de NextAuth
    const authConfig = {
      providers: authOptions.providers.map(provider => provider.id),
      session: authOptions.session,
      pages: authOptions.pages,
      hasSecret: !!authOptions.secret,
      hasAdapter: !!authOptions.adapter,
      callbacks: Object.keys(authOptions.callbacks || {})
    };
    
    // Verificar origen de la solicitud
    const requestInfo = {
      url: request.url,
      headers: {
        host: request.headers.get('host'),
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
        userAgent: request.headers.get('user-agent')
      }
    };
    
    // Devolver información de diagnóstico
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envStatus,
      authConfig,
      requestInfo
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 