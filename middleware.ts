import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Este middleware se ejecuta antes de manejar las solicitudes
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignorar rutas de autenticación para evitar redirecciones en bucle
  if (pathname.startsWith('/auth') || pathname === '/') {
    return NextResponse.next();
  }
  
  // Verificar si la ruta es un dashboard
  const isDashboardRoute = pathname.startsWith('/dashboard-');
  
  // Si es una ruta de dashboard, verificar autenticación
  if (isDashboardRoute) {
    // Obtener el token de autenticación
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // Si no hay token (usuario no autenticado), redirigir al login
    if (!token) {
      // Crear URL para la redirección
      const url = new URL('/auth/login', request.url);
      
      // Obtener el host de producción desde las variables de entorno o usar el host actual
      const productionHost = process.env.NEXTAUTH_URL || request.nextUrl.origin;
      
      // Crear la URL de callback correcta usando el host de producción
      const callbackUrl = new URL(pathname, productionHost).toString();
      
      // Guardar la URL original como callbackUrl para redireccionar después del login
      url.searchParams.set('callbackUrl', encodeURI(callbackUrl));
      
      return NextResponse.redirect(url);
    }
    
    const userRole = token.role as string;
    
    // Si el usuario es admin/superadmin y está intentando acceder al dashboard-empresa,
    // redirigirlo al dashboard-superadmin
    if ((userRole === "admin" || userRole === "superadmin") && pathname.startsWith('/dashboard-empresa')) {
      const url = new URL('/dashboard-superadmin', request.url);
      return NextResponse.redirect(url);
    }
    
    // Si es dashboard-superadmin, verificar que sea admin
    if (pathname.startsWith('/dashboard-superadmin')) {
      if (userRole !== 'admin' && userRole !== 'superadmin') {
        // Si no tiene el rol adecuado, redirigir al dashboard correspondiente a su rol
        const url = new URL('/dashboard-empresa', request.url);
        return NextResponse.redirect(url);
      }
    }
  }
  
  // Procesar normalmente todas las demás rutas
  return NextResponse.next();
}

// Configurar en qué rutas se aplicará el middleware
export const config = {
  // Aplicar a todas las rutas excepto las estáticas y las API
  matcher: [
    // Excluir archivos estáticos, API, y otros archivos del sistema
    '/((?!api|_next/static|_next/image|_next/data|favicon.ico).*)',
  ],
}; 