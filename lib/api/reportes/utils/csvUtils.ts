import { ICSVColumn } from "../types";
import { CSV_CONFIG, FORMATTERS, DEBUG_CONFIG } from "../config";

// Utilidad para manejo de exportación CSV local
export class CSVUtils {
  // Exportar datos locales a CSV
  static exportarCSVLocal(
    datos: any[],
    columnas: ICSVColumn[],
    nombreArchivo: string,
    opciones?: {
      separador?: string;
      encoding?: string;
      incluirHeaders?: boolean;
    }
  ): void {
    try {
      const config = {
        separador: opciones?.separador || CSV_CONFIG.separator,
        encoding: opciones?.encoding || CSV_CONFIG.encoding,
        incluirHeaders: opciones?.incluirHeaders ?? CSV_CONFIG.includeHeaders,
      };

      if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.logRequests) {
        console.log("📊 [CSV] Exportando datos locales:", {
          nombreArchivo,
          registros: datos.length,
          columnas: columnas.length,
          config,
        });
      }

      // Crear headers del CSV
      const headers = columnas.map((col) => col.header || col.key);

      // Crear filas de datos
      const filas = datos.map((fila) => {
        return columnas.map((col) => {
          let valor = fila[col.key];

          // Aplicar formatter personalizado si existe
          if (col.formatter) {
            valor = col.formatter(valor);
          } else {
            // Aplicar formatters por tipo
            valor = this.formatearValor(valor, col.type);
          }

          // Escapar para CSV
          return this.escaparValorCSV(valor, config.separador);
        });
      });

      // Construir contenido CSV
      const csvContent = [
        ...(config.incluirHeaders ? [headers.join(config.separador)] : []),
        ...filas.map((fila) => fila.join(config.separador)),
      ].join("\n");

      // Crear blob y descargar
      const blob = new Blob([csvContent], {
        type: `text/csv;charset=${config.encoding};`,
      });

      const nombreFinal = this.generarNombreArchivo(nombreArchivo);
      this.descargarBlob(blob, nombreFinal);

      if (DEBUG_CONFIG.enabled) {
        console.log("✅ [CSV] Exportación completada:", {
          nombreArchivo: nombreFinal,
          tamaño: `${(blob.size / 1024).toFixed(2)}KB`,
          registros: datos.length,
        });
      }
    } catch (error) {
      if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.logErrors) {
        console.error("❌ [CSV] Error exportando CSV local:", error);
      }
      throw new Error("Error al exportar CSV");
    }
  }

  // Formatear valor según tipo
  private static formatearValor(valor: any, tipo?: string): string {
    if (valor === null || valor === undefined) return "";

    switch (tipo) {
      case "date":
        return FORMATTERS.date(valor);
      case "currency":
        return FORMATTERS.currency(valor);
      case "number":
        return FORMATTERS.number(valor);
      case "boolean":
        return FORMATTERS.boolean(valor);
      case "string":
      default:
        return FORMATTERS.string(valor);
    }
  }

  // Escapar valor para CSV
  private static escaparValorCSV(valor: string, separador: string): string {
    if (!valor) return "";

    const valorStr = valor.toString();

    // Escapar comillas dobles
    let escaped = valorStr.replace(/"/g, '""');

    // Envolver en comillas si contiene separador, salto de línea o comillas
    if (
      escaped.includes(separador) ||
      escaped.includes("\n") ||
      escaped.includes("\r") ||
      escaped.includes('"')
    ) {
      escaped = `"${escaped}"`;
    }

    return escaped;
  }

  // Generar nombre de archivo con timestamp
  private static generarNombreArchivo(nombreBase: string): string {
    const timestamp = new Date().toISOString().split("T")[0];
    const extension = nombreBase.endsWith(".csv") ? "" : ".csv";
    return `${nombreBase}_${timestamp}${extension}`;
  }

  // Descargar blob como archivo
  private static descargarBlob(blob: Blob, nombreArchivo: string): void {
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // Validar datos antes de exportar
  static validarDatos(
    datos: any[],
    columnas: ICSVColumn[]
  ): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar que hay datos
    if (!datos || datos.length === 0) {
      errors.push("No hay datos para exportar");
    }

    // Validar que hay columnas
    if (!columnas || columnas.length === 0) {
      errors.push("No se han definido columnas para la exportación");
    }

    // Validar columnas
    if (columnas) {
      columnas.forEach((col, index) => {
        if (!col.key) {
          errors.push(`Columna ${index + 1}: key es requerido`);
        }
      });
    }

    // Validar consistencia de datos
    if (datos && datos.length > 0 && columnas) {
      const primeraFila = datos[0];
      const columnasEncontradas = Object.keys(primeraFila);
      const columnasDefinidas = columnas.map((col) => col.key);

      const columnasFaltantes = columnasDefinidas.filter(
        (col) => !columnasEncontradas.includes(col)
      );

      if (columnasFaltantes.length > 0) {
        warnings.push(
          `Columnas no encontradas en datos: ${columnasFaltantes.join(", ")}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Convertir array de objetos a formato CSV en memoria (sin descarga)
  static objetosACSV(
    datos: any[],
    columnas: ICSVColumn[],
    opciones?: {
      separador?: string;
      incluirHeaders?: boolean;
    }
  ): string {
    const config = {
      separador: opciones?.separador || CSV_CONFIG.separator,
      incluirHeaders: opciones?.incluirHeaders ?? CSV_CONFIG.includeHeaders,
    };

    // Crear headers
    const headers = columnas.map((col) => col.header || col.key);

    // Crear filas
    const filas = datos.map((fila) => {
      return columnas.map((col) => {
        let valor = fila[col.key];

        if (col.formatter) {
          valor = col.formatter(valor);
        } else {
          valor = this.formatearValor(valor, col.type);
        }

        return this.escaparValorCSV(valor, config.separador);
      });
    });

    // Construir contenido
    const lineas = [
      ...(config.incluirHeaders ? [headers.join(config.separador)] : []),
      ...filas.map((fila) => fila.join(config.separador)),
    ];

    return lineas.join("\n");
  }

  // Previsualizar CSV (primeras N filas)
  static previsualizarCSV(
    datos: any[],
    columnas: ICSVColumn[],
    maxFilas: number = 5
  ): {
    headers: string[];
    filas: string[][];
    totalRegistros: number;
    tamañoEstimado: string;
  } {
    const headers = columnas.map((col) => col.header || col.key);
    const datosLimitados = datos.slice(0, maxFilas);

    const filas = datosLimitados.map((fila) => {
      return columnas.map((col) => {
        let valor = fila[col.key];

        if (col.formatter) {
          valor = col.formatter(valor);
        } else {
          valor = this.formatearValor(valor, col.type);
        }

        return valor;
      });
    });

    // Estimar tamaño
    const csvCompleto = this.objetosACSV(datos, columnas);
    const tamañoBytes = new Blob([csvCompleto]).size;
    const tamañoEstimado =
      tamañoBytes < 1024
        ? `${tamañoBytes} bytes`
        : tamañoBytes < 1024 * 1024
          ? `${(tamañoBytes / 1024).toFixed(2)} KB`
          : `${(tamañoBytes / (1024 * 1024)).toFixed(2)} MB`;

    return {
      headers,
      filas,
      totalRegistros: datos.length,
      tamañoEstimado,
    };
  }
}
