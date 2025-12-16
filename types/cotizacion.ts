export interface ICotizacion {
  _id: string;
  numero?: string;
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  servicio:
    | "cotizacion_reposicion"
    | "cotizacion_monitoreo"
    | "cotizacion_mantenimiento"
    | "cotizacion_completa";
  plazo?: "urgente" | "pronto" | "normal" | "planificacion";
  mensaje: string;
  archivoUrl?: string;
  archivo?: string;
  archivoTipo?: string;
  estado:
    | "pendiente"
    | "en_revision"
    | "cotizando"
    | "cotizada"
    | "aprobada"
    | "rechazada"
    | "convertida_cliente";
  prioridad: "baja" | "media" | "alta" | "critica";
  titulo?: string;
  descripcion?: string;
  items?: Array<{
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
  subtotal?: number;
  iva?: number;
  total?: number;
  validezDias?: number;
  condicionesPago?: string;
  clienteId?: string;
  asignadoA?: string;
  fechaCreacion: string;
  fechaActualizacion?: string;
  fechaCotizacion?: string;
  fechaAprobacion?: string;
  fechaConversion?: string;
  notas?: string;
}

export interface ICrearCotizacion {
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  servicio:
    | "cotizacion_reposicion"
    | "cotizacion_monitoreo"
    | "cotizacion_mantenimiento"
    | "cotizacion_completa";
  plazo?: "urgente" | "pronto" | "normal" | "planificacion";
  mensaje: string;
  archivo?: string;
  archivoTipo?: string;
}

export interface IActualizarCotizacion {
  estado?:
    | "pendiente"
    | "en_revision"
    | "cotizando"
    | "cotizada"
    | "aprobada"
    | "rechazada"
    | "convertida_cliente";
  prioridad?: "baja" | "media" | "alta" | "critica";
  titulo?: string;
  descripcion?: string;
  items?: Array<{
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
  subtotal?: number;
  iva?: number;
  total?: number;
  validezDias?: number;
  condicionesPago?: string;
  asignadoA?: string;
  notas?: string;
}
