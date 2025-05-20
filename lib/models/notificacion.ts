import mongoose, { Schema, Document } from 'mongoose';

export interface INotificacion extends Document {
  tipo: 'alerta' | 'info' | 'exito';
  titulo: string;
  descripcion: string;
  fecha: Date;
  leida: boolean;
  prioridad: 'alta' | 'media' | 'baja';
  destinatario: mongoose.Types.ObjectId;
  enlace?: string;
  accion?: string;
  creador?: mongoose.Types.ObjectId;
}

const NotificacionSchema = new Schema<INotificacion>({
  tipo: { 
    type: String, 
    enum: ['alerta', 'info', 'exito'],
    required: [true, 'El tipo de notificación es requerido'] 
  },
  titulo: { 
    type: String, 
    required: [true, 'El título es requerido'] 
  },
  descripcion: { 
    type: String, 
    required: [true, 'La descripción es requerida'] 
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  },
  leida: { 
    type: Boolean, 
    default: false 
  },
  prioridad: { 
    type: String, 
    enum: ['alta', 'media', 'baja'],
    default: 'media' 
  },
  destinatario: { 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario',
    required: [true, 'El destinatario es requerido'] 
  },
  enlace: { 
    type: String 
  },
  accion: { 
    type: String 
  },
  creador: { 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario'
  }
}, {
  timestamps: true
});

// Índices para búsquedas más rápidas
NotificacionSchema.index({ destinatario: 1, leida: 1 });
NotificacionSchema.index({ tipo: 1 });
NotificacionSchema.index({ fecha: -1 });

export default mongoose.models.Notificacion || mongoose.model<INotificacion>('Notificacion', NotificacionSchema); 