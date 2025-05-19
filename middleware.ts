import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Este middleware se ejecuta antes de manejar las solicitudes
export function middleware(request: NextRequest) {
  // Procesar normalmente todas las rutas
  return NextResponse.next();
}

// Configurar en qué rutas se aplicará el middleware
export const config = {
  // Aplicar a todas las rutas excepto las estáticas y las API
  matcher: [
    // Excluir archivos estáticos, API, y otros archivos del sistema
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 