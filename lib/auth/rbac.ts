import { getSession } from 'next-auth/react';
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

// Definir tipos de roles
export type Rol = 'superadmin' | 'admin' | 'cliente' | 'tecnico' | 'invitado';

// Definir acciones posibles en el sistema
export type Accion = 
  // Acciones de dispositivos
  | 'dispositivos:leer' 
  | 'dispositivos:crear' 
  | 'dispositivos:modificar' 
  | 'dispositivos:eliminar'
  | 'dispositivos:controlar'
  // Acciones de mediciones
  | 'mediciones:leer' 
  | 'mediciones:crear' 
  | 'mediciones:modificar' 
  | 'mediciones:eliminar'
  // Acciones de clientes
  | 'clientes:leer' 
  | 'clientes:crear' 
  | 'clientes:modificar' 
  | 'clientes:eliminar'
  // Acciones de usuarios
  | 'usuarios:leer' 
  | 'usuarios:crear' 
  | 'usuarios:modificar' 
  | 'usuarios:eliminar'
  // Acciones de sistema
  | 'sistema:configurar'
  | 'sistema:auditar'
  | 'reportes:generar'
  | 'alertas:gestionar';

// Definir permisos por rol
const permisosPorRol: Record<Rol, Accion[]> = {
  superadmin: [
    'dispositivos:leer', 'dispositivos:crear', 'dispositivos:modificar', 'dispositivos:eliminar', 'dispositivos:controlar',
    'mediciones:leer', 'mediciones:crear', 'mediciones:modificar', 'mediciones:eliminar',
    'clientes:leer', 'clientes:crear', 'clientes:modificar', 'clientes:eliminar',
    'usuarios:leer', 'usuarios:crear', 'usuarios:modificar', 'usuarios:eliminar',
    'sistema:configurar', 'sistema:auditar', 'reportes:generar', 'alertas:gestionar'
  ],
  admin: [
    'dispositivos:leer', 'dispositivos:crear', 'dispositivos:modificar', 'dispositivos:controlar',
    'mediciones:leer', 'mediciones:crear', 'mediciones:modificar',
    'clientes:leer', 'clientes:crear', 'clientes:modificar',
    'usuarios:leer', 'usuarios:crear', 'usuarios:modificar',
    'sistema:configurar', 'reportes:generar', 'alertas:gestionar'
  ],
  tecnico: [
    'dispositivos:leer', 'dispositivos:modificar', 'dispositivos:controlar',
    'mediciones:leer', 'mediciones:crear',
    'clientes:leer',
    'reportes:generar', 'alertas:gestionar'
  ],
  cliente: [
    'dispositivos:leer',
    'mediciones:leer',
    'reportes:generar'
  ],
  invitado: [
    'dispositivos:leer',
    'mediciones:leer'
  ]
};

// Función para verificar si un rol tiene un permiso específico
export function tienePermiso(rol: Rol, accion: Accion): boolean {
  return permisosPorRol[rol]?.includes(accion) || false;
}

// Función para verificar si un usuario tiene un permiso específico
export function usuarioTienePermiso(rol: Rol, accion: Accion, recursos?: string[]): boolean {
  // Primero verificamos el permiso básico
  const tienePermisoBasico = tienePermiso(rol, accion);
  
  // Si no tiene el permiso básico, no hay necesidad de verificar más
  if (!tienePermisoBasico) {
    return false;
  }
  
  // Si no hay recursos específicos, el permiso básico es suficiente
  if (!recursos || recursos.length === 0) {
    return true;
  }
  
  // Aquí podrías implementar lógica adicional para permisos específicos por recurso
  // Por ejemplo, un admin podría tener acceso solo a ciertos dispositivos
  
  return true;
}

// Middleware para proteger rutas basado en roles y permisos
export function protegerRuta(accion: Accion, recursosRequeridos: string[] = []) {
  return async function(req: NextRequest) {
    try {
      // Obtener la sesión del usuario
      const session = await getSession({ req: req as any });
      
      if (!session || !session.user) {
        return NextResponse.json(
          { error: 'No autorizado - Debe iniciar sesión' },
          { status: 401 }
        );
      }
      
      // Obtener el rol del usuario de la sesión
      const rol = session.user.role as Rol || 'invitado';
      
      // Verificar si el usuario tiene el permiso necesario
      if (!usuarioTienePermiso(rol, accion, recursosRequeridos)) {
        return NextResponse.json(
          { error: 'Acceso denegado - No tiene los permisos necesarios' },
          { status: 403 }
        );
      }
      
      // Si llegamos aquí, el usuario está autorizado
      return NextResponse.next();
    } catch (error) {
      console.error('Error en middleware de autorización:', error);
      return NextResponse.json(
        { error: 'Error de autenticación' },
        { status: 500 }
      );
    }
  };
}

// Función para generar y verificar tokens API seguros
export class TokenAPI {
  private static readonly ALGORITMO = 'sha256';
  private static readonly PREFIJO_TOKEN = 'eac_api_';
  private static readonly TIEMPO_EXPIRACION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

  // Generar un token API único para un usuario
  static generarToken(idUsuario: string, secreto: string = process.env.API_SECRET || 'electricautomaticchile_secret'): string {
    const timestamp = Date.now();
    const datos = `${idUsuario}:${timestamp}:${secreto}`;
    const hash = crypto.createHash(this.ALGORITMO).update(datos).digest('hex');
    
    // Crear el token con formato: prefijo_idUsuario_timestamp_hash
    return `${this.PREFIJO_TOKEN}${idUsuario}_${timestamp}_${hash}`;
  }

  // Verificar si un token es válido
  static verificarToken(token: string, secreto: string = process.env.API_SECRET || 'electricautomaticchile_secret'): { valido: boolean; idUsuario?: string; expirado?: boolean } {
    try {
      // Verificar el formato del token
      if (!token.startsWith(this.PREFIJO_TOKEN)) {
        return { valido: false };
      }

      // Extraer componentes: prefijo_idUsuario_timestamp_hash
      const partes = token.substring(this.PREFIJO_TOKEN.length).split('_');
      if (partes.length !== 3) {
        return { valido: false };
      }

      const [idUsuario, timestampStr, hashRecibido] = partes;
      const timestamp = parseInt(timestampStr, 10);

      // Verificar si el token ha expirado
      if (Date.now() - timestamp > this.TIEMPO_EXPIRACION) {
        return { valido: false, idUsuario, expirado: true };
      }

      // Recrear el hash para verificar
      const datos = `${idUsuario}:${timestamp}:${secreto}`;
      const hashCalculado = crypto.createHash(this.ALGORITMO).update(datos).digest('hex');

      // Comparar hashes
      if (hashCalculado !== hashRecibido) {
        return { valido: false, idUsuario };
      }

      return { valido: true, idUsuario };
    } catch (error) {
      console.error('Error al verificar token API:', error);
      return { valido: false };
    }
  }
}

// Función para registrar intentos de acceso (para auditoría)
export async function registrarAcceso(
  idUsuario: string,
  accion: string,
  recurso: string,
  exitoso: boolean,
  detalles?: Record<string, any>
): Promise<void> {
  try {
    // Aquí iría la lógica para guardar en la base de datos el registro de acceso
    console.log(`[ACCESO] Usuario: ${idUsuario}, Acción: ${accion}, Recurso: ${recurso}, Éxito: ${exitoso ? 'Sí' : 'No'}`);
    
    // Esta función podría conectarse a MongoDB para guardar los registros
    // Ejemplo pseudocódigo:
    // await RegistroAcceso.create({
    //   idUsuario,
    //   accion,
    //   recurso,
    //   exitoso,
    //   detalles,
    //   ip: req.ip,
    //   timestamp: new Date()
    // });
  } catch (error) {
    console.error('Error al registrar acceso:', error);
  }
} 