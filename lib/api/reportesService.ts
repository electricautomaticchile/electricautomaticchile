import { apiService } from "./apiService";

export interface IFiltrosReporte {
  activo?: boolean;
  tipoCliente?: string;
  ciudad?: string;
  estado?: string;
  region?: string;
  servicio?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface IConfigReporte {
  titulo: string;
  tipo: "clientes" | "empresas" | "cotizaciones" | "dispositivos";
  formato: "excel" | "csv";
  filtros?: IFiltrosReporte;
  empresaId?: string;
}

class ReportesService {
  // Descargar reporte de clientes
  async descargarReporteClientes(config: IConfigReporte): Promise<void> {
    try {
      console.log("📊 Descargando reporte de clientes:", config);

      const params = new URLSearchParams();
      if (config.formato) params.append("formato", config.formato);
      if (config.empresaId) params.append("empresaId", config.empresaId);
      if (config.filtros)
        params.append("filtros", JSON.stringify(config.filtros));

      const url = `/api/reportes/clientes?${params.toString()}`;

      await this.descargarArchivo(
        url,
        `reporte_clientes_${new Date().toISOString().split("T")[0]}.${config.formato === "excel" ? "xlsx" : "csv"}`
      );
    } catch (error) {
      console.error("❌ Error descargando reporte de clientes:", error);
      throw new Error("Error al descargar reporte de clientes");
    }
  }

  // Descargar reporte de empresas
  async descargarReporteEmpresas(config: IConfigReporte): Promise<void> {
    try {
      console.log("📊 Descargando reporte de empresas:", config);

      const params = new URLSearchParams();
      if (config.formato) params.append("formato", config.formato);
      if (config.filtros)
        params.append("filtros", JSON.stringify(config.filtros));

      const url = `/api/reportes/empresas?${params.toString()}`;

      await this.descargarArchivo(
        url,
        `reporte_empresas_${new Date().toISOString().split("T")[0]}.${config.formato === "excel" ? "xlsx" : "csv"}`
      );
    } catch (error) {
      console.error("❌ Error descargando reporte de empresas:", error);
      throw new Error("Error al descargar reporte de empresas");
    }
  }

  // Descargar reporte de cotizaciones
  async descargarReporteCotizaciones(config: IConfigReporte): Promise<void> {
    try {
      console.log("📊 Descargando reporte de cotizaciones:", config);

      const params = new URLSearchParams();
      if (config.formato) params.append("formato", config.formato);
      if (config.filtros)
        params.append("filtros", JSON.stringify(config.filtros));

      const url = `/api/reportes/cotizaciones?${params.toString()}`;

      await this.descargarArchivo(
        url,
        `reporte_cotizaciones_${new Date().toISOString().split("T")[0]}.${config.formato === "excel" ? "xlsx" : "csv"}`
      );
    } catch (error) {
      console.error("❌ Error descargando reporte de cotizaciones:", error);
      throw new Error("Error al descargar reporte de cotizaciones");
    }
  }

  // Método privado para manejar la descarga de archivos
  private async descargarArchivo(
    url: string,
    nombreArchivo: string
  ): Promise<void> {
    try {
      const token =
        localStorage.getItem("token") ||
        document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${url}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Crear blob con la respuesta
      const blob = await response.blob();

      // Crear URL para descarga
      const urlDescarga = window.URL.createObjectURL(blob);

      // Crear elemento <a> temporal para descarga
      const link = document.createElement("a");
      link.href = urlDescarga;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlDescarga);

      console.log("✅ Archivo descargado exitosamente:", nombreArchivo);
    } catch (error) {
      console.error("❌ Error en descarga de archivo:", error);
      throw error;
    }
  }

  // Exportar datos locales a CSV (para cuando no hay backend)
  exportarCSVLocal(datos: any[], columnas: any[], nombreArchivo: string): void {
    try {
      // Crear headers del CSV
      const headers = columnas.map((col) => col.header || col.key);

      // Crear filas de datos
      const filas = datos.map((fila) => {
        return columnas.map((col) => {
          let valor = fila[col.key];

          // Formatear según tipo
          if (col.type === "date" && valor) {
            valor = new Date(valor).toLocaleDateString("es-CL");
          } else if (col.type === "currency" && typeof valor === "number") {
            valor = new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
            }).format(valor);
          } else if (col.type === "number" && typeof valor === "number") {
            valor = new Intl.NumberFormat("es-CL").format(valor);
          }

          // Escapar comillas y saltos de línea para CSV
          if (typeof valor === "string") {
            valor = valor.replace(/"/g, '""');
            if (
              valor.includes(",") ||
              valor.includes("\n") ||
              valor.includes('"')
            ) {
              valor = `"${valor}"`;
            }
          }

          return valor || "";
        });
      });

      // Construir contenido CSV
      const csvContent = [
        headers.join(","),
        ...filas.map((fila) => fila.join(",")),
      ].join("\n");

      // Crear blob y descargar
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${nombreArchivo}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      console.log("✅ CSV local exportado:", nombreArchivo);
    } catch (error) {
      console.error("❌ Error exportando CSV local:", error);
      throw new Error("Error al exportar CSV");
    }
  }

  // Generar reporte completo con configuración avanzada
  async generarReporteCompleto(config: IConfigReporte): Promise<void> {
    try {
      switch (config.tipo) {
        case "clientes":
          await this.descargarReporteClientes(config);
          break;
        case "empresas":
          await this.descargarReporteEmpresas(config);
          break;
        case "cotizaciones":
          await this.descargarReporteCotizaciones(config);
          break;
        default:
          throw new Error(`Tipo de reporte no soportado: ${config.tipo}`);
      }
    } catch (error) {
      console.error("❌ Error generando reporte completo:", error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const reportesService = new ReportesService();
