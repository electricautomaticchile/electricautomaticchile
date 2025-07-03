export interface IEmpresa {
  _id: string;
  numeroCliente: string;
  nombreEmpresa: string;
  razonSocial: string;
  rut: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  estado: "activo" | "suspendido" | "inactivo";
  contactoPrincipal: {
    nombre: string;
    cargo: string;
    telefono: string;
    correo: string;
  };
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  fechaActivacion?: Date;
  fechaSuspension?: Date;
  ultimoAcceso?: Date;
  motivoSuspension?: string;
  passwordTemporal?: boolean;
}

export interface ICrearEmpresa {
  nombreEmpresa: string;
  razonSocial: string;
  rut: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  contactoPrincipal: {
    nombre: string;
    cargo: string;
    telefono: string;
    correo: string;
  };
}

export interface EstadisticasEmpresas {
  totales: {
    total: number;
    activas: number;
    suspendidas: number;
    inactivas: number;
  };
  ultimas: IEmpresa[];
  porRegion: { _id: string; count: number }[];
}

export interface Credenciales {
  numeroCliente: string;
  correo: string;
  password: string;
  passwordTemporal: boolean;
  mensaje: string;
}

export interface GestionEmpresasProps {
  reducida?: boolean;
}

export const regiones = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Región Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes y la Antártica Chilena",
];
