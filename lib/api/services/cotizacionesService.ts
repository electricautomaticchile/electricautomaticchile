import { BaseApiService } from "../utils/baseService";
import { ApiResponse, ICotizacion } from "../types";

export class CotizacionesService extends BaseApiService {
  async enviarFormularioContacto(data: {
    nombre: string;
    email: string;
    empresa?: string;
    telefono?: string;
    servicio: string;
    plazo?: string;
    mensaje: string;
    archivoUrl?: string;
    archivo?: string;
    archivoTipo?: string;
  }): Promise<ApiResponse<{ id: string; numero: string; estado: string }>> {
    return this.makeRequest("/formulario/contacto", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async obtenerCotizaciones(params?: {
    page?: number;
    limit?: number;
    estado?: string;
    prioridad?: string;
    servicio?: string;
  }): Promise<ApiResponse<ICotizacion[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/cotizaciones?${queryParams.toString()}`
      : "/cotizaciones";

    return this.makeRequest<ICotizacion[]>(endpoint);
  }

  async obtenerCotizacionesPendientes(): Promise<ApiResponse<ICotizacion[]>> {
    return this.makeRequest<ICotizacion[]>("/cotizaciones/pendientes");
  }

  async obtenerEstadisticasCotizaciones(): Promise<ApiResponse<any>> {
    return this.makeRequest("/cotizaciones/estadisticas");
  }

  async obtenerCotizacion(id: string): Promise<ApiResponse<ICotizacion>> {
    return this.makeRequest<ICotizacion>(`/cotizaciones/${id}`);
  }

  async cambiarEstadoCotizacion(
    id: string,
    estado: string,
    notas?: string
  ): Promise<ApiResponse<ICotizacion>> {
    return this.makeRequest<ICotizacion>(`/cotizaciones/${id}/estado`, {
      method: "PUT",
      body: JSON.stringify({ estado, notas }),
    });
  }

  async agregarCotizacion(
    id: string,
    datosActualizacion: {
      titulo: string;
      descripcion?: string;
      items: Array<{
        descripcion: string;
        cantidad: number;
        precioUnitario: number;
        subtotal: number;
      }>;
      subtotal: number;
      iva: number;
      total: number;
      validezDias?: number;
      condicionesPago?: string;
    }
  ): Promise<ApiResponse<ICotizacion>> {
    return this.makeRequest<ICotizacion>(`/cotizaciones/${id}/cotizar`, {
      method: "PUT",
      body: JSON.stringify(datosActualizacion),
    });
  }

  async convertirCotizacionACliente(
    id: string,
    datos: {
      passwordTemporal?: string;
      planSeleccionado?: string;
      montoMensual?: number;
    }
  ): Promise<ApiResponse<any>> {
    return this.makeRequest(`/cotizaciones/${id}/convertir-cliente`, {
      method: "POST",
      body: JSON.stringify(datos),
    });
  }

  async eliminarCotizacion(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/cotizaciones/${id}`, {
      method: "DELETE",
    });
  }
}

// Exportar instancia única del servicio
export const cotizacionesService = new CotizacionesService();
