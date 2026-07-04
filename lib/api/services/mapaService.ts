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

    // El endpoint devuelve { success, dispositivos, clientes } en el nivel
    // superior. Según el interceptor/estructura, los datos pueden llegar bajo
    // `data` o directamente en la raíz de la respuesta; contemplamos ambos.
    const raw = response as unknown as Partial<DatosMapaResponse> & {
      data?: DatosMapaResponse;
    };
    const payload = raw?.data ?? raw;

    return {
      dispositivos: payload?.dispositivos ?? [],
      clientes: payload?.clientes ?? [],
    };
  },
};
