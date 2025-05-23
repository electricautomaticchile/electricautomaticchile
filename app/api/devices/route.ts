import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { DeviceSchema } from "@/lib/validation";
import { BaseDevice } from "@/lib/types/device-types";
import { logger } from '@/lib/utils/logger';

/**
 * @swagger
 * /api/devices:
 *   get:
 *     description: Obtiene todos los dispositivos
 *     responses:
 *       200:
 *         description: Lista de dispositivos obtenida con éxito
 *       500:
 *         description: Error del servidor
 */
export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("electricautomatiochile");
    
    // Obtener parámetros de consulta para filtrado
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const location = searchParams.get("location");
    
    // Construir filtro basado en parámetros
    const filter: Record<string, any> = {};
    if (type) filter.type = type;
    if (status) filter.status = status === "true";
    if (location) filter.location = location;
    
    // Obtener dispositivos con paginación
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    const devices = await db
      .collection("devices")
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await db.collection("devices").countDocuments(filter);
    
    return NextResponse.json({
      devices,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    logger.error("Error al obtener dispositivos", error);
    
    return NextResponse.json({ 
      message: "Error al obtener dispositivos",
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/devices:
 *   post:
 *     description: Crea un nuevo dispositivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       201:
 *         description: Dispositivo creado con éxito
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validar datos con Zod
    const validation = DeviceSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("electricautomatiochile");
    
    // Crear dispositivo
    const result = await db.collection("devices").insertOne({
      ...validation.data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Obtener el dispositivo creado
    const newDevice = await db
      .collection("devices")
      .findOne({ _id: result.insertedId });
    
    return NextResponse.json(newDevice, { status: 201 });
  } catch (error: any) {
    logger.error("Error al crear dispositivo", error);
    
    return NextResponse.json({ 
      message: "Error al crear dispositivo",
      error: error.message 
    }, { status: 500 });
  }
} 