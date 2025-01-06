// app/api/envioformulario/route.ts
import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Replace with your MongoDB connection string
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('La URI de MongoDB no está definida');
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validar los datos
    if (!data.nombre || !data.email || !data.mensaje) {
      return NextResponse.json({ message: "Nombre, email y mensaje son requeridos." }, { status: 400 });
    }

    // Conectar a MongoDB
    await client.connect();
    const db = client.db("historial"); // Reemplaza con tu nombre de base de datos
    const collection = db.collection("formularios"); // Reemplaza con tu nombre de colección

    // Insertar los datos en la colección
    const result = await collection.insertOne({
      ...data,
      fecha: new Date(), // Agregar una marca de tiempo
    });

    // Respuesta exitosa
    return NextResponse.json({ message: "Formulario enviado exitosamente!", insertedId: result.insertedId }, { status: 201 });
  } catch (error: any) {
    console.error("Error al enviar el formulario:", error);
    return NextResponse.json({ message: "Error al enviar el formulario: " + error.message }, { status: 500 }); // Detalle del error
  } finally {
    // Asegura que el cliente se cierre al finalizar/error
    await client.close();
  }
}