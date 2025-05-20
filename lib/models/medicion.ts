import mongoose, { Schema, Document } from 'mongoose';
import { IDispositivo } from './dispositivo';

// Tipos para mediciones específicas
export type DetalleTension = {
  fase: 'monofasico' | 'bifasico' | 'trifasico';
  valorRMS: number;
  pico?: number;
  distorsionArmonica?: number;
};

export type DetalleConsumo = {
  instantaneo: number; // en kW
  acumuladoDia: number; // en kWh
  acumuladoMes: number; // en kWh
  factorPotencia?: number;
};

export type DetalleCalidad = {
  fluctuaciones: number; // porcentaje de fluctuación
  caidas: number; // cantidad de caídas de tensión
  picos: number; // cantidad de picos de tensión
  calificacionGeneral: 'excelente' | 'buena' | 'regular' | 'deficiente';
};

// Interfaz principal de medición
export interface IMedicion extends Document {
  dispositivo: mongoose.Types.ObjectId | IDispositivo;
  fechaMedicion: Date;
  tipo: 'periodica' | 'solicitada' | 'automatica' | 'alarma';
  estadoConexion: 'conectado' | 'desconectado' | 'intermitente';
  tension: {
    valor: number; // en Voltios
    unidad: string; // V
    detalles?: DetalleTension;
  };
  corriente: {
    valor: number; // en Amperios
    unidad: string; // A
  };
  potencia: {
    valor: number; // en Watts o kW
    unidad: string; // W o kW
  };
  consumo: {
    valor: number; // en kWh
    unidad: string; // kWh
    detalles?: DetalleConsumo;
  };
  temperatura: {
    valor?: number; // en grados Celsius
    unidad: string; // °C
  };
  calidadEnergia?: DetalleCalidad;
  metadatos?: Record<string, any>;
  esValida: boolean;
  anomaliaDetectada?: boolean;
  comentarios?: string;
}

// Esquema para las mediciones
const MedicionSchema = new Schema<IMedicion>({
  dispositivo: {
    type: Schema.Types.ObjectId,
    ref: 'Dispositivo',
    required: [true, 'El dispositivo asociado es requerido'],
    index: true
  },
  fechaMedicion: {
    type: Date,
    default: Date.now,
    index: true
  },
  tipo: {
    type: String,
    enum: ['periodica', 'solicitada', 'automatica', 'alarma'],
    default: 'periodica'
  },
  estadoConexion: {
    type: String,
    enum: ['conectado', 'desconectado', 'intermitente'],
    default: 'conectado'
  },
  tension: {
    valor: {
      type: Number,
      required: [true, 'El valor de tensión es requerido']
    },
    unidad: {
      type: String,
      default: 'V'
    },
    detalles: {
      fase: {
        type: String,
        enum: ['monofasico', 'bifasico', 'trifasico'],
        default: 'monofasico'
      },
      valorRMS: Number,
      pico: Number,
      distorsionArmonica: Number
    }
  },
  corriente: {
    valor: {
      type: Number,
      required: [true, 'El valor de corriente es requerido']
    },
    unidad: {
      type: String,
      default: 'A'
    }
  },
  potencia: {
    valor: {
      type: Number,
      required: [true, 'El valor de potencia es requerido']
    },
    unidad: {
      type: String,
      default: 'kW'
    }
  },
  consumo: {
    valor: {
      type: Number,
      required: [true, 'El valor de consumo es requerido']
    },
    unidad: {
      type: String,
      default: 'kWh'
    },
    detalles: {
      instantaneo: Number,
      acumuladoDia: Number,
      acumuladoMes: Number,
      factorPotencia: {
        type: Number,
        min: 0,
        max: 1
      }
    }
  },
  temperatura: {
    valor: Number,
    unidad: {
      type: String,
      default: '°C'
    }
  },
  calidadEnergia: {
    fluctuaciones: Number,
    caidas: Number,
    picos: Number,
    calificacionGeneral: {
      type: String,
      enum: ['excelente', 'buena', 'regular', 'deficiente']
    }
  },
  metadatos: {
    type: Map,
    of: Schema.Types.Mixed
  },
  esValida: {
    type: Boolean,
    default: true
  },
  anomaliaDetectada: Boolean,
  comentarios: String
}, {
  timestamps: true
});

// Índices compuestos para consultas frecuentes
MedicionSchema.index({ dispositivo: 1, fechaMedicion: -1 });
MedicionSchema.index({ dispositivo: 1, 'consumo.valor': 1 });
MedicionSchema.index({ fechaMedicion: -1, anomaliaDetectada: 1 });

// Método estático para obtener resumen de consumo por dispositivo
MedicionSchema.statics.obtenerResumenConsumo = async function(idDispositivo: string, fechaInicio: Date, fechaFin: Date) {
  return this.aggregate([
    {
      $match: {
        dispositivo: new mongoose.Types.ObjectId(idDispositivo),
        fechaMedicion: { $gte: fechaInicio, $lte: fechaFin },
        esValida: true
      }
    },
    {
      $group: {
        _id: {
          año: { $year: "$fechaMedicion" },
          mes: { $month: "$fechaMedicion" },
          dia: { $dayOfMonth: "$fechaMedicion" }
        },
        consumoPromedio: { $avg: "$consumo.valor" },
        consumoTotal: { $sum: "$consumo.valor" },
        potenciaMaxima: { $max: "$potencia.valor" },
        mediciones: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.año": 1, "_id.mes": 1, "_id.dia": 1 }
    }
  ]);
};

// Método para calcular anomalías
MedicionSchema.methods.verificarAnomalias = function() {
  let anomalias = [];
  
  // Verificar tensión fuera de rango
  if (this.tension.valor < 200 || this.tension.valor > 240) {
    anomalias.push({
      tipo: 'tension',
      mensaje: `Tensión fuera de rango: ${this.tension.valor}${this.tension.unidad}`
    });
  }
  
  // Verificar consumo excesivo (ajustar según necesidades)
  if (this.consumo.valor > 50) {
    anomalias.push({
      tipo: 'consumo',
      mensaje: `Consumo elevado: ${this.consumo.valor}${this.consumo.unidad}`
    });
  }
  
  return anomalias;
};

// Definir el modelo
export const Medicion = mongoose.models.Medicion || 
  mongoose.model<IMedicion>('Medicion', MedicionSchema);

export default Medicion; 