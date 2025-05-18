import mongoose, { Schema, Document } from 'mongoose';

// Definir la interfaz para el documento de formulario de contacto
export interface IContactForm extends Document {
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  servicio?: string;
  plazo?: string;
  mensaje: string;
  archivo?: string;
  archivoBase64?: string;
  archivoTipo?: string;
  estado: 'pendiente' | 'revisado' | 'respondido' | 'cotizado' | 'aprobado' | 'rechazado';
  fecha: Date;
  monto?: number;
  comentarios?: string;
}

// Crear el esquema para el formulario de contacto
const ContactoFormularioSchema = new Schema<IContactForm>({
  nombre: { 
    type: String, 
    required: [true, 'El nombre es requerido'] 
  },
  email: { 
    type: String, 
    required: [true, 'El correo electrónico es requerido'],
    match: [/^\S+@\S+\.\S+$/, 'Por favor, ingrese un correo electrónico válido']
  },
  empresa: { 
    type: String 
  },
  telefono: { 
    type: String 
  },
  servicio: { 
    type: String,
    required: [true, 'Debe seleccionar un tipo de cotización'] 
  },
  plazo: {
    type: String,
    enum: ['urgente', 'pronto', 'normal', 'planificacion']
  },
  mensaje: { 
    type: String, 
    required: [true, 'Los detalles son requeridos'] 
  },
  archivo: { 
    type: String 
  },
  archivoBase64: {
    type: String
  },
  archivoTipo: {
    type: String
  },
  estado: { 
    type: String, 
    enum: ['pendiente', 'revisado', 'respondido', 'cotizado', 'aprobado', 'rechazado'],
    default: 'pendiente'
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  },
  monto: {
    type: Number
  },
  comentarios: {
    type: String
  }
});

// Definir el modelo
// Verificamos si el modelo ya existe para evitar recompilación en desarrollo
export const ContactoFormulario = mongoose.models.ContactoFormulario || 
  mongoose.model<IContactForm>('ContactoFormulario', ContactoFormularioSchema);

export default ContactoFormulario; 