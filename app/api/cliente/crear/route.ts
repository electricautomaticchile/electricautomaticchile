import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hash } from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.text();
    
    if (!rawData || rawData.trim() === '') {
      return NextResponse.json({ 
        message: "No se recibieron datos en la solicitud" 
      }, { status: 400 });
    }
    
    let data;
    try {
      data = JSON.parse(rawData);
    } catch (parseError) {
      return NextResponse.json({ 
        message: "Error al procesar los datos enviados. Formato incorrecto." 
      }, { status: 400 });
    }
    
    // Verificar que los datos requeridos estén presentes
    if (!data.numeroCliente || !data.nombre || !data.correo || !data.passwordTemporal) {
      return NextResponse.json({
        message: "Faltan datos requeridos: numeroCliente, nombre, correo y passwordTemporal son obligatorios."
      }, { status: 400 });
    }
    
    // Conectar a la base de datos
    const db = await clientPromise;
    const clientesCollection = db.db("electricautomaticchile").collection("clientes");
    
    // Verificar si ya existe un cliente con ese número
    const clienteExistente = await clientesCollection.findOne({ 
      numeroCliente: data.numeroCliente 
    });
    
    if (clienteExistente) {
      return NextResponse.json({ 
        message: "Ya existe un cliente con ese número de cliente" 
      }, { status: 400 });
    }
    
    // Crear el nuevo cliente con la contraseña temporal
    const nuevoCliente = {
      numeroCliente: data.numeroCliente,
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono || "",
      empresa: data.empresa || "",
      passwordTemporal: data.passwordTemporal,
      role: "empresa",
      esActivo: true,
      fechaRegistro: new Date(),
      rut: data.rut || "",
      direccion: data.direccion || "",
      planSeleccionado: data.planSeleccionado || "",
      montoMensual: data.montoMensual || 0,
      notas: data.notas || ""
    };
    
    // Insertar el cliente en la base de datos
    const resultado = await clientesCollection.insertOne(nuevoCliente);
    
    if (!resultado.acknowledged) {
      throw new Error("Error al insertar el cliente en la base de datos");
    }
    
    return NextResponse.json({ 
      message: "Cliente creado exitosamente",
      clienteId: resultado.insertedId.toString()
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error al crear cliente en la base de datos:', error);
    
    return NextResponse.json({ 
      message: "Error al crear el cliente",
      error: error.message 
    }, { status: 500 });
  }
} 