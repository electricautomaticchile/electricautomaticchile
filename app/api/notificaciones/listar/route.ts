import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Marcar explícitamente como ruta dinámica para evitar renderizado estático
export const dynamic = 'force-dynamic';

// Función para manejar todas las notificaciones
export async function GET(request: NextRequest) {
  try {
    // Conectar a la base de datos
    const db = await clientPromise;
    const notificacionesCollection = db.db("electricautomaticchile").collection("notificaciones");
    
    // Obtener filtro desde la URL, pero de forma segura para exportación estática
    // En lugar de crear una URL del request, obtenemos el parámetro directamente
    const filtro = request.nextUrl ? request.nextUrl.searchParams.get("filtro") || "todas" : "todas";
    
    // Construir el query
    let query: any = {};
    
    if (filtro === "noLeidas") {
      query.leida = false;
    } else if (filtro !== "todas") {
      query.tipo = filtro;
    }
    
    // Buscar notificaciones y ordenarlas por fecha (más recientes primero)
    const notificaciones = await notificacionesCollection.find(query)
      .sort({ fecha: -1, id: -1 })
      .toArray();
    
    // Obtener estadísticas
    const totalNotificaciones = await notificacionesCollection.countDocuments();
    const noLeidas = await notificacionesCollection.countDocuments({ leida: false });
    const alertas = await notificacionesCollection.countDocuments({ tipo: 'alerta' });
    const alertasNoLeidas = await notificacionesCollection.countDocuments({ 
      tipo: 'alerta',
      leida: false
    });
    const info = await notificacionesCollection.countDocuments({ tipo: 'info' });
    const infoNoLeidas = await notificacionesCollection.countDocuments({ 
      tipo: 'info',
      leida: false 
    });
    const exito = await notificacionesCollection.countDocuments({ tipo: 'exito' });
    const exitoNoLeidas = await notificacionesCollection.countDocuments({ 
      tipo: 'exito',
      leida: false 
    });
    
    // Si no hay datos reales, generamos datos de ejemplo
    if (totalNotificaciones === 0) {
      // En un entorno real, no generaríamos datos ficticios
      return NextResponse.json({
        notificaciones: [],
        resumen: {
          total: 0,
          noLeidas: 0,
          alertas: { total: 0, noLeidas: 0 },
          info: { total: 0, noLeidas: 0 },
          exito: { total: 0, noLeidas: 0 }
        }
      });
    }
    
    // Retornar tanto las notificaciones como el resumen
    return NextResponse.json({ 
      notificaciones,
      resumen: {
        total: totalNotificaciones,
        noLeidas,
        alertas: {
          total: alertas,
          noLeidas: alertasNoLeidas
        },
        info: {
          total: info,
          noLeidas: infoNoLeidas
        },
        exito: {
          total: exito,
          noLeidas: exitoNoLeidas
        }
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error al listar notificaciones:', error);
    
    return NextResponse.json({ 
      message: "Error al obtener las notificaciones",
      error: error.message 
    }, { status: 500 });
  }
} 