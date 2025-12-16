export interface ICliente {
  _id: string;
  nombre: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  rut?: string;
  tipoCliente?: "particular" | "empresa";
  empresa?: string;
  numeroCliente?: string;
  role?: string;
  esActivo?: boolean;
  activo?: boolean;
  passwordTemporal?: string;
  fechaRegistro?: string;
  fechaActivacion?: string;
  ultimoAcceso?: string;
}

export interface ICrearCliente {
  nombre: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  rut?: string;
  tipoCliente?: "particular" | "empresa";
  empresa?: string;
}

export interface IActualizarCliente {
  nombre?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  rut?: string;
  tipoCliente?: "particular" | "empresa";
  empresa?: string;
  esActivo?: boolean;
}
