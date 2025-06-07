import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Función para verificar el token JWT
async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret'
    );
    
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Error verificando JWT:', error);
    return null;
  }
}

// Este middleware se ejecuta antes de manejar las solicitudes
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignorar rutas de autenticación y estáticas para evitar redirecciones en bucle
  if (pathname.startsWith('/auth') || 
      pathname === '/' || 
      pathname.startsWith('/formulario') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Verificar si la ruta es un dashboard
  const isDashboardRoute = pathname.startsWith('/dashboard-');
  
  // Si es una ruta de dashboard, verificar autenticación
  if (isDashboardRoute) {
    // Obtener el token del localStorage (esto no es posible en middleware)
    // En su lugar, buscar el token en las cookies
    const authToken = request.cookies.get('auth_token')?.value;
    
    let tokenPayload = null;
    
    if (authToken) {
      tokenPayload = await verifyJWT(authToken);
    }
    
    // Si no hay token válido, redirigir al login
    if (!tokenPayload) {
      const url = new URL('/auth/login', request.url);
      // Guardar la URL original como callbackUrl
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    
    const userRole = tokenPayload.role as string;
    const tipoUsuario = tokenPayload.tipoUsuario as string;
    
    // Lógica de redirección basada en roles
    if (pathname.startsWith('/dashboard-superadmin')) {
      if (tipoUsuario !== 'admin' && userRole !== 'admin' && userRole !== 'superadmin') {
        // Redirigir al dashboard correspondiente
        const redirectUrl = tipoUsuario === 'cliente' ? '/dashboard-cliente' : '/dashboard-empresa';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    } else if (pathname.startsWith('/dashboard-cliente')) {
      if (tipoUsuario !== 'cliente' && userRole !== 'cliente') {
        // Redirigir al dashboard correspondiente
        const redirectUrl = tipoUsuario === 'admin' ? '/dashboard-superadmin' : '/dashboard-empresa';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    } else if (pathname.startsWith('/dashboard-empresa')) {
      if (tipoUsuario !== 'empresa' && userRole !== 'empresa') {
        // Redirigir al dashboard correspondiente
        const redirectUrl = tipoUsuario === 'admin' ? '/dashboard-superadmin' : '/dashboard-cliente';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
  }
  
  // Procesar normalmente todas las demás rutas
  return NextResponse.next();
}

// Configurar en qué rutas se aplicará el middleware
export const config = {
  // Aplicar a rutas específicas, excluyendo archivos estáticos
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}; 