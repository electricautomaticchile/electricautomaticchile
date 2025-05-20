import mongoose, { Schema, Document } from 'mongoose';
import { ICliente } from './cliente';

// Definir tipos para el historial de servicio
export type TipoServicio = 
  | 'instalacion' 
  | 'mantenimiento' 
  | 'reparacion' 
  | 'actualizacion' 
  | 'calibracion' 
  | 'inspeccion'
  | 'remoto'
  | 'asesoria'
  | 'otro';

export type EstadoServicio = 
  | 'programado' 
  | 'en_proceso' 
  | 'completado' 
  | 'cancelado' 
  | 'reprogramado'
  | 'pendiente_piezas'
  | 'pendiente_aprobacion';

// Interfaz para documentos adjuntos
export interface IDocumentoServicio {
  tipo: 'foto' | 'pdf' | 'firma' | 'archivo';
  nombre: string;
  url: string;
  fechaSubida: Date;
  tamaño?: number;
  descripcion?: string;
}

// Interfaz para el historial de servicios del cliente
export interface IClienteHistorial extends Document {
  cliente: mongoose.Types.ObjectId | ICliente;
  tipoServicio: TipoServicio;
  fechaSolicitud: Date;
  fechaProgramada?: Date;
  fechaRealizacion?: Date;
  estado: EstadoServicio;
  tecnicoAsignado?: mongoose.Types.ObjectId;
  descripcionProblema: string;
  dispositivosRelacionados: mongoose.Types.ObjectId[];
  direccionServicio?: string;
  coordenadasServicio?: {
    latitud: number;
    longitud: number;
  };
  solucionAplicada?: string;
  tiempoServicio?: number; // en minutos
  costoServicio?: number;
  documentosAdjuntos?: IDocumentoServicio[];
  calificacionServicio?: {
    puntuacion: number; // 1-5
    comentario?: string;
    fecha: Date;
  };
  seguimientoRealizado: boolean;
  notas?: string;
  // Campos para facturación
  facturado: boolean;
  numeroFactura?: string;
  fechaFacturacion?: Date;
  // Campo para servicios periódicos
  esServicioPeriodico: boolean;
  frecuenciaServicio?: 'mensual' | 'trimestral' | 'semestral' | 'anual';
  proximoServicioProgramado?: Date;
}

// Esquema para el historial de servicios
const ClienteHistorialSchema = new Schema<IClienteHistorial>({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: [true, 'El cliente asociado es requerido'],
    index: true
  },
  tipoServicio: {
    type: String,
    enum: ['instalacion', 'mantenimiento', 'reparacion', 'actualizacion', 'calibracion', 'inspeccion', 'remoto', 'asesoria', 'otro'],
    required: [true, 'El tipo de servicio es requerido'],
    index: true
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  },
  fechaProgramada: {
    type: Date,
    index: true
  },
  fechaRealizacion: {
    type: Date
  },
  estado: {
    type: String,
    enum: ['programado', 'en_proceso', 'completado', 'cancelado', 'reprogramado', 'pendiente_piezas', 'pendiente_aprobacion'],
    default: 'programado',
    required: true,
    index: true
  },
  tecnicoAsignado: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  descripcionProblema: {
    type: String,
    required: [true, 'La descripción del problema es requerida']
  },
  dispositivosRelacionados: [{
    type: Schema.Types.ObjectId,
    ref: 'Dispositivo',
    index: true
  }],
  direccionServicio: {
    type: String
  },
  coordenadasServicio: {
    latitud: Number,
    longitud: Number
  },
  solucionAplicada: {
    type: String
  },
  tiempoServicio: {
    type: Number
  },
  costoServicio: {
    type: Number
  },
  documentosAdjuntos: [{
    tipo: {
      type: String,
      enum: ['foto', 'pdf', 'firma', 'archivo'],
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    fechaSubida: {
      type: Date,
      default: Date.now
    },
    tamaño: Number,
    descripcion: String
  }],
  calificacionServicio: {
    puntuacion: {
      type: Number,
      min: 1,
      max: 5
    },
    comentario: String,
    fecha: Date
  },
  seguimientoRealizado: {
    type: Boolean,
    default: false
  },
  notas: {
    type: String
  },
  // Campos para facturación
  facturado: {
    type: Boolean,
    default: false,
    index: true
  },
  numeroFactura: {
    type: String
  },
  fechaFacturacion: {
    type: Date
  },
  // Campo para servicios periódicos
  esServicioPeriodico: {
    type: Boolean,
    default: false
  },
  frecuenciaServicio: {
    type: String,
    enum: ['mensual', 'trimestral', 'semestral', 'anual']
  },
  proximoServicioProgramado: {
    type: Date,
    index: true
  }
}, {
  timestamps: true
});

// Índices para consultas frecuentes
ClienteHistorialSchema.index({ cliente: 1, estado: 1 });
ClienteHistorialSchema.index({ fechaProgramada: 1, estado: 1 });
ClienteHistorialSchema.index({ tecnicoAsignado: 1, estado: 1 });
ClienteHistorialSchema.index({ tipoServicio: 1, cliente: 1 });
ClienteHistorialSchema.index({ 'dispositivosRelacionados': 1 });
ClienteHistorialSchema.index({ esServicioPeriodico: 1, proximoServicioProgramado: 1 });

// Método estático para encontrar servicios pendientes
ClienteHistorialSchema.statics.buscarServiciosPendientes = async function() {
  const ahora = new Date();
  
  return this.find({
    estado: { $in: ['programado', 'reprogramado'] },
    fechaProgramada: { $lte: ahora }
  })
  .sort({ fechaProgramada: 1 })
  .populate('cliente', 'numeroCliente nombre email telefono')
  .populate('tecnicoAsignado', 'nombre email telefono')
  .populate('dispositivosRelacionados', 'idDispositivo modelo numeroSerie');
};

// Método estático para encontrar servicios por técnico
ClienteHistorialSchema.statics.buscarServiciosPorTecnico = async function(tecnicoId: string, inicio: Date, fin: Date) {
  return this.find({
    tecnicoAsignado: tecnicoId,
    fechaProgramada: { $gte: inicio, $lte: fin }
  })
  .sort({ fechaProgramada: 1 })
  .populate('cliente', 'numeroCliente nombre email telefono')
  .populate('dispositivosRelacionados', 'idDispositivo modelo numeroSerie');
};

// Método estático para encontrar servicios por dispositivo
ClienteHistorialSchema.statics.buscarServiciosPorDispositivo = async function(dispositivoId: string) {
  return this.find({
    dispositivosRelacionados: dispositivoId
  })
  .sort({ fechaSolicitud: -1 })
  .populate('cliente', 'numeroCliente nombre email')
  .populate('tecnicoAsignado', 'nombre email');
};

// Método estático para servicios próximos a vencer (servicios periódicos)
ClienteHistorialSchema.statics.buscarServiciosProximosAVencer = async function(diasAnticipacion: number = 7) {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);
  
  return this.find({
    esServicioPeriodico: true,
    proximoServicioProgramado: { $lte: fechaLimite },
    estado: 'completado' // El último servicio está completado
  })
  .populate('cliente', 'numeroCliente nombre email telefono')
  .populate('dispositivosRelacionados', 'idDispositivo modelo numeroSerie');
};

// Método para programar el siguiente servicio periódico
ClienteHistorialSchema.methods.programarSiguienteServicio = async function() {
  if (!this.esServicioPeriodico || !this.frecuenciaServicio) {
    return null;
  }
  
  // Calcular la fecha del próximo servicio según la frecuencia
  const fechaProximoServicio = new Date();
  switch (this.frecuenciaServicio) {
    case 'mensual':
      fechaProximoServicio.setMonth(fechaProximoServicio.getMonth() + 1);
      break;
    case 'trimestral':
      fechaProximoServicio.setMonth(fechaProximoServicio.getMonth() + 3);
      break;
    case 'semestral':
      fechaProximoServicio.setMonth(fechaProximoServicio.getMonth() + 6);
      break;
    case 'anual':
      fechaProximoServicio.setFullYear(fechaProximoServicio.getFullYear() + 1);
      break;
  }
  
  // Guardar el nuevo servicio programado
  try {
    // Crear un nuevo documento para el siguiente servicio
    const ClienteHistorialModel = mongoose.model('ClienteHistorial');
    const nuevoHistorialServicio = new ClienteHistorialModel({
      cliente: this.cliente,
      tipoServicio: this.tipoServicio,
      fechaSolicitud: new Date(),
      fechaProgramada: fechaProximoServicio,
      estado: 'programado',
      tecnicoAsignado: this.tecnicoAsignado,
      descripcionProblema: `Servicio periódico - ${this.tipoServicio}`,
      dispositivosRelacionados: this.dispositivosRelacionados,
      direccionServicio: this.direccionServicio,
      coordenadasServicio: this.coordenadasServicio,
      esServicioPeriodico: true,
      frecuenciaServicio: this.frecuenciaServicio,
      seguimientoRealizado: false
    });
    
    return await nuevoHistorialServicio.save();
  } catch (error) {
    console.error('Error al programar siguiente servicio:', error);
    return null;
  }
};

// Definir el modelo
export const ClienteHistorial = mongoose.models.ClienteHistorial || 
  mongoose.model<IClienteHistorial>('ClienteHistorial', ClienteHistorialSchema);

export default ClienteHistorial; 