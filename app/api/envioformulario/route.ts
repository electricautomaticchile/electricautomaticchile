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

    // Validate the data (important to prevent bad data)
    if (!data.nombre || !data.email || !data.mensaje) {
      return NextResponse.json({ message: "Nombre, email y mensaje son requeridos." }, { status: 400 });
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db("historial"); // Replace with your database name
    const collection = db.collection("formularios"); // Replace with your collection name

    // Insert the data into the collection
    const result = await collection.insertOne({
      ...data,
      fecha: new Date(), // Add a timestamp
    });

    // Send a successful response
    return NextResponse.json({ message: "Formulario enviado exitosamente!", insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    return NextResponse.json({ message: "Error al enviar el formulario." }, { status: 500 });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}