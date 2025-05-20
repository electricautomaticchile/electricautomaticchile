import multer from 'multer';
import { bucketConfig } from '../aws/s3-config';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

// Configuración para almacenamiento en memoria
const storage = multer.memoryStorage();

// Filtro para validar archivos
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Verificar si el tipo de archivo está permitido
  if (bucketConfig.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Tipos permitidos: ${bucketConfig.allowedFileTypes.join(', ')}`));
  }
};

// Configuración de multer
export const upload = multer({
  storage,
  limits: {
    fileSize: bucketConfig.maxFileSize, // Tamaño máximo del archivo
  },
  fileFilter,
});

/**
 * Middleware para manejar errores de carga de archivos
 */
export const uploadErrorHandler = (err: any, req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  if (err instanceof multer.MulterError) {
    // Error de Multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Tamaño de archivo excedido',
        mensaje: `El archivo no debe superar ${bucketConfig.maxFileSize / (1024 * 1024)}MB`,
      });
    }
    return res.status(400).json({
      error: 'Error en la carga de archivos',
      mensaje: err.message,
    });
  } else if (err) {
    // Error general
    return res.status(400).json({
      error: 'Error al procesar el archivo',
      mensaje: err.message,
    });
  }
  next();
};

const uploadMiddleware = { upload, uploadErrorHandler };
export default uploadMiddleware; 