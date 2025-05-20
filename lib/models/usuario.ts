import mongoose, { Schema, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

// Definir tipos para roles y permisos
export type TipoRol = 'superadmin' | 'admin' | 'cliente' | 'tecnico' | 'invitado';

export type PermisoUsuario = {
  recurso: string;
  acciones: string[];
};

// Interfaz principal para usuario
export interface IUsuario extends Document {
  username: string;
  email: string;
  password: string;
  numeroCliente?: string;
  nombre: string;
  apellido?: string;
  rol: TipoRol;
  esActivo: boolean;
  fechaUltimoAcceso?: Date;
  permisos?: PermisoUsuario[];
  avatar?: string;
  telefono?: string;
  intentosFallidos: number;
  bloqueado: boolean;
  fechaDesbloqueo?: Date;
  tokenReset?: string;
  expiracionTokenReset?: Date;
  fechaCreacion: Date;
  ultimaModificacion: Date;
  dispositivos?: mongoose.Types.ObjectId[];
  dispositivosCliente?: mongoose.Types.ObjectId[];
  perfilMFA?: {
    habilitado: boolean;
    metodo: 'sms' | 'email' | 'app';
    verificado: boolean;
    secreto?: string;
  };
  //Método para validar contraseña
  comparaPassword(candidatePassword: string): Promise<boolean>;
}

// Esquema para el modelo de usuario
const UsuarioSchema = new Schema<IUsuario>({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es requerido'],
    unique: true,
    trim: true,
    minlength: [4, 'El nombre de usuario debe tener al menos 4 caracteres'],
    maxlength: [20, 'El nombre de usuario no puede exceder los 20 caracteres'],
    index: true
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un correo electrónico válido'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    select: false // No incluir por defecto en consultas
  },
  numeroCliente: {
    type: String,
    trim: true,
    sparse: true, // Permite valores nulos sin violar unicidad
    index: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  apellido: {
    type: String,
    trim: true
  },
  rol: {
    type: String,
    enum: ['superadmin', 'admin', 'cliente', 'tecnico', 'invitado'],
    default: 'invitado',
    required: true,
    index: true
  },
  esActivo: {
    type: Boolean,
    default: true,
    index: true
  },
  fechaUltimoAcceso: {
    type: Date
  },
  permisos: [{
    recurso: {
      type: String,
      required: true
    },
    acciones: [{
      type: String,
      required: true
    }]
  }],
  avatar: String,
  telefono: String,
  intentosFallidos: {
    type: Number,
    default: 0
  },
  bloqueado: {
    type: Boolean,
    default: false,
    index: true
  },
  fechaDesbloqueo: Date,
  tokenReset: String,
  expiracionTokenReset: Date,
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  ultimaModificacion: {
    type: Date,
    default: Date.now
  },
  dispositivos: [{
    type: Schema.Types.ObjectId,
    ref: 'Dispositivo'
  }],
  dispositivosCliente: [{
    type: Schema.Types.ObjectId,
    ref: 'Dispositivo'
  }],
  perfilMFA: {
    habilitado: {
      type: Boolean,
      default: false
    },
    metodo: {
      type: String,
      enum: ['sms', 'email', 'app'],
      default: 'email'
    },
    verificado: {
      type: Boolean,
      default: false
    },
    secreto: String
  }
}, {
  timestamps: {
    createdAt: 'fechaCreacion',
    updatedAt: 'ultimaModificacion'
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para consultas frecuentes
UsuarioSchema.index({ email: 1, username: 1 });
UsuarioSchema.index({ rol: 1, esActivo: 1 });
UsuarioSchema.index({ numeroCliente: 1, esActivo: 1 });

// Middleware para encriptar contraseña antes de guardar
UsuarioSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña fue modificada o es nueva
  if (!this.isModified('password')) return next();

  try {
    // Generar salt con factor de costo 12
    const salt = await bcrypt.genSalt(12);
    // Encriptar contraseña
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar contraseña
UsuarioSchema.methods.comparaPassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    // Usar bcrypt para comparar
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Método estático para buscar por email o username
UsuarioSchema.statics.buscarPorCredenciales = async function(credential: string) {
  // Buscar por email o username
  return this.findOne({
    $or: [
      { email: credential },
      { username: credential }
    ]
  }).select('+password'); // Incluir campo password que normalmente está excluido
};

// Método para incrementar intentos fallidos y bloquear cuenta si necesario
UsuarioSchema.methods.registrarIntentoFallido = async function() {
  this.intentosFallidos += 1;
  
  // Si supera 5 intentos fallidos, bloquear por 30 minutos
  if (this.intentosFallidos >= 5) {
    this.bloqueado = true;
    const fechaDesbloqueo = new Date();
    fechaDesbloqueo.setMinutes(fechaDesbloqueo.getMinutes() + 30);
    this.fechaDesbloqueo = fechaDesbloqueo;
  }
  
  await this.save();
};

// Método para resetear intentos fallidos
UsuarioSchema.methods.resetearIntentosFallidos = async function() {
  if (this.intentosFallidos > 0) {
    this.intentosFallidos = 0;
    await this.save();
  }
};

// Método para verificar si la cuenta está bloqueada
UsuarioSchema.methods.estaBloqueada = function(): boolean {
  if (!this.bloqueado) return false;
  
  // Si está bloqueada, verificar si ya pasó el tiempo de bloqueo
  if (this.fechaDesbloqueo && new Date() > this.fechaDesbloqueo) {
    // El periodo de bloqueo terminó, pero necesita ser actualizado en la BD
    return false;
  }
  
  return true;
};

// Definir el modelo
export const Usuario = mongoose.models.Usuario || 
  mongoose.model<IUsuario>('Usuario', UsuarioSchema);

export default Usuario; 