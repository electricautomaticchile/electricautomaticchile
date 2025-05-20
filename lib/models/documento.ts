import mongoose, { Schema, Document } from 'mongoose';

// Tipos de documentos
export type TipoDocumento = 
  | 'factura'
  | 'contrato'
  | 'reporte_tecnico'
  | 'manual'
  | 'certificado'
  | 'foto'
  | 'firma'
  | 'plano'
  | 'otro';

// Relacionado con
export type EntidadRelacionada =
  | 'cliente'
  | 'dispositivo'
  | 'servicio'
  | 'medicion'
  | 'usuario'
  | 'proyecto'
  | 'otro';

// Interfaz principal para documento
export interface IDocumento extends Document {
  nombre: string;
  descripcion?: string;
  tipoDocumento: TipoDocumento;
  tipoArchivo: string; // MIME type
  tamaño: number; // tamaño en bytes
  url: string; // URL pública o prefirmada en S3
  claveS3: string; // Clave única en S3
  entidadRelacionada: EntidadRelacionada;
  referenciaId: mongoose.Types.ObjectId | string; // Puede ser ObjectId o string para casos especiales
  entidadModelo: string;
  esPublico: boolean;
  fechaSubida: Date;
  fechaExpiracion?: Date;
  usuario: mongoose.Types.ObjectId | string; // Usuario que subió el documento o string para casos especiales
  metadatos?: Record<string, any>; // Datos adicionales del documento
  etiquetas?: string[];
}

// Esquema para el modelo de documento
const DocumentoSchema = new Schema<IDocumento>({
  nombre: {
    type: String,
    required: [true, 'El nombre del documento es requerido'],
    trim: true,
    index: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  tipoDocumento: {
    type: String,
    enum: ['factura', 'contrato', 'reporte_tecnico', 'manual', 'certificado', 'foto', 'firma', 'plano', 'otro'],
    required: [true, 'El tipo de documento es requerido'],
    index: true
  },
  tipoArchivo: {
    type: String,
    required: [true, 'El tipo de archivo es requerido'],
    index: true
  },
  tamaño: {
    type: Number,
    required: [true, 'El tamaño del archivo es requerido']
  },
  url: {
    type: String,
    required: [true, 'La URL del documento es requerida']
  },
  claveS3: {
    type: String,
    required: [true, 'La clave S3 es requerida'],
    unique: true
  },
  entidadRelacionada: {
    type: String,
    enum: ['cliente', 'dispositivo', 'servicio', 'medicion', 'usuario', 'proyecto', 'otro'],
    required: [true, 'La entidad relacionada es requerida'],
    index: true
  },
  referenciaId: {
    type: Schema.Types.Mixed, // Permite tanto ObjectId como String
    required: [true, 'La referencia ID es requerida'],
    refPath: 'entidadModelo',
    index: true
  },
  entidadModelo: {
    type: String,
    required: [true, 'La entidad modelo es requerida'],
    enum: ['Cliente', 'Dispositivo', 'ClienteHistorial', 'Medicion', 'Usuario', 'Proyecto'],
  },
  esPublico: {
    type: Boolean,
    default: false,
    index: true
  },
  fechaSubida: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  },
  fechaExpiracion: {
    type: Date,
    index: true
  },
  usuario: {
    type: Schema.Types.Mixed, // Permite tanto ObjectId como String
    ref: 'Usuario',
    required: [true, 'El usuario que subió el documento es requerido'],
    index: true
  },
  metadatos: {
    type: Map,
    of: Schema.Types.Mixed
  },
  etiquetas: [{
    type: String,
    trim: true,
    lowercase: true,
    index: true
  }]
}, {
  timestamps: {
    createdAt: 'fechaSubida',
    updatedAt: 'ultimaActualizacion'
  }
});

// Índices compuestos para consultas frecuentes
DocumentoSchema.index({ entidadRelacionada: 1, referenciaId: 1 });
DocumentoSchema.index({ usuario: 1, tipoDocumento: 1 });
DocumentoSchema.index({ 'etiquetas': 1 });

// Método estático para buscar documentos por entidad
DocumentoSchema.statics.buscarPorEntidad = async function(
  entidad: EntidadRelacionada,
  id: mongoose.Types.ObjectId
) {
  return this.find({
    entidadRelacionada: entidad,
    referenciaId: id
  }).sort({ fechaSubida: -1 });
};

// Método estático para buscar por tipo de documento
DocumentoSchema.statics.buscarPorTipo = async function(
  tipo: TipoDocumento,
  limite: number = 50
) {
  return this.find({
    tipoDocumento: tipo
  })
  .sort({ fechaSubida: -1 })
  .limit(limite)
  .populate('usuario', 'nombre email');
};

// Método virtual para generar la URL de vista previa (en caso de imágenes)
DocumentoSchema.virtual('urlVistaPrevia').get(function() {
  // Si es una imagen, devolvemos la misma URL
  if (this.tipoArchivo.startsWith('image/')) {
    return this.url;
  }
  // Para otros tipos, devolvemos null
  return null;
});

// Método para determinar si el documento está expirado
DocumentoSchema.methods.estaExpirado = function(): boolean {
  if (!this.fechaExpiracion) return false;
  return new Date() > this.fechaExpiracion;
};

// Pre-hook para verificar validez de fechas
DocumentoSchema.pre('save', function(next) {
  if (this.fechaExpiracion && this.fechaExpiracion < this.fechaSubida) {
    const err = new Error('La fecha de expiración no puede ser anterior a la fecha de subida');
    return next(err);
  }
  next();
});

// Definir el modelo
export const Documento = mongoose.models.Documento ||
  mongoose.model<IDocumento>('Documento', DocumentoSchema);

export default Documento; 