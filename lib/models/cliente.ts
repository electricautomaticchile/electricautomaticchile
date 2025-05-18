import mongoose, { Schema, Document } from 'mongoose';
import { IContactForm } from './contacto-formulario';

// Definir la interfaz para el documento de cliente
export interface ICliente extends Document {
  numeroCliente: string;        // Formato: XXXXXX-X
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  password?: string;            // Almacenado con hash
  esActivo: boolean;
  cotizacionAprobada: mongoose.Types.ObjectId | IContactForm;
  fechaRegistro: Date;
  fechaActivacion?: Date;
  ultimoAcceso?: Date;
  rolCliente: 'cliente' | 'admin';
  tokenActivacion?: string;
  tokenExpiracion?: Date;
  notas?: string;
}

// Crear el esquema para el cliente
const ClienteSchema = new Schema<ICliente>({
  numeroCliente: { 
    type: String, 
    required: [true, 'El número de cliente es requerido'],
    unique: true,
    match: [/^\d{6}-\d$/, 'El formato debe ser XXXXXX-X (6 números, guion, 1 número)']
  },
  nombre: { 
    type: String, 
    required: [true, 'El nombre es requerido'] 
  },
  email: { 
    type: String, 
    required: [true, 'El correo electrónico es requerido'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, ingrese un correo electrónico válido']
  },
  empresa: { 
    type: String 
  },
  telefono: { 
    type: String 
  },
  password: { 
    type: String,
    // No ponemos 'required' porque primero se crea el cliente y luego se activa
  },
  esActivo: {
    type: Boolean,
    default: false
  },
  cotizacionAprobada: {
    type: Schema.Types.ObjectId,
    ref: 'ContactoFormulario',
    required: [true, 'Debe estar asociado a una cotización aprobada']
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  fechaActivacion: {
    type: Date
  },
  ultimoAcceso: {
    type: Date
  },
  rolCliente: {
    type: String,
    enum: ['cliente', 'admin'],
    default: 'cliente'
  },
  tokenActivacion: {
    type: String
  },
  tokenExpiracion: {
    type: Date
  },
  notas: {
    type: String
  }
});

// Índices para búsquedas más rápidas
ClienteSchema.index({ numeroCliente: 1 });
ClienteSchema.index({ email: 1 });
ClienteSchema.index({ cotizacionAprobada: 1 });

// Definir el modelo
// Verificamos si el modelo ya existe para evitar recompilación en desarrollo
export const Cliente = mongoose.models.Cliente || 
  mongoose.model<ICliente>('Cliente', ClienteSchema);

export default Cliente; 