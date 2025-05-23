import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hash } from 'bcrypt';
import { generateRandomClientNumber } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';

// Definir la ruta POST para crear un super administrador
export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    const db = await clientPromise;
    const clientesCollection = db.db("electricautomaticchile").collection("clientes");
    
    // Número de cliente aleatorio en formato XXXXXX-X
    const numeroCliente = generateRandomClientNumber();
    
    // Verificar si ya existe un cliente con ese número
    const clienteExistente = await clientesCollection.findOne({ 
      numeroCliente: numeroCliente 
    });
    
    if (clienteExistente) {
      return NextResponse.json({ 
        message: "Ya existe un cliente con ese número de cliente. Por favor, intente nuevamente." 
      }, { status: 400 });
    }
    
    // Contraseña predefinida
    const passwordTemporal = "stackmern";
    
    // Crear el nuevo superadmin
    const nuevoSuperAdmin = {
      numeroCliente: numeroCliente,
      nombre: "Super Administrador",
      correo: "superadmin@electricautomaticchile.com",
      telefono: "+56912345678",
      empresa: "Electric Automatic Chile",
      passwordTemporal: passwordTemporal, // Contraseña sin hash para login inmediato
      role: "admin", // Usamos 'admin' para acceder al dashboard-superadmin
      esActivo: true,
      fechaRegistro: new Date(),
      fechaActivacion: new Date(),
      ultimoAcceso: new Date(),
      rut: "11.111.111-1",
      direccion: "Dirección Corporativa",
      planSeleccionado: "premium",
      montoMensual: 0,
      notas: "Usuario super administrador del sistema"
    };
    
    // Insertar el superadmin en la base de datos
    const resultado = await clientesCollection.insertOne(nuevoSuperAdmin);
    
    if (!resultado.acknowledged) {
      throw new Error("Error al insertar el superadmin en la base de datos");
    }
    
    // También añadir a la colección de users para asegurar compatibilidad con NextAuth
    const usersCollection = db.db("electricautomaticchile").collection("users");
    
    // Verificar si ya existe un usuario con ese correo
    const usuarioExistente = await usersCollection.findOne({ 
      email: nuevoSuperAdmin.correo 
    });
    
    // Si no existe, crearlo en la colección de users
    if (!usuarioExistente) {
      await usersCollection.insertOne({
        name: nuevoSuperAdmin.nombre,
        email: nuevoSuperAdmin.correo,
        role: "admin",
        clientNumber: nuevoSuperAdmin.numeroCliente,
        image: null,
        emailVerified: new Date()
      });
    }
    
    return NextResponse.json({ 
      message: "Superadmin creado exitosamente",
      clienteId: resultado.insertedId.toString(),
      numeroCliente: numeroCliente,
      password: passwordTemporal,
      acceso: "Dashboard Superadmin"
    }, { status: 201 });
    
  } catch (error: any) {
    logger.error('Error al crear superadmin en la base de datos', error);
    
    return NextResponse.json({ 
      message: "Error al crear superadmin",
      error: error.message 
    }, { status: 500 });
  }
} 