import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import { ContactoFormulario } from '@/lib/models/contacto-formulario';
import Notificacion from '@/lib/models/notificacion';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { broadcastNotification, sendNotificationToUser } from '@/lib/socket/socket-service';
import mongoose from 'mongoose';

// Marcar explícitamente como ruta dinámica
export const dynamic = 'force-dynamic';

// Definir una interfaz para los usuarios administradores
interface AdminUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  role: string;
}

// Función para encontrar usuarios administradores
async function findAdminUsers(): Promise<AdminUser[]> {
  try {
    // Verificar que la conexión esté lista
    if (mongoose.connection.readyState !== 1) {
      console.log('La conexión a MongoDB no está lista');
      return [];
    }
    
    // Obtener todos los administradores
    const db = mongoose.connection.db;
    if (!db) {
      console.log('No se pudo acceder a la base de datos');
      return [];
    }
    
    const users = await db.collection('users').find({ role: 'admin' }).toArray();
    return users as AdminUser[];
  } catch (error) {
    console.error('Error al buscar administradores:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    // Usar la conexión persistente
    await connectToDatabase();
    
    // Obtener parámetro seguro para exportación estática
    const estado = request.nextUrl ? request.nextUrl.searchParams.get('estado') : null;
    
    // Construir filtro
    let filter: any = {};
    if (estado) {
      filter.estado = estado;
    }
    
    // Consultar cotizaciones
    const cotizaciones = await ContactoFormulario.find(filter)
      .sort({ fecha: -1 }) // Ordenar por fecha descendente (más recientes primero)
      .lean();
      
    return NextResponse.json({ cotizaciones }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error al obtener cotizaciones:', error);
    
    return NextResponse.json({ 
      message: "Error al obtener cotizaciones",
      error: error.message 
    }, { status: 500 });
  }
}

// Actualizar el estado de una cotización
export async function PUT(request: NextRequest) {
  try {
    const rawData = await request.text();
    const data = JSON.parse(rawData);
    
    if (!data.id || !data.estado) {
      return NextResponse.json({ 
        message: "Se requiere ID y estado para actualizar la cotización" 
      }, { status: 400 });
    }
    
    // Validar estado
    const estadosValidos = ['pendiente', 'revisado', 'cotizado', 'aprobado', 'rechazado'];
    if (!estadosValidos.includes(data.estado)) {
      return NextResponse.json({ 
        message: "Estado no válido" 
      }, { status: 400 });
    }
    
    // Usar la conexión persistente
    await connectToDatabase();
    
    // Obtener la cotización antes de actualizarla para verificar si cambió el estado
    const cotizacionAnterior = await ContactoFormulario.findById(data.id);
    const estadoAnterior = cotizacionAnterior?.estado;
    
    // Actualizar cotización
    const resultado = await ContactoFormulario.findByIdAndUpdate(
      data.id,
      { 
        estado: data.estado,
        ...(data.monto && { monto: data.monto }),
        ...(data.comentarios && { comentarios: data.comentarios })
      },
      { new: true }
    );
    
    if (!resultado) {
      return NextResponse.json({ 
        message: "Cotización no encontrada" 
      }, { status: 404 });
    }
    
    // Si el estado cambió, crear una notificación
    if (estadoAnterior !== data.estado) {
      const session = await getServerSession(authOptions);
      
      if (session && session.user) {
        // Crear la notificación para todos los administradores
        const tipoNotificacion = data.estado === 'aprobado' ? 'exito' : 
                               data.estado === 'rechazado' ? 'alerta' : 'info';
        
        // Obtener mensaje según el estado
        let titulo = 'Actualización de cotización';
        let descripcion = `La cotización de ${resultado.nombre} ha sido actualizada`;
        
        switch (data.estado) {
          case 'pendiente':
            titulo = 'Nueva cotización pendiente';
            descripcion = `La cotización de ${resultado.nombre} ha sido puesta en estado pendiente`;
            break;
          case 'revisado':
            titulo = 'Cotización revisada';
            descripcion = `La cotización de ${resultado.nombre} ha sido marcada como revisada`;
            break;
          case 'cotizado':
            titulo = 'Cotización enviada al cliente';
            descripcion = `Se ha enviado una cotización a ${resultado.nombre} por ${data.monto ? `$${data.monto.toLocaleString('es-CL')}` : 'un monto no especificado'}`;
            break;
          case 'aprobado':
            titulo = 'Cotización aprobada';
            descripcion = `${resultado.nombre} ha aprobado la cotización. Proceda con el registro del cliente.`;
            break;
          case 'rechazado':
            titulo = 'Cotización rechazada';
            descripcion = `${resultado.nombre} ha rechazado la cotización.`;
            break;
        }
        
        try {
          // Obtener los administradores
          const adminUsers = await findAdminUsers();
          
          if (adminUsers.length > 0) {
            // Prioridad según el estado
            const prioridad = data.estado === 'aprobado' ? 'alta' : 'media';
            
            // Crear una notificación para cada administrador
            for (const admin of adminUsers) {
              const nuevaNotificacion = new Notificacion({
                tipo: tipoNotificacion,
                titulo: titulo,
                descripcion: descripcion,
                destinatario: admin._id,
                creador: session.user.id,
                prioridad: prioridad,
                fecha: new Date(),
                leida: false,
                enlace: `/dashboard-superadmin/cotizaciones`
              });
              
              await nuevaNotificacion.save();
              
              // Enviar notificación en tiempo real al usuario específico
              sendNotificationToUser(admin._id.toString(), {
                id: nuevaNotificacion._id,
                tipo: tipoNotificacion,
                titulo: titulo,
                descripcion: descripcion,
                fecha: new Date(),
                prioridad: prioridad
              });
            }
            
            // También enviar la notificación general
            broadcastNotification({
              id: new mongoose.Types.ObjectId().toString(),
              tipo: tipoNotificacion,
              titulo: titulo,
              descripcion: descripcion,
              fecha: new Date(),
              prioridad: data.estado === 'aprobado' ? 'alta' : 'media'
            });
          }
        } catch (notifError) {
          console.error('Error al crear notificación:', notifError);
        }
      }
    }
    
    return NextResponse.json({ 
      message: "Cotización actualizada correctamente",
      cotizacion: resultado
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error al actualizar cotización:', error);
    
    return NextResponse.json({ 
      message: "Error al actualizar cotización",
      error: error.message 
    }, { status: 500 });
  }
}

// Eliminar una cotización
export async function DELETE(request: NextRequest) {
  try {
    // Obtener el ID de la cotización a eliminar
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        message: "Se requiere ID para eliminar la cotización" 
      }, { status: 400 });
    }
    
    // Usar la conexión persistente
    await connectToDatabase();
    
    // Obtener la cotización antes de eliminarla
    const cotizacion = await ContactoFormulario.findById(id);
    
    if (!cotizacion) {
      return NextResponse.json({ 
        message: "Cotización no encontrada" 
      }, { status: 404 });
    }
    
    // Eliminar cotización
    await ContactoFormulario.findByIdAndDelete(id);
    
    // Crear notificación de eliminación
    const session = await getServerSession(authOptions);
    
    if (session && session.user) {
      try {
        // Obtener todos los administradores
        const adminUsers = await findAdminUsers();
        
        if (adminUsers.length > 0) {
          // Crear una notificación para cada administrador
          for (const admin of adminUsers) {
            const nuevaNotificacion = new Notificacion({
              tipo: 'alerta',
              titulo: 'Cotización eliminada',
              descripcion: `La cotización de ${cotizacion.nombre} ha sido eliminada del sistema`,
              destinatario: admin._id,
              creador: session.user.id,
              prioridad: 'media',
              fecha: new Date(),
              leida: false,
              enlace: `/dashboard-superadmin/cotizaciones`
            });
            
            await nuevaNotificacion.save();
            
            // Enviar notificación en tiempo real al usuario específico
            sendNotificationToUser(admin._id.toString(), {
              id: nuevaNotificacion._id,
              tipo: 'alerta',
              titulo: 'Cotización eliminada',
              descripcion: `La cotización de ${cotizacion.nombre} ha sido eliminada del sistema`,
              fecha: new Date(),
              prioridad: 'media'
            });
          }
          
          // También enviar la notificación general
          broadcastNotification({
            id: new mongoose.Types.ObjectId().toString(),
            tipo: 'alerta',
            titulo: 'Cotización eliminada',
            descripcion: `La cotización de ${cotizacion.nombre} ha sido eliminada del sistema`,
            fecha: new Date(),
            prioridad: 'media'
          });
        }
      } catch (notifError) {
        console.error('Error al crear notificación de eliminación:', notifError);
      }
    }
    
    return NextResponse.json({ 
      message: "Cotización eliminada correctamente"
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error al eliminar cotización:', error);
    
    return NextResponse.json({ 
      message: "Error al eliminar cotización",
      error: error.message 
    }, { status: 500 });
  }
} 