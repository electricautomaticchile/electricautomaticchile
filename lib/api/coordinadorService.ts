interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface DemandaSistema {
  fecha: string;
  hora: number;
  demanda: number;
}

interface GeneracionCentral {
  id_central: string;
  fecha: string;
  hora: number;
  generacion: number;
  energia_ernc: number;
  tipo_central: string;
}

interface CostoMarginal {
  barra_mnemotecnico: string;
  barra_referencia_mnemotecnico: string;
  fecha: string;
  hora: number;
  costo_en_dolares: number;
  costo_en_pesos: number;
}

interface EnergiaCentral {
  empresa_mnemotecnico: string;
  fecha: string;
  hora: number;
  generacion: number;
  tipo_central: string;
  nombre_empresa: string;
}

interface EmbalseDatos {
  nombre_embalse: string;
  fecha: string;
  hora: number;
  cota: number;
  afluente_diario: number;
}

class CoordinadorElectricoService {
  private baseUrl = "/api/coordinador-electrico";

  private async fetchData<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}`, window.location.origin);
    url.searchParams.set("endpoint", endpoint);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // Cache por 5 minutos para datos en tiempo real
      cache: "default",
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching data: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // Obtener demanda del sistema real (última fecha disponible)
  async getDemandaSistemaReal(fecha?: string): Promise<DemandaSistema[]> {
    const fechaConsulta = fecha || this.getYesterdayDate();
    const response = await this.fetchData<DemandaSistema>(
      "demanda_sistema_real",
      {
        fecha: fechaConsulta,
        limit: "24", // Obtener las 24 horas del día
      }
    );
    return response.results;
  }

  // Obtener generación por centrales (datos agregados del día anterior)
  async getGeneracionCentrales(fecha?: string): Promise<GeneracionCentral[]> {
    const fechaConsulta = fecha || this.getYesterdayDate();
    const response = await this.fetchData<GeneracionCentral>(
      "generacion_centrales",
      {
        fecha: fechaConsulta,
        limit: "100",
      }
    );
    return response.results;
  }

  // Obtener costos marginales reales
  async getCostosMarginaless(fecha?: string): Promise<CostoMarginal[]> {
    const fechaConsulta = fecha || this.getYesterdayDate();
    const response = await this.fetchData<CostoMarginal>(
      "costos_marginales_reales",
      {
        fecha: fechaConsulta,
        limit: "50",
      }
    );
    return response.results;
  }

  // Obtener generación programada (incluye ERNC)
  async getGeneracionProgramada(fecha?: string): Promise<EnergiaCentral[]> {
    const fechaConsulta = fecha || this.getYesterdayDate();
    const response = await this.fetchData<EnergiaCentral>(
      "generacion_programada",
      {
        fecha: fechaConsulta,
        limit: "100",
      }
    );
    return response.results;
  }

  // Obtener datos de embalses
  async getEmbalseDatos(fecha?: string): Promise<EmbalseDatos[]> {
    const fechaConsulta = fecha || this.getYesterdayDate();
    const response = await this.fetchData<EmbalseDatos>("cotas_embalses", {
      fecha: fechaConsulta,
      limit: "50",
    });
    return response.results;
  }

  // Método para obtener resumen de datos del sistema eléctrico
  async getResumenSistema(fecha?: string) {
    try {
      const [demanda, generacion, costos, programada, embalses] =
        await Promise.all([
          this.getDemandaSistemaReal(fecha),
          this.getGeneracionCentrales(fecha),
          this.getCostosMarginaless(fecha),
          this.getGeneracionProgramada(fecha),
          this.getEmbalseDatos(fecha),
        ]);

      // Procesamos los datos para obtener métricas resumidas
      const demandaTotal = demanda.reduce((sum, item) => sum + item.demanda, 0);
      const demandaPromedio = demandaTotal / demanda.length;
      const demandaMax = Math.max(...demanda.map((item) => item.demanda));

      const generacionTotal = generacion.reduce(
        (sum, item) => sum + item.generacion,
        0
      );
      const generacionERNC = generacion.reduce(
        (sum, item) => sum + item.energia_ernc,
        0
      );
      const porcentajeERNC =
        generacionTotal > 0 ? (generacionERNC / generacionTotal) * 100 : 0;

      const costoPromedio =
        costos.length > 0
          ? costos.reduce((sum, item) => sum + item.costo_en_dolares, 0) /
            costos.length
          : 0;

      const cotaPromedio =
        embalses.length > 0
          ? embalses.reduce((sum, item) => sum + item.cota, 0) / embalses.length
          : 0;

      return {
        demanda: {
          promedio: Math.round(demandaPromedio),
          maximo: Math.round(demandaMax),
          total: Math.round(demandaTotal),
        },
        generacion: {
          total: Math.round(generacionTotal),
          ernc: Math.round(generacionERNC),
          porcentajeERNC: Math.round(porcentajeERNC * 10) / 10,
        },
        costoMarginal: {
          promedio: Math.round(costoPromedio * 100) / 100,
        },
        embalses: {
          cotaPromedio: Math.round(cotaPromedio * 100) / 100,
          cantidad: embalses.length,
        },
        fecha: fecha || this.getYesterdayDate(),
      };
    } catch (error) {
      console.error("Error fetching sistema resumen:", error);
      throw error;
    }
  }

  private getYesterdayDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }

  private getTodayDate(): string {
    return new Date().toISOString().split("T")[0];
  }
}

export default CoordinadorElectricoService;
export type {
  DemandaSistema,
  GeneracionCentral,
  CostoMarginal,
  EnergiaCentral,
  EmbalseDatos,
};
