import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario';
import { conectarDB } from '../db/mongo-helpers';

// Extender NextApiRequest para incluir el objeto usuario
declare module 'next' {
  interface NextApiRequest {
    usuario?: {
      id: string;
      email: string;
      rol: string;
      nombre: string;
    };
  }
}

/**
 * Middleware para verificar autenticación
 */
const authMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    // Obtener token de headers o cookies
    const token = 
      req.headers.authorization?.replace('Bearer ', '') ||
      req.cookies?.token;

    // Si no hay token, retornar error
    if (!token) {
      return res.status(401).json({
        error: 'No autorizado',
        mensaje: 'Debe iniciar sesión para acceder a este recurso'
      });
    }

    // Verificar token
    const secretKey = process.env.JWT_SECRET || 'electricAutomaticSecretKey';
    const decoded = jwt.verify(token, secretKey) as {
      id: string;
      email: string;
      rol: string;
    };

    // Si el token no es válido, retornar error
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        error: 'Token inválido',
        mensaje: 'Su sesión ha expirado o no es válida'
      });
    }

    // Conectar a la base de datos
    await conectarDB();

    // Verificar que el usuario existe y está activo
    const usuario = await Usuario.findOne({
      _id: decoded.id,
      esActivo: true,
      bloqueado: { $ne: true }
    }).select('_id email rol nombre');

    if (!usuario) {
      return res.status(401).json({
        error: 'Usuario no encontrado',
        mensaje: 'El usuario no existe o está desactivado'
      });
    }

    // Agregar el usuario al request para uso posterior
    req.usuario = {
      id: usuario._id.toString(),
      email: usuario.email,
      rol: usuario.rol,
      nombre: usuario.nombre
    };

    // Continuar con el siguiente handler
    next();
  } catch (error: any) {
    // Si es error de JWT, retornar error específico
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Sesión expirada',
        mensaje: 'Su sesión ha expirado. Por favor inicie sesión nuevamente'
      });
    }

    // Error general
    console.error('Error en autenticación:', error);
    return res.status(500).json({
      error: 'Error de autenticación',
      mensaje: 'Ocurrió un error al verificar su identidad'
    });
  }
};

export default authMiddleware; 