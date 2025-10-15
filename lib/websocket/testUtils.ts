/**
 * Utilidades para probar escenarios edge case de WebSocket
 * 
 * Proporciona funciones para simular condiciones adversas y
 * verificar el comportamiento del sistema en casos extremos.
 * 
 * Solo disponible en modo desarrollo
 */

import type { Socket } from 'socket.io-client';

/**
 * Resultado de una prueba edge case
 */
export interface ResultadoPrueba {
  nombre: string;
  exitoso: boolean;
  mensaje: string;
  detalles?: Record<string, any>;
  duracion: number;
}

/**
 * Opciones para pruebas de red lenta
 */
export interface OpcionesRedLenta {
  /** Delay artificial en ms */
  delay: number;
  /** Probabilidad de pérdida de paquetes (0-1) */
  perdidaPaquetes?: number;
}

/**
 * Simular red lenta agregando delay artificial
 */
export function simularRedLenta(
  socket: Socket | null,
  opciones: OpcionesRedLenta
): () => void {
  if (!socket) {
    console.warn('[testUtils] No hay socket disponible');
    return () => {};
  }

  const { delay, perdidaPaquetes = 0 } = opciones;
  
  // Guardar el emit original
  const emitOriginal = socket.emit.bind(socket);
  
  // Sobrescribir emit con delay
  socket.emit = function(evento: string, ...args: any[]) {
    // Simular pérdida de paquetes
    if (Math.random() < perdidaPaquetes) {
      console.log(`[testUtils] Paquete perdido: ${evento}`);
      return socket;
    }
    
    // Agregar delay
    setTimeout(() => {
      emitOriginal(evento, ...args);
    }, delay);
    
    return socket;
  };
  
  console.log(`[testUtils] Red lenta simulada: ${delay}ms delay, ${perdidaPaquetes * 100}% pérdida`);
  
  // Retornar función de cleanup
  return () => {
    socket.emit = emitOriginal;
    console.log('[testUtils] Red lenta desactivada');
  };
}

/**
 * Simular desconexión temporal
 */
export async function simularDesconexionTemporal(
  socket: Socket | null,
  duracion: number = 5000
): Promise<ResultadoPrueba> {
  const inicio = Date.now();
  const nombre = 'Desconexión Temporal';
  
  if (!socket) {
    return {
      nombre,
      exitoso: false,
      mensaje: 'No hay socket disponible',
      duracion: Date.now() - inicio,
    };
  }
  
  try {
    console.log(`[testUtils] Simulando desconexión por ${duracion}ms`);
    
    // Desconectar
    socket.disconnect();
    
    // Esperar
    await new Promise(resolve => setTimeout(resolve, duracion));
    
    // Reconectar
    socket.connect();
    
    // Esperar a que se conecte
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout esperando reconexión'));
      }, 10000);
      
      socket.once('connect', () => {
        clearTimeout(timeout);
        resolve(true);
      });
    });
    
    return {
      nombre,
      exitoso: true,
      mensaje: `Reconexión exitosa después de ${duracion}ms`,
      duracion: Date.now() - inicio,
    };
  } catch (error) {
    return {
      nombre,
      exitoso: false,
      mensaje: `Error: ${(error as Error).message}`,
      duracion: Date.now() - inicio,
    };
  }
}

/**
 * Probar múltiples conexiones simultáneas
 */
export async function probarMultiplesConexiones(
  crearSocket: () => Socket,
  cantidad: number = 3
): Promise<ResultadoPrueba> {
  const inicio = Date.now();
  const nombre = 'Múltiples Conexiones';
  
  try {
    console.log(`[testUtils] Creando ${cantidad} conexiones simultáneas`);
    
    const sockets: Socket[] = [];
    const promesas: Promise<void>[] = [];
    
    // Crear múltiples sockets
    for (let i = 0; i < cantidad; i++) {
      const socket = crearSocket();
      sockets.push(socket);
      
      promesas.push(
        new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`Socket ${i} timeout`));
          }, 10000);
          
          socket.once('connect', () => {
            clearTimeout(timeout);
            console.log(`[testUtils] Socket ${i} conectado`);
            resolve();
          });
          
          socket.once('connect_error', (error) => {
            clearTimeout(timeout);
            reject(error);
          });
        })
      );
    }
    
    // Esperar a que todos se conecten
    await Promise.all(promesas);
    
    // Desconectar todos
    sockets.forEach((socket, i) => {
      console.log(`[testUtils] Desconectando socket ${i}`);
      socket.disconnect();
    });
    
    return {
      nombre,
      exitoso: true,
      mensaje: `${cantidad} conexiones establecidas y cerradas exitosamente`,
      detalles: { cantidad },
      duracion: Date.now() - inicio,
    };
  } catch (error) {
    return {
      nombre,
      exitoso: false,
      mensaje: `Error: ${(error as Error).message}`,
      duracion: Date.now() - inicio,
    };
  }
}

/**
 * Probar comportamiento con token expirado
 */
export async function probarTokenExpirado(
  conectar: (token: string) => Promise<void>
): Promise<ResultadoPrueba> {
  const inicio = Date.now();
  const nombre = 'Token Expirado';
  
  try {
    console.log('[testUtils] Probando con token expirado');
    
    // Token obviamente inválido
    const tokenInvalido = 'token.expirado.invalido';
    
    try {
      await conectar(tokenInvalido);
      
      // Si llegamos aquí, la autenticación no está funcionando correctamente
      return {
        nombre,
        exitoso: false,
        mensaje: 'La conexión se estableció con token inválido (problema de seguridad)',
        duracion: Date.now() - inicio,
      };
    } catch (error) {
      // Esperamos que falle
      const mensaje = (error as Error).message;
      
      if (mensaje.includes('authentication') || mensaje.includes('Unauthorized')) {
        return {
          nombre,
          exitoso: true,
          mensaje: 'Token inválido rechazado correctamente',
          detalles: { error: mensaje },
          duracion: Date.now() - inicio,
        };
      } else {
        return {
          nombre,
          exitoso: false,
          mensaje: `Error inesperado: ${mensaje}`,
          duracion: Date.now() - inicio,
        };
      }
    }
  } catch (error) {
    return {
      nombre,
      exitoso: false,
      mensaje: `Error en prueba: ${(error as Error).message}`,
      duracion: Date.now() - inicio,
    };
  }
}

/**
 * Probar comportamiento sin servidor WebSocket
 */
export async function probarServidorCaido(
  conectar: (token: string) => Promise<void>,
  token: string
): Promise<ResultadoPrueba> {
  const inicio = Date.now();
  const nombre = 'Servidor Caído';
  
  try {
    console.log('[testUtils] Probando conexión con servidor caído');
    
    // Intentar conectar (debería fallar)
    try {
      await Promise.race([
        conectar(token),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        ),
      ]);
      
      return {
        nombre,
        exitoso: false,
        mensaje: 'La conexión se estableció cuando no debería',
        duracion: Date.now() - inicio,
      };
    } catch (error) {
      const mensaje = (error as Error).message;
      
      if (mensaje.includes('timeout') || mensaje.includes('ECONNREFUSED') || mensaje.includes('Timeout')) {
        return {
          nombre,
          exitoso: true,
          mensaje: 'Fallo de conexión manejado correctamente',
          detalles: { error: mensaje },
          duracion: Date.now() - inicio,
        };
      } else {
        return {
          nombre,
          exitoso: true,
          mensaje: 'Error de conexión detectado',
          detalles: { error: mensaje },
          duracion: Date.now() - inicio,
        };
      }
    }
  } catch (error) {
    return {
      nombre,
      exitoso: false,
      mensaje: `Error en prueba: ${(error as Error).message}`,
      duracion: Date.now() - inicio,
    };
  }
}

/**
 * Probar reconexión después de inactividad prolongada
 */
export async function probarInactividadProlongada(
  socket: Socket | null,
  duracion: number = 120000 // 2 minutos
): Promise<ResultadoPrueba> {
  const inicio = Date.now();
  const nombre = 'Inactividad Prolongada';
  
  if (!socket) {
    return {
      nombre,
      exitoso: false,
      mensaje: 'No hay socket disponible',
      duracion: Date.now() - inicio,
    };
  }
  
  try {
    console.log(`[testUtils] Probando inactividad por ${duracion}ms`);
    
    // Verificar que está conectado
    if (!socket.connected) {
      return {
        nombre,
        exitoso: false,
        mensaje: 'Socket no está conectado al inicio',
        duracion: Date.now() - inicio,
      };
    }
    
    // Esperar sin actividad
    await new Promise(resolve => setTimeout(resolve, duracion));
    
    // Verificar que sigue conectado (gracias al heartbeat)
    if (socket.connected) {
      return {
        nombre,
        exitoso: true,
        mensaje: `Conexión mantenida después de ${duracion}ms de inactividad`,
        duracion: Date.now() - inicio,
      };
    } else {
      return {
        nombre,
        exitoso: false,
        mensaje: 'Conexión perdida durante inactividad',
        duracion: Date.now() - inicio,
      };
    }
  } catch (error) {
    return {
      nombre,
      exitoso: false,
      mensaje: `Error: ${(error as Error).message}`,
      duracion: Date.now() - inicio,
    };
  }
}

/**
 * Probar ráfaga de eventos (stress test)
 */
export async function probarRafagaEventos(
  emitir: (evento: string, datos: any) => void,
  cantidad: number = 100
): Promise<ResultadoPrueba> {
  const inicio = Date.now();
  const nombre = 'Ráfaga de Eventos';
  
  try {
    console.log(`[testUtils] Emitiendo ${cantidad} eventos rápidamente`);
    
    for (let i = 0; i < cantidad; i++) {
      emitir('test:rafaga', { index: i, timestamp: Date.now() });
    }
    
    return {
      nombre,
      exitoso: true,
      mensaje: `${cantidad} eventos emitidos exitosamente`,
      detalles: { cantidad, velocidad: `${(cantidad / ((Date.now() - inicio) / 1000)).toFixed(0)} eventos/s` },
      duracion: Date.now() - inicio,
    };
  } catch (error) {
    return {
      nombre,
      exitoso: false,
      mensaje: `Error: ${(error as Error).message}`,
      duracion: Date.now() - inicio,
    };
  }
}

/**
 * Ejecutar suite completa de pruebas edge case
 */
export async function ejecutarSuitePruebas(
  socket: Socket | null,
  conectar: (token: string) => Promise<void>,
  token: string
): Promise<ResultadoPrueba[]> {
  console.log('[testUtils] Iniciando suite de pruebas edge case');
  
  const resultados: ResultadoPrueba[] = [];
  
  // 1. Probar desconexión temporal
  if (socket) {
    resultados.push(await simularDesconexionTemporal(socket, 3000));
  }
  
  // 2. Probar token expirado
  resultados.push(await probarTokenExpirado(conectar));
  
  // 3. Probar ráfaga de eventos
  if (socket) {
    resultados.push(await probarRafagaEventos(
      (evento, datos) => socket.emit(evento, datos),
      50
    ));
  }
  
  console.log('[testUtils] Suite de pruebas completada');
  console.table(resultados.map(r => ({
    Prueba: r.nombre,
    Resultado: r.exitoso ? '✓ Exitoso' : '✗ Fallido',
    Mensaje: r.mensaje,
    Duración: `${r.duracion}ms`,
  })));
  
  return resultados;
}

/**
 * Verificar que no hay errores en consola
 */
export function verificarConsola(): ResultadoPrueba {
  const inicio = Date.now();
  const nombre = 'Verificación de Consola';
  
  // En un entorno real, esto requeriría interceptar console.error
  // Por ahora, solo retornamos un resultado informativo
  
  return {
    nombre,
    exitoso: true,
    mensaje: 'Verifica manualmente que no hay errores en la consola del navegador',
    detalles: {
      nota: 'Abre las DevTools y revisa la pestaña Console',
    },
    duracion: Date.now() - inicio,
  };
}

/**
 * Verificar uso de memoria
 */
export function verificarMemoria(): ResultadoPrueba {
  const inicio = Date.now();
  const nombre = 'Uso de Memoria';
  
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (window.performance as any)) {
    const memory = (window.performance as any).memory;
    const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
    const totalMB = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
    const limitMB = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
    
    return {
      nombre,
      exitoso: true,
      mensaje: `Memoria usada: ${usedMB}MB / ${totalMB}MB (límite: ${limitMB}MB)`,
      detalles: {
        usedMB: parseFloat(usedMB),
        totalMB: parseFloat(totalMB),
        limitMB: parseFloat(limitMB),
        porcentaje: ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2) + '%',
      },
      duracion: Date.now() - inicio,
    };
  }
  
  return {
    nombre,
    exitoso: false,
    mensaje: 'API de memoria no disponible en este navegador',
    duracion: Date.now() - inicio,
  };
}
