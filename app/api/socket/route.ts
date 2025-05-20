import { NextResponse } from 'next/server';

// Definir la ruta como dinámica para evitar pre-renderizado estático
export const dynamic = 'force-dynamic';

// Esta ruta solo sirve como punto de conexión para WebSockets
// La lógica real está manejada por el servidor Socket.IO en server.js
export async function GET() {
  return NextResponse.json(
    { message: "Esta ruta maneja la conexión de WebSockets" },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    { message: "Esta ruta maneja la conexión de WebSockets" },
    { status: 200 }
  );
} 