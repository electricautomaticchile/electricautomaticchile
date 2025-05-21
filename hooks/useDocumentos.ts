import { useState, useCallback } from 'react';
import axios from 'axios';

// Tipos de documentos
export type TipoDocumento = 
  | 'factura'
  | 'contrato'
  | 'reporte_tecnico'
  | 'manual'
  | 'certificado'
  | 'foto'
  | 'firma'
  | 'plano'
  | 'otro';

// Entidades relacionadas
export type EntidadRelacionada =
  | 'cliente'
  | 'dispositivo'
  | 'servicio'
  | 'medicion'
  | 'usuario'
  | 'proyecto'
  | 'otro';

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
export type EstadoSubida = 'inactivo' | 'subiendo' | 'exito' | 'error';

/**
 * Hook para gestionar documentos
 */
export function useDocumentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [estadoSubida, setEstadoSubida] = useState<EstadoSubida>('inactivo');
  const [totalDocumentos, setTotalDocumentos] = useState(0);
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    totalPaginas: 1,
    limite: 20
  });

  /**
   * Subir un documento
   * @param opciones Opciones para la subida
   * @param headersAdicionales Headers adicionales para la petición
   */
  const subirDocumento = useCallback(async (
    opciones: OpcionesSubida,
    headersAdicionales?: Record<string, string>
  ) => {
    setEstadoSubida('subiendo');
    setProgreso(0);
    setError(null);

    const formData = new FormData();
    formData.append('archivo', opciones.archivo);
    formData.append('tipoDocumento', opciones.tipoDocumento);
    formData.append('entidadRelacionada', opciones.entidadRelacionada);
    formData.append('referenciaId', opciones.referenciaId);
    formData.append('entidadModelo', opciones.entidadModelo);
    
    if (opciones.nombre) formData.append('nombre', opciones.nombre);
    if (opciones.descripcion) formData.append('descripcion', opciones.descripcion);
    if (opciones.esPublico !== undefined) formData.append('esPublico', String(opciones.esPublico));
    if (opciones.etiquetas) {
      if (Array.isArray(opciones.etiquetas)) {
        formData.append('etiquetas', JSON.stringify(opciones.etiquetas));
      } else {
        formData.append('etiquetas', opciones.etiquetas);
      }
    }

    try {
      // Combinar los headers adicionales con los predeterminados
      // NOTA: Remover el Content-Type para que axios configure automáticamente el boundary correcto
      const headers: Record<string, string> = {
        ...(headersAdicionales || {})
      };

      console.log('Iniciando subida de archivo:', opciones.archivo.name, 'tamaño:', opciones.archivo.size);
      
      const response = await axios.post('/api/documentos', formData, {
        headers,
        onUploadProgress: (event) => {
          if (event.total) {
            const porcentaje = Math.round((event.loaded * 100) / event.total);
            setProgreso(porcentaje);
          }
        }
      });

      console.log('Archivo subido correctamente:', response.data);
      setEstadoSubida('exito');
      return response.data.documento;
    } catch (err: any) {
      console.error('Error al subir documento:', err);
      setEstadoSubida('error');
      
      // Mejorar el manejo del error para incluir más detalles
      let mensajeError = 'Error al subir el documento';
      if (err.response?.data?.mensaje) {
        mensajeError = err.response.data.mensaje;
      } else if (err.message) {
        mensajeError = `Error: ${err.message}`;
      }
      
      console.error('Detalles del error:', {
        mensaje: mensajeError,
        status: err.response?.status || 'desconocido',
        statusText: err.response?.statusText || 'desconocido'
      });
      
      setError(mensajeError);
      throw new Error(mensajeError);
    }
  }, []);

  /**
   * Obtener documentos con filtros
   */
  const obtenerDocumentos = useCallback(async (opciones: OpcionesBusqueda = {}) => {
    setCargando(true);
    setError(null);

    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams();
      if (opciones.entidad) params.append('entidad', opciones.entidad);
      if (opciones.referencia) params.append('referencia', opciones.referencia);
      if (opciones.tipo) params.append('tipo', opciones.tipo);
      if (opciones.usuario) params.append('usuario', opciones.usuario);
      if (opciones.pagina) params.append('pagina', opciones.pagina.toString());
      if (opciones.limite) params.append('limite', opciones.limite.toString());
      if (opciones.busqueda) params.append('busqueda', opciones.busqueda);

      const response = await axios.get(`/api/documentos?${params.toString()}`);

      // Si la respuesta tiene formato paginado
      if (response.data.datos && response.data.paginacion) {
        setDocumentos(response.data.datos);
        setTotalDocumentos(response.data.paginacion.total);
        setPaginacion({
          paginaActual: response.data.paginacion.paginaActual,
          totalPaginas: response.data.paginacion.paginas,
          limite: response.data.paginacion.limite
        });
      } else if (response.data.documentos) {
        // Formato simple con lista de documentos
        setDocumentos(response.data.documentos);
        setTotalDocumentos(response.data.total || response.data.documentos.length);
        setPaginacion({
          paginaActual: 1,
          totalPaginas: 1,
          limite: response.data.documentos.length
        });
      }

      setCargando(false);
      return response.data;
    } catch (err: any) {
      setCargando(false);
      const mensajeError = err.response?.data?.mensaje || 'Error al obtener documentos';
      setError(mensajeError);
      throw new Error(mensajeError);
    }
  }, []);

  /**
   * Obtener un documento específico
   */
  const obtenerDocumento = useCallback(async (id: string) => {
    setCargando(true);
    setError(null);

    try {
      const response = await axios.get(`/api/documentos/${id}`);
      setDocumento(response.data);
      setCargando(false);
      return response.data;
    } catch (err: any) {
      setCargando(false);
      const mensajeError = err.response?.data?.mensaje || 'Error al obtener el documento';
      setError(mensajeError);
      throw new Error(mensajeError);
    }
  }, []);

  /**
   * Obtener URL prefirmada para un documento
   */
  const obtenerURLPrefirmada = useCallback(async (id: string, duracionSegundos: number = 3600) => {
    setCargando(true);
    setError(null);

    try {
      const response = await axios.get(`/api/documentos/${id}?firmada=true&duracion=${duracionSegundos}`);
      setCargando(false);
      return response.data.url;
    } catch (err: any) {
      setCargando(false);
      const mensajeError = err.response?.data?.mensaje || 'Error al obtener URL firmada';
      setError(mensajeError);
      throw new Error(mensajeError);
    }
  }, []);

  /**
   * Actualizar metadatos de un documento
   */
  const actualizarDocumento = useCallback(async (
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
      const response = await axios.patch(`/api/documentos/${id}`, datos);
      setDocumento(response.data.documento);
      setCargando(false);
      
      // Actualizar la lista de documentos si tenemos uno con el mismo ID
      setDocumentos(docs => 
        docs.map(doc => doc._id === id ? response.data.documento : doc)
      );
      
      return response.data.documento;
    } catch (err: any) {
      setCargando(false);
      const mensajeError = err.response?.data?.mensaje || 'Error al actualizar el documento';
      setError(mensajeError);
      throw new Error(mensajeError);
    }
  }, []);

  /**
   * Eliminar un documento
   */
  const eliminarDocumento = useCallback(async (id: string) => {
    setCargando(true);
    setError(null);

    try {
      await axios.delete(`/api/documentos/${id}`);
      
      // Eliminar de la lista de documentos
      setDocumentos(docs => docs.filter(doc => doc._id !== id));
      
      // Si el documento actual es el que estamos eliminando, limpiarlo
      if (documento && documento._id === id) {
        setDocumento(null);
      }
      
      setCargando(false);
      return true;
    } catch (err: any) {
      setCargando(false);
      const mensajeError = err.response?.data?.mensaje || 'Error al eliminar el documento';
      setError(mensajeError);
      throw new Error(mensajeError);
    }
  }, [documento]);

  /**
   * Reiniciar el estado de subida
   */
  const reiniciarEstadoSubida = useCallback(() => {
    setEstadoSubida('inactivo');
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
    reiniciarEstadoSubida
  };
}

export default useDocumentos; 