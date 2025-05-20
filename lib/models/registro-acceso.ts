import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para el registro de acceso
export interface IRegistroAcceso extends Document {
  idUsuario: string;
  nombreUsuario?: string;
  correoUsuario?: string;
  rolUsuario?: string;
  tipoAccion: string;
  recurso: string;
  detallesRecurso?: Record<string, any>;
  exitoso: boolean;
  razonFallo?: string;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  geolocalizacion?: {
    pais?: string;
    ciudad?: string;
    coordenadas?: {
      latitud: number;
      longitud: number;
    };
  };
  metodoAutenticacion?: 'password' | 'token' | 'oauth' | 'api-key';
  detalles?: Record<string, any>;
  sesionId?: string;
  duracion?: number; // en milisegundos
}

// Esquema para el registro de acceso
const RegistroAccesoSchema = new Schema<IRegistroAcceso>({
  idUsuario: {
    type: String,
    required: [true, 'El ID del usuario es requerido'],
    index: true
  },
  nombreUsuario: {
    type: String
  },
  correoUsuario: {
    type: String
  },
  rolUsuario: {
    type: String
  },
  tipoAccion: {
    type: String,
    required: [true, 'El tipo de acción es requerido'],
    index: true
  },
  recurso: {
    type: String,
    required: [true, 'El recurso accedido es requerido'],
    index: true
  },
  detallesRecurso: {
    type: Map,
    of: Schema.Types.Mixed
  },
  exitoso: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  },
  razonFallo: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  },
  ip: {
    type: String,
    index: true
  },
  userAgent: {
    type: String
  },
  geolocalizacion: {
    pais: String,
    ciudad: String,
    coordenadas: {
      latitud: Number,
      longitud: Number
    }
  },
  metodoAutenticacion: {
    type: String,
    enum: ['password', 'token', 'oauth', 'api-key']
  },
  detalles: {
    type: Map,
    of: Schema.Types.Mixed
  },
  sesionId: {
    type: String,
    index: true
  },
  duracion: {
    type: Number
  }
}, {
  timestamps: true
});

// Índices compuestos para consultas comunes
RegistroAccesoSchema.index({ idUsuario: 1, timestamp: -1 });
RegistroAccesoSchema.index({ tipoAccion: 1, timestamp: -1 });
RegistroAccesoSchema.index({ exitoso: 1, timestamp: -1 });
RegistroAccesoSchema.index({ ip: 1, timestamp: -1 });

// Método estático para obtener intentos de acceso fallidos recientes
RegistroAccesoSchema.statics.obtenerIntentosFallidos = async function(
  idUsuario: string, 
  minutos: number = 30
): Promise<IRegistroAcceso[]> {
  const fechaLimite = new Date();
  fechaLimite.setMinutes(fechaLimite.getMinutes() - minutos);
  
  return this.find({
    idUsuario,
    exitoso: false,
    timestamp: { $gte: fechaLimite }
  }).sort({ timestamp: -1 });
};

// Método estático para detectar posibles ataques de fuerza bruta
RegistroAccesoSchema.statics.detectarPosibleAtaqueFuerzaBruta = async function(
  ip: string,
  minutos: number = 10,
  umbralIntentos: number = 5
): Promise<boolean> {
  const fechaLimite = new Date();
  fechaLimite.setMinutes(fechaLimite.getMinutes() - minutos);
  
  const conteoIntentos = await this.countDocuments({
    ip,
    exitoso: false,
    timestamp: { $gte: fechaLimite }
  });
  
  return conteoIntentos >= umbralIntentos;
};

// Método estático para obtener estadísticas de acceso
RegistroAccesoSchema.statics.obtenerEstadisticasAcceso = async function(
  fechaInicio: Date,
  fechaFin: Date
) {
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: fechaInicio, $lte: fechaFin }
      }
    },
    {
      $group: {
        _id: {
          fecha: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          exitoso: '$exitoso'
        },
        total: { $sum: 1 },
        usuarios: { $addToSet: '$idUsuario' }
      }
    },
    {
      $group: {
        _id: '$_id.fecha',
        accesosExitosos: {
          $sum: {
            $cond: [{ $eq: ['$_id.exitoso', true] }, '$total', 0]
          }
        },
        accesosFallidos: {
          $sum: {
            $cond: [{ $eq: ['$_id.exitoso', false] }, '$total', 0]
          }
        },
        totalUsuariosUnicos: { $addToSet: '$usuarios' }
      }
    },
    {
      $project: {
        fecha: '$_id',
        accesosExitosos: 1,
        accesosFallidos: 1,
        totalAccesos: { $add: ['$accesosExitosos', '$accesosFallidos'] },
        totalUsuariosUnicos: { $size: { $reduce: { input: '$totalUsuariosUnicos', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } } }
      }
    },
    {
      $sort: { fecha: 1 }
    }
  ]);
};

// Definir el modelo
export const RegistroAcceso = mongoose.models.RegistroAcceso || 
  mongoose.model<IRegistroAcceso>('RegistroAcceso', RegistroAccesoSchema);

export default RegistroAcceso; 