import { useState, useCallback } from "react";

// Tipos de documentos
export type TipoDocumento =
  | "factura"
  | "contrato"
  | "reporte_tecnico"
  | "manual"
  | "certificado"
  | "foto"
  | "firma"
  | "plano"
  | "otro";

// Entidades relacionadas
export type EntidadRelacionada =
  | "cliente"
  | "dispositivo"
  | "servicio"
  | "medicion"
  | "usuario"
  | "proyecto"
  | "otro";

// Documento
export interface Documento {
  _id: string;
  nombre: string;
  descripcion?: string;
  tipoDocumento: TipoDocumento;
  tipoArchivo: string;
  tamaño: number;
  url: string;
  entidadRelacionada: EntidadRelacionada;
  referenciaId: string;
  esPublico: boolean;
  fechaSubida: string;
  fechaExpiracion?: string;
  usuario: {
    _id: string;
    nombre: string;
    email: string;
  };
  etiquetas?: string[];
}

// Opciones para subir documentos
interface OpcionesSubida {
  archivo: File;
  tipoDocumento: TipoDocumento;
  entidadRelacionada: EntidadRelacionada;
  referenciaId: string;
  entidadModelo: string;
  nombre?: string;
  descripcion?: string;
  esPublico?: boolean;
  etiquetas?: string[];
}

// Opciones para buscar documentos
interface OpcionesBusqueda {
  entidad?: EntidadRelacionada;
  referencia?: string;
  tipo?: TipoDocumento;
  usuario?: string;
  pagina?: number;
  limite?: number;
  busqueda?: string;
}

// Estados posibles durante la subida
export type EstadoSubida = "inactivo" | "subiendo" | "exito" | "error";

// Función helper para simular progreso de subida
const simularProgreso = (
  callback: (progreso: number) => void,
  duracion: number = 3000
) => {
  let progreso = 0;
  const incremento = 100 / (duracion / 100);

  const interval = setInterval(() => {
    progreso += incremento;
    if (progreso >= 90) {
      clearInterval(interval);
      callback(90); // Mantenemos en 90% hasta que la subida real termine
    } else {
      callback(Math.round(progreso));
    }
  }, 100);

  return () => clearInterval(interval);
};

// Función helper para hacer peticiones fetch con manejo de errores
const fetchWithErrorHandling = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.mensaje || `Error ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Hook para gestionar documentos
 */
export function useDocumentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [estadoSubida, setEstadoSubida] = useState<EstadoSubida>("inactivo");
  const [totalDocumentos, setTotalDocumentos] = useState(0);
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    totalPaginas: 1,
    limite: 20,
  });

  /**
   * Subir un documento
   * @param opciones Opciones para la subida
   * @param headersAdicionales Headers adicionales para la petición
   */
  const subirDocumento = useCallback(
    async (
      opciones: OpcionesSubida,
      headersAdicionales?: Record<string, string>
    ) => {
      setEstadoSubida("subiendo");
      setProgreso(0);
      setError(null);

      const formData = new FormData();
      formData.append("archivo", opciones.archivo);
      formData.append("tipoDocumento", opciones.tipoDocumento);
      formData.append("entidadRelacionada", opciones.entidadRelacionada);
      formData.append("referenciaId", opciones.referenciaId);
      formData.append("entidadModelo", opciones.entidadModelo);

      if (opciones.nombre) formData.append("nombre", opciones.nombre);
      if (opciones.descripcion)
        formData.append("descripcion", opciones.descripcion);
      if (opciones.esPublico !== undefined)
        formData.append("esPublico", String(opciones.esPublico));
      if (opciones.etiquetas) {
        if (Array.isArray(opciones.etiquetas)) {
          formData.append("etiquetas", JSON.stringify(opciones.etiquetas));
        } else {
          formData.append("etiquetas", opciones.etiquetas);
        }
      }

      // Iniciar simulación de progreso
      const detenerProgreso = simularProgreso(setProgreso);

      try {
        const response = await fetch("/api/documentos", {
          method: "POST",
          headers: {
            // No establecer Content-Type para FormData, fetch lo hace automáticamente
            ...headersAdicionales,
          },
          body: formData,
        });

        detenerProgreso();

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.mensaje || "Error al subir el documento");
        }

        const data = await response.json();
        setProgreso(100);
        setEstadoSubida("exito");
        return data.documento;
      } catch (err: any) {
        detenerProgreso();
        setEstadoSubida("error");
        const mensajeError = err.message || "Error al subir el documento";
        setError(mensajeError);
        throw new Error(mensajeError);
      }
    },
    []
  );

  /**
   * Obtener documentos con filtros
   */
  const obtenerDocumentos = useCallback(
    async (opciones: OpcionesBusqueda = {}) => {
      setCargando(true);
      setError(null);

      try {
        // Construir parámetros de consulta
        const params = new URLSearchParams();
        if (opciones.entidad) params.append("entidad", opciones.entidad);
        if (opciones.referencia)
          params.append("referencia", opciones.referencia);
        if (opciones.tipo) params.append("tipo", opciones.tipo);
        if (opciones.usuario) params.append("usuario", opciones.usuario);
        if (opciones.pagina)
          params.append("pagina", opciones.pagina.toString());
        if (opciones.limite)
          params.append("limite", opciones.limite.toString());
        if (opciones.busqueda) params.append("busqueda", opciones.busqueda);

        const data = await fetchWithErrorHandling(
          `/api/documentos?${params.toString()}`
        );

        // Si la respuesta tiene formato paginado
        if (data.datos && data.paginacion) {
          setDocumentos(data.datos);
          setTotalDocumentos(data.paginacion.total);
          setPaginacion({
            paginaActual: data.paginacion.paginaActual,
            totalPaginas: data.paginacion.paginas,
            limite: data.paginacion.limite,
          });
        } else if (data.documentos) {
          // Formato simple con lista de documentos
          setDocumentos(data.documentos);
          setTotalDocumentos(data.total || data.documentos.length);
          setPaginacion({
            paginaActual: 1,
            totalPaginas: 1,
            limite: data.documentos.length,
          });
        }

        setCargando(false);
        return data;
      } catch (err: any) {
        setCargando(false);
        const mensajeError = err.message || "Error al obtener documentos";
        setError(mensajeError);
        throw new Error(mensajeError);
      }
    },
    []
  );

  /**
   * Obtener un documento específico
   */
  const obtenerDocumento = useCallback(async (id: string) => {
    setCargando(true);
    setError(null);

    try {
      const data = await fetchWithErrorHandling(`/api/documentos/${id}`);
      setDocumento(data);
      setCargando(false);
      return data;
    } catch (err: any) {
      setCargando(false);
      const mensajeError = err.message || "Error al obtener el documento";
      setError(mensajeError);
      throw new Error(mensajeError);
    }
  }, []);

  /**
   * Obtener URL prefirmada para un documento
   */
  const obtenerURLPrefirmada = useCallback(
    async (id: string, duracionSegundos: number = 3600) => {
      setCargando(true);
      setError(null);

      try {
        const data = await fetchWithErrorHandling(
          `/api/documentos/${id}?firmada=true&duracion=${duracionSegundos}`
        );
        setCargando(false);
        return data.url;
      } catch (err: any) {
        setCargando(false);
        const mensajeError = err.message || "Error al obtener URL firmada";
        setError(mensajeError);
        throw new Error(mensajeError);
      }
    },
    []
  );

  /**
   * Actualizar metadatos de un documento
   */
  const actualizarDocumento = useCallback(
    async (
      id: string,
      datos: {
        nombre?: string;
        descripcion?: string;
        tipoDocumento?: TipoDocumento;
        esPublico?: boolean;
        fechaExpiracion?: Date | null;
        etiquetas?: string[];
      }
    ) => {
      setCargando(true);
      setError(null);

      try {
        const data = await fetchWithErrorHandling(`/api/documentos/${id}`, {
          method: "PATCH",
          body: JSON.stringify(datos),
        });

        setDocumento(data.documento);
        setCargando(false);

        // Actualizar la lista de documentos si tenemos uno con el mismo ID
        setDocumentos((docs) =>
          docs.map((doc) => (doc._id === id ? data.documento : doc))
        );

        return data.documento;
      } catch (err: any) {
        setCargando(false);
        const mensajeError = err.message || "Error al actualizar el documento";
        setError(mensajeError);
        throw new Error(mensajeError);
      }
    },
    []
  );

  /**
   * Eliminar un documento
   */
  const eliminarDocumento = useCallback(
    async (id: string) => {
      setCargando(true);
      setError(null);

      try {
        const response = await fetch(`/api/documentos/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.mensaje || "Error al eliminar el documento"
          );
        }

        // Eliminar de la lista de documentos
        setDocumentos((docs) => docs.filter((doc) => doc._id !== id));

        // Si el documento actual es el que estamos eliminando, limpiarlo
        if (documento && documento._id === id) {
          setDocumento(null);
        }

        setCargando(false);
        return true;
      } catch (err: any) {
        setCargando(false);
        const mensajeError = err.message || "Error al eliminar el documento";
        setError(mensajeError);
        throw new Error(mensajeError);
      }
    },
    [documento]
  );

  /**
   * Reiniciar el estado de subida
   */
  const reiniciarEstadoSubida = useCallback(() => {
    setEstadoSubida("inactivo");
    setProgreso(0);
    setError(null);
  }, []);

  return {
    // Estado
    documentos,
    documento,
    cargando,
    error,
    progreso,
    estadoSubida,
    totalDocumentos,
    paginacion,

    // Métodos
    subirDocumento,
    obtenerDocumentos,
    obtenerDocumento,
    obtenerURLPrefirmada,
    actualizarDocumento,
    eliminarDocumento,
    reiniciarEstadoSubida,
  };
}

export default useDocumentos;
