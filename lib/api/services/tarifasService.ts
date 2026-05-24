import axios from "axios";
import { ensureCSRFToken } from "@/lib/utils/csrf";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface Tarifa {
  _id: string;
  distribuidora: string;
  tipoTarifa: string;
  comuna: string;
  redTipo: string;
  vigenciaDesde: string;
  vigenciaHasta: string;
  cargoEnergia: number;
  cargoTransmision: number;
  cargoServicioPublico: number;
  precioKwhBase: number;
  peajeDistribucion: number;
  tramosEstabilizacion: {
    hasta350Kwh: number;
    entre350Y500: number;
    mayor500Kwh: number;
  };
  activa: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CalculoConsumo {
  kwhConsumidos: number;
  precioKwhBase: number;
  cargoEstabilizacion: number;
  montoBase: number;
  montoEstabilizacion: number;
  montoTotal: number;
  tramoEstabilizacion: string;
}

const getHeaders = async (method = "GET") => {
  const csrfToken = ["POST", "PUT", "DELETE", "PATCH"].includes(method)
    ? await ensureCSRFToken()
    : "";
  return {
    'Content-Type': 'application/json',
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
  };
};

export class TarifasService {
  static async obtenerTarifas() {
    try {
      const response = await axios.get(`${API_URL}/api/tarifas`, { headers: await getHeaders(), withCredentials: true });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.error || 'Error al obtener tarifas';
      return { success: false, error: errorMessage };
    }
  }

  static async obtenerTarifaActiva(comuna: string, tipoTarifa: string) {
    try {
      const response = await axios.get(`${API_URL}/api/tarifas/activa?comuna=${comuna}&tipoTarifa=${tipoTarifa}`, { headers: await getHeaders(), withCredentials: true });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.error || 'Error al obtener tarifa';
      return { success: false, error: errorMessage };
    }
  }

  static async obtenerTarifa(id: string) {
    try {
      const response = await axios.get(`${API_URL}/api/tarifas/${id}`, { headers: await getHeaders(), withCredentials: true });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.error || 'Error al obtener tarifa';
      return { success: false, error: errorMessage };
    }
  }

  static async crearTarifa(tarifa: Partial<Tarifa>) {
    try {
      const response = await axios.post(`${API_URL}/api/tarifas`, tarifa, { headers: await getHeaders("POST"), withCredentials: true });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.error || 'Error al crear tarifa';
      return { success: false, error: errorMessage };
    }
  }

  static async actualizarTarifa(id: string, tarifa: Partial<Tarifa>) {
    try {
      const response = await axios.put(`${API_URL}/api/tarifas/${id}`, tarifa, { headers: await getHeaders("PUT"), withCredentials: true });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.error || 'Error al actualizar tarifa';
      return { success: false, error: errorMessage };
    }
  }

  static async eliminarTarifa(id: string) {
    try {
      const response = await axios.delete(`${API_URL}/api/tarifas/${id}`, { headers: await getHeaders("DELETE"), withCredentials: true });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.error || 'Error al eliminar tarifa';
      return { success: false, error: errorMessage };
    }
  }

  static async calcularConsumo(kwhConsumidos: number, tarifaId: string) {
    try {
      const response = await axios.post(`${API_URL}/api/tarifas/calcular`, { kwhConsumidos, tarifaId }, { headers: await getHeaders("POST"), withCredentials: true });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.error || 'Error al calcular consumo';
      return { success: false, error: errorMessage };
    }
  }

  static async calcularCostoCliente(clienteId: string, kwh: number) {
    try {
      const response = await axios.get(`${API_URL}/api/consumo/cliente/${clienteId}/calcular?kwh=${kwh}`, { headers: await getHeaders(), withCredentials: true });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.error || 'Error al calcular costo';
      return { success: false, error: errorMessage };
    }
  }
}

export default TarifasService;
