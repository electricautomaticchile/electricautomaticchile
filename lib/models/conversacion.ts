import mongoose, { Schema, Document } from 'mongoose';

export interface IConversacion extends Document {
  participantes: mongoose.Types.ObjectId[];
  asunto: string;
  ultimoMensaje: Date;
  creador: mongoose.Types.ObjectId;
  archivada: boolean;
  activa: boolean;
}

const ConversacionSchema = new Schema<IConversacion>({
  participantes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario',
    required: [true, 'Se requiere al menos un participante'] 
  }],
  asunto: { 
    type: String, 
    required: [true, 'El asunto es requerido'] 
  },
  ultimoMensaje: { 
    type: Date, 
    default: Date.now 
  },
  creador: { 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario',
    required: [true, 'El creador es requerido'] 
  },
  archivada: {
    type: Boolean,
    default: false
  },
  activa: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsquedas más rápidas
ConversacionSchema.index({ participantes: 1 });
ConversacionSchema.index({ ultimoMensaje: -1 });
ConversacionSchema.index({ creador: 1 });

export default mongoose.models.Conversacion || mongoose.model<IConversacion>('Conversacion', ConversacionSchema); 