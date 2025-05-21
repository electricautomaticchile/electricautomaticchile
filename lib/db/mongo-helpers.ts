import mongoose from 'mongoose';
import dbConnection from './mongoose-connect';

/**
 * Colección de funciones auxiliares para trabajar con MongoDB
 */

// Función para conectar a la base de datos
export async function conectarDB() {
  try {
    return await dbConnection.connect();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error;
  }
}

// Obtener el estado actual de la conexión
export function obtenerEstadoConexion() {
  return dbConnection.getStatus();
}

// Función para convertir un ID de string a ObjectId
export function convertirAObjectId(id: string): mongoose.Types.ObjectId {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    throw new Error(`ID inválido: ${id}`);
  }
}

// Función para validar si un ID es válido
export function esIdValido(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

// Función genérica para buscar documentos con paginación
export async function buscarConPaginacion<T>(
  modelo: mongoose.Model<T>,
  filtro: any = {},
  opciones: {
    ordenarPor?: string;
    direccion?: 'asc' | 'desc';
    pagina?: number;
    limite?: number;
    populate?: string | string[];
    campos?: string;
  } = {}
) {
  try {
    const {
      ordenarPor = 'createdAt',
      direccion = 'desc',
      pagina = 1,
      limite = 10,
      populate,
      campos
    } = opciones;

    // Calcular el salto para la paginación
    const salto = (pagina - 1) * limite;

    // Orden para la consulta
    const orden: any = {};
    orden[ordenarPor] = direccion === 'desc' ? -1 : 1;

    // Crear la consulta base
    let query = modelo.find(filtro)
      .sort(orden)
      .skip(salto)
      .limit(limite);

    // Aplicar populate si se especifica
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach(campo => {
          query = query.populate(campo);
        });
      } else {
        query = query.populate(populate);
      }
    }

    // Seleccionar campos específicos si se especifican
    if (campos) {
      query = query.select(campos);
    }

    // Ejecutar la consulta
    const resultados = await query.exec();

    // Contar el total de documentos para la paginación
    const totalDocumentos = await modelo.countDocuments(filtro);
    const totalPaginas = Math.ceil(totalDocumentos / limite);

    return {
      datos: resultados,
      paginacion: {
        total: totalDocumentos,
        paginas: totalPaginas,
        paginaActual: pagina,
        limite
      }
    };
  } catch (error) {
    console.error('Error al buscar con paginación:', error);
    throw error;
  }
}

// Función para crear un índice compuesto
export async function crearIndiceCompuesto(
  nombreModelo: string,
  campos: { [key: string]: 1 | -1 },
  opciones: mongoose.mongo.CreateIndexesOptions = {}
) {
  try {
    await conectarDB();
    const modelo = mongoose.model(nombreModelo);
    await modelo.collection.createIndex(campos, opciones);
    console.log(`Índice creado en ${nombreModelo}:`, campos);
  } catch (error) {
    console.error(`Error al crear índice en ${nombreModelo}:`, error);
    throw error;
  }
}

// Función para crear un TTL (Time-To-Live) índice
export async function crearIndiceTTL(
  nombreModelo: string,
  campo: string,
  segundos: number
) {
  try {
    await conectarDB();
    const modelo = mongoose.model(nombreModelo);
    await modelo.collection.createIndex(
      { [campo]: 1 },
      { expireAfterSeconds: segundos } as mongoose.mongo.CreateIndexesOptions
    );
    console.log(`Índice TTL creado en ${nombreModelo}.${campo} (${segundos} segundos)`);
  } catch (error) {
    console.error(`Error al crear índice TTL en ${nombreModelo}:`, error);
    throw error;
  }
}

// Función para realizar operaciones de agregación
export async function realizarAgregacion<T>(
  modelo: mongoose.Model<T>,
  pipeline: any[]
) {
  try {
    return await modelo.aggregate(pipeline).exec();
  } catch (error) {
    console.error('Error al realizar la agregación:', error);
    throw error;
  }
}

// Función para sanitizar datos de entrada (protección contra inyección NoSQL)
export function sanitizarConsulta(consulta: Record<string, any>): Record<string, any> {
  const consultaSanitizada: Record<string, any> = {};
  
  for (const [clave, valor] of Object.entries(consulta)) {
    // Procesar solo si el valor no es undefined
    if (valor !== undefined) {
      if (typeof valor === 'object' && valor !== null && !Array.isArray(valor)) {
        // Si es un objeto anidado, aplicar recursivamente
        consultaSanitizada[clave] = sanitizarConsulta(valor);
      } else if (typeof valor === 'string' && clave !== '_id' && !clave.endsWith('Id')) {
        // Escapar caracteres especiales en strings (excepto para IDs)
        consultaSanitizada[clave] = valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      } else {
        // Otros tipos de datos se pasan sin cambios
        consultaSanitizada[clave] = valor;
      }
    }
  }
  
  return consultaSanitizada;
}

// Función para ejecutar una transacción MongoDB
export async function ejecutarTransaccion<T>(
  callback: (sesion: mongoose.ClientSession) => Promise<T>
): Promise<T> {
  await conectarDB();
  const sesion = await mongoose.startSession();
  sesion.startTransaction();
  
  try {
    const resultado = await callback(sesion);
    await sesion.commitTransaction();
    return resultado;
  } catch (error) {
    await sesion.abortTransaction();
    throw error;
  } finally {
    sesion.endSession();
  }
}

// Sistema de caché en memoria para consultas frecuentes (implementación simple)
const cacheDb: Record<string, { datos: any; timestamp: number; expira: number }> = {};

// Función para obtener o establecer datos en caché
export async function obtenerConCache<T>(
  clave: string,
  fnConsulta: () => Promise<T>,
  tiempoExpiracion: number = 60000 // 1 minuto por defecto
): Promise<T> {
  const ahora = Date.now();
  
  // Si existe en caché y no ha expirado
  if (cacheDb[clave] && (ahora - cacheDb[clave].timestamp) < cacheDb[clave].expira) {
    return cacheDb[clave].datos as T;
  }
  
  // Ejecutar la consulta
  const datos = await fnConsulta();
  
  // Guardar en caché
  cacheDb[clave] = {
    datos,
    timestamp: ahora,
    expira: tiempoExpiracion
  };
  
  return datos;
}

// Limpiar una entrada específica de caché
export function limpiarCache(clave: string): void {
  if (cacheDb[clave]) {
    delete cacheDb[clave];
  }
}

// Limpiar todo el caché
export function limpiarTodoCache(): void {
  for (const clave in cacheDb) {
    delete cacheDb[clave];
  }
}

// Función para monitorear el rendimiento de una consulta
export async function monitorearConsulta<T>(
  nombre: string,
  fnConsulta: () => Promise<T>
): Promise<T> {
  console.time(`Consulta: ${nombre}`);
  try {
    return await fnConsulta();
  } finally {
    console.timeEnd(`Consulta: ${nombre}`);
  }
} 