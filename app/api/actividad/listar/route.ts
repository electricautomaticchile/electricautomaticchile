import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Conectar a la base de datos
    const db = await clientPromise;
    const actividadesCollection = db.db("electricautomaticchile").collection("actividades");
    
    // Obtener parámetros de consulta
    const searchParams = request.nextUrl.searchParams;
    const limite = parseInt(searchParams.get("limite") || "50");
    const severidad = searchParams.get("severidad");
    const resultado = searchParams.get("resultado");
    const busqueda = searchParams.get("busqueda");
    
    // Construir el query
    let query: any = {};
    
    if (severidad && severidad !== 'todas') {
      query.severidad = severidad;
    }
    
    if (resultado && resultado !== 'todos') {
      query.resultado = resultado;
    }
    
    if (busqueda) {
      query.$or = [
        { usuario: { $regex: busqueda, $options: 'i' } },
        { empresa: { $regex: busqueda, $options: 'i' } },
        { accion: { $regex: busqueda, $options: 'i' } },
        { modulo: { $regex: busqueda, $options: 'i' } }
      ];
    }
    
    // Buscar registros y ordenarlos por fecha (más recientes primero)
    const actividades = await actividadesCollection.find(query)
      .sort({ timestamp: -1 })
      .limit(limite)
      .toArray();
    
    // Obtener estadísticas
    const totalActividades = await actividadesCollection.countDocuments();
    const exitosas = await actividadesCollection.countDocuments({ resultado: 'exitoso' });
    const fallidas = await actividadesCollection.countDocuments({ resultado: 'fallido' });
    const alertasSeguridad = await actividadesCollection.countDocuments({ 
      modulo: 'Seguridad',
      severidad: 'alta' 
    });
    
    // Para actividad de hoy, usamos la fecha actual
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    
    const actividadHoy = await actividadesCollection.countDocuments({
      timestamp: {
        $gte: hoy,
        $lt: manana
      }
    });
    
    // Para empresa más activa, agregamos por empresa y contamos
    const empresasMasActivas = await actividadesCollection.aggregate([
      { $group: { _id: "$empresa", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    
    const empresaMasActiva = empresasMasActivas.length > 0 ? empresasMasActivas[0]._id : "No hay datos";
    
    // Si no hay datos reales, generamos algunos registros de ejemplo
    if (totalActividades === 0) {
      // En un entorno real, no generaríamos datos ficticios
      return NextResponse.json({
        actividades: [],
        estadisticas: {
          totalAcciones: 0,
          exitosas: 0,
          fallidas: 0,
          alertasSeguridad: 0,
          actividadHoy: 0,
          sesionesActivas: 0,
          empresaMasActiva: "No hay datos"
        }
      });
    }
    
    // Retornar tanto los registros como las estadísticas
    return NextResponse.json({ 
      actividades,
      estadisticas: {
        totalAcciones: totalActividades,
        exitosas,
        fallidas,
        alertasSeguridad,
        actividadHoy,
        // Este dato generalmente vendría de una tabla de sesiones activas, lo simulamos
        sesionesActivas: Math.floor(Math.random() * 50) + 10,
        empresaMasActiva
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error al listar registros de actividad:', error);
    
    return NextResponse.json({ 
      message: "Error al obtener los registros de actividad",
      error: error.message 
    }, { status: 500 });
  }
} 