import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/lib/utils/logger';

// Función para asegurarse de que la carpeta existe
async function ensureDirectoryExists(dir: string) {
  try {
    const fs = require('fs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (error: any) {
    logger.error('Error al crear directorio', error);
  }
}

// Ruta para subir imágenes al servidor
export async function POST(request: NextRequest) {
  try {
    // Verificar la sesión del usuario
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Procesar la solicitud multipart/form-data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó un archivo' }, { status: 400 });
    }
    
    // Verificar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 });
    }
    
    // Verificar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no debe superar los 5MB' }, { status: 400 });
    }
    
    // Crear un nombre único para el archivo
    const buffer = await file.arrayBuffer();
    const fileName = `${uuidv4()}_${file.name.replace(/\s+/g, '_')}`;
    
    // Asegurarse de que la carpeta existe
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'profiles');
    await ensureDirectoryExists(uploadDir);
    
    // Guardar el archivo
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, new Uint8Array(buffer));
    
    // URL pública de la imagen
    const imageUrl = `/uploads/profiles/${fileName}`;
    
    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Imagen subida correctamente'
    });
    
  } catch (error: any) {
    logger.error('Error al subir imagen', error);
    
    return NextResponse.json({ 
      message: "Error al subir imagen",
      error: error.message 
    }, { status: 500 });
  }
} 