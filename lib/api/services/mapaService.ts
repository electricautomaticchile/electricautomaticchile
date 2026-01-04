import { baseService } from '../utils/baseService';

export interface DispositivoMapa {
  id: string;
  numeroDispositivo: string;
  nombre: string;
  tipo: string;
  estado: string;
  latitud: number;
  longitud: number;
  direccion: string;
  clienteId: string;
  activo: boolean;
  consumo?: number;
  ultimaLectura?: string;
}

export interface ClienteMapa {
  id: string;
  nombre: string;
  numeroCliente: string;
  direccion: string;
  ciudad: string;
  latitud: number;
  longitud: number;
  activo: boolean;
}

export interface DatosMapaResponse {
  dispositivos: DispositivoMapa[];
  clientes: ClienteMapa[];
}

export const mapaService = {
  obtenerDatosMapa: async (): Promise<DatosMapaResponse> => {
    const response = await baseService.get<DatosMapaResponse>('/mapa/datos');
    return response.data || { dispositivos: [], clientes: [] };
  },
};
