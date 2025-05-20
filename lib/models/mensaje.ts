import mongoose, { Schema, Document } from 'mongoose';

export interface IMensaje extends Document {
  emisor: mongoose.Types.ObjectId;
  receptor: mongoose.Types.ObjectId;
  asunto: string;
  contenido: string;
  leido: boolean;
  fechaEnvio: Date;
  fechaLectura?: Date;
  adjuntos?: string[];
  conversacionId: mongoose.Types.ObjectId;
  esRespuesta: boolean;
  mensajeOriginal?: mongoose.Types.ObjectId;
}

const MensajeSchema = new Schema<IMensaje>({
  emisor: { 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario',
    required: [true, 'El emisor es requerido'] 
  },
  receptor: { 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario',
    required: [true, 'El receptor es requerido'] 
  },
  asunto: { 
    type: String, 
    required: [true, 'El asunto es requerido'] 
  },
  contenido: { 
    type: String, 
    required: [true, 'El contenido es requerido'] 
  },
  leido: { 
    type: Boolean, 
    default: false 
  },
  fechaEnvio: { 
    type: Date, 
    default: Date.now 
  },
  fechaLectura: { 
    type: Date 
  },
  adjuntos: [{ 
    type: String 
  }],
  conversacionId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversacion',
    required: [true, 'La conversación es requerida']
  },
  esRespuesta: {
    type: Boolean,
    default: false
  },
  mensajeOriginal: {
    type: Schema.Types.ObjectId,
    ref: 'Mensaje'
  }
}, {
  timestamps: true
});

// Índices para búsquedas más rápidas
MensajeSchema.index({ emisor: 1, receptor: 1 });
MensajeSchema.index({ conversacionId: 1 });
MensajeSchema.index({ fechaEnvio: -1 });
MensajeSchema.index({ receptor: 1, leido: 1 });

export default mongoose.models.Mensaje || mongoose.model<IMensaje>('Mensaje', MensajeSchema); 