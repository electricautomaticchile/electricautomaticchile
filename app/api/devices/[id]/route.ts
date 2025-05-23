import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DeviceSchema } from "@/lib/validation";
import { logger } from '@/lib/utils/logger';

/**
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     description: Obtiene un dispositivo por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dispositivo obtenido con éxito
 *       404:
 *         description: Dispositivo no encontrado
 *       500:
 *         description: Error del servidor
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID de dispositivo inválido" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("electricautomatiochile");
    
    const device = await db
      .collection("devices")
      .findOne({ _id: new ObjectId(id) });
    
    if (!device) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(device);
  } catch (error: any) {
    logger.error("Error al obtener dispositivo", error);
    
    return NextResponse.json({ 
      message: "Error al obtener dispositivo",
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/devices/{id}:
 *   put:
 *     description: Actualiza un dispositivo por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       200:
 *         description: Dispositivo actualizado con éxito
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Dispositivo no encontrado
 *       500:
 *         description: Error del servidor
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID de dispositivo inválido" },
        { status: 400 }
      );
    }
    
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
    
    // Comprobar si el dispositivo existe
    const existingDevice = await db
      .collection("devices")
      .findOne({ _id: new ObjectId(id) });
    
    if (!existingDevice) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }
    
    // Actualizar dispositivo
    await db.collection("devices").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...validation.data,
          updatedAt: new Date()
        }
      }
    );
    
    // Obtener el dispositivo actualizado
    const updatedDevice = await db
      .collection("devices")
      .findOne({ _id: new ObjectId(id) });
    
    return NextResponse.json(updatedDevice);
  } catch (error: any) {
    logger.error("Error al actualizar dispositivo", error);
    
    return NextResponse.json({ 
      message: "Error al actualizar dispositivo",
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/devices/{id}:
 *   delete:
 *     description: Elimina un dispositivo por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dispositivo eliminado con éxito
 *       404:
 *         description: Dispositivo no encontrado
 *       500:
 *         description: Error del servidor
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID de dispositivo inválido" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("electricautomatiochile");
    
    // Comprobar si el dispositivo existe
    const existingDevice = await db
      .collection("devices")
      .findOne({ _id: new ObjectId(id) });
    
    if (!existingDevice) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }
    
    // Eliminar dispositivo
    await db.collection("devices").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({
      message: "Dispositivo eliminado correctamente",
      id
    });
  } catch (error: any) {
    logger.error("Error al eliminar dispositivo", error);
    
    return NextResponse.json({ 
      message: "Error al eliminar dispositivo",
      error: error.message 
    }, { status: 500 });
  }
} 