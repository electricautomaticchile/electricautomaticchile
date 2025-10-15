# Modo de Prueba WebSocket

Este documento describe el modo de prueba WebSocket implementado para verificar el funcionamiento del sistema sin datos reales.

## Descripción General

El modo de prueba proporciona herramientas completas para:
- Simular eventos WebSocket sin dispositivos reales
- Probar escenarios edge case (casos extremos)
- Verificar el comportamiento del sistema en condiciones adversas
- Monitorear métricas de rendimiento
- Diagnosticar problemas de conexión

## Componentes

### 1. ModoTestWebSocket

Componente principal para simulación de eventos.

**Ubicación**: `electricautomaticchile/components/websocket/ModoTestWebSocket.tsx`

**Características**:
- Simulación manual de eventos individuales
- Simulación automática continua
- Logs de eventos recibidos
- Contadores de eventos por tipo
- Solo disponible en modo desarrollo

**Eventos que puede simular**:
- `dispositivo:actualizacion_voltaje` - Actualizaciones de voltaje
- `dispositivo:actualizacion_corriente` - Actualizaciones de corriente
- `dispositivo:actualizacion_potencia` - Actualizaciones de potencia
- `dispositivo:actualizacion_conexion` - Cambios de estado de dispositivos
- `iot:alerta:nueva` - Alertas IoT
- `notificacion:recibida` - Notificaciones
- `hardware:resultado_comando` - Resultados de comandos
- `hardware:actualizacion_sensor` - Actualizaciones de sensores

### 2. PruebasEdgeCase

Componente para ejecutar pruebas de casos extremos.

**Ubicación**: `electricautomaticchile/components/websocket/PruebasEdgeCase.tsx`

**Pruebas disponibles**:

#### Desconexión Temporal
- Desconecta el socket por 3 segundos
- Verifica que reconecta automáticamente
- Mide el tiempo de reconexión

#### Token Expirado
- Intenta conectar con token inválido
- Verifica que el sistema rechaza la conexión
- Confirma manejo correcto de errores de autenticación

#### Ráfaga de Eventos
- Emite 100 eventos rápidamente
- Verifica que no hay pérdida de datos
- Mide la velocidad de procesamiento

#### Verificación de Consola
- Recordatorio para revisar errores en consola
- Ayuda a detectar warnings o errores no capturados

#### Uso de Memoria
- Muestra el uso actual de memoria JavaScript
- Ayuda a detectar memory leaks
- Solo disponible en navegadores compatibles

#### Red Lenta
- Simula delay de 500ms en todos los eventos
- Simula 10% de pérdida de paquetes
- Verifica comportamiento con red inestable

### 3. testUtils

Utilidades para pruebas programáticas.

**Ubicación**: `electricautomaticchile/lib/websocket/testUtils.ts`

**Funciones disponibles**:

```typescript
// Simular red lenta
simularRedLenta(socket, { delay: 500, perdidaPaquetes: 0.1 })

// Simular desconexión temporal
await simularDesconexionTemporal(socket, 5000)

// Probar múltiples conexiones
await probarMultiplesConexiones(crearSocket, 3)

// Probar token expirado
await probarTokenExpirado(conectar)

// Probar servidor caído
await probarServidorCaido(conectar, token)

// Probar inactividad prolongada
await probarInactividadProlongada(socket, 120000)

// Probar ráfaga de eventos
await probarRafagaEventos(emitir, 100)

// Ejecutar suite completa
await ejecutarSuitePruebas(socket, conectar, token)

// Verificar consola
verificarConsola()

// Verificar memoria
verificarMemoria()
```

## Página de Test

**URL**: `/test-websocket` (solo en desarrollo)

**Ubicación**: `electricautomaticchile/app/test-websocket/page.tsx`

La página de test proporciona una interfaz completa con 4 pestañas:

### 1. Simulación
- Controles para simular eventos manualmente
- Modo automático para generación continua
- Contadores de eventos por tipo
- Botones para cada tipo de evento

### 2. Edge Cases
- Suite completa de pruebas edge case
- Pruebas individuales
- Resultados detallados con tiempos
- Guía de interpretación

### 3. Métricas
- Tiempo total conectado
- Última conexión
- Eventos recibidos/enviados
- Latencia actual
- Historial de conexiones

### 4. Diagnósticos
- Estado actual de conexión
- Intentos de reconexión
- Último error (si existe)
- Información del sistema
- Guía de pruebas recomendadas

## Uso

### Acceso Rápido

1. Iniciar la aplicación en modo desarrollo:
```bash
npm run dev
```

2. Navegar a `/test-websocket`

3. Asegurarse de estar autenticado (tener token JWT válido)

### Simulación Manual

1. Ir a la pestaña "Simulación"
2. Hacer clic en cualquier botón de evento
3. Observar el toast notification
4. Ver el evento en la pestaña "Logs"

### Simulación Automática

1. Ir a la pestaña "Simulación"
2. Cambiar a la sub-pestaña "Automático"
3. Hacer clic en "Iniciar"
4. Observar los contadores incrementarse
5. Hacer clic en "Detener" cuando termine

### Pruebas Edge Case

1. Ir a la pestaña "Edge Cases"
2. Hacer clic en "Ejecutar Suite Completa"
3. Esperar a que todas las pruebas terminen
4. Revisar los resultados
5. Verificar que todas las pruebas sean exitosas

### Pruebas Individuales

1. Ir a la pestaña "Edge Cases"
2. Hacer clic en cualquier prueba individual
3. Observar el resultado
4. Revisar los detalles expandiendo la sección

## Escenarios de Prueba Recomendados

### 1. Conexión sin Datos
**Objetivo**: Verificar que el heartbeat mantiene la conexión activa

**Pasos**:
1. Conectarse al WebSocket
2. No emitir ningún evento
3. Esperar 2-3 minutos
4. Verificar que la conexión sigue activa
5. Verificar que no hay errores en consola

**Resultado esperado**: Conexión estable, latencia consistente

### 2. Reconexión Automática
**Objetivo**: Verificar el comportamiento de reconexión

**Pasos**:
1. Conectarse al WebSocket
2. Ir a "Edge Cases"
3. Ejecutar "Desconexión Temporal"
4. Observar el indicador de estado
5. Verificar que reconecta automáticamente

**Resultado esperado**: Reconexión en <10 segundos, sin pérdida de estado

### 3. Simulación de Eventos
**Objetivo**: Verificar procesamiento de eventos

**Pasos**:
1. Activar simulación automática
2. Dejar correr por 1 minuto
3. Detener simulación
4. Revisar contadores
5. Verificar logs de eventos

**Resultado esperado**: Todos los eventos procesados, sin errores

### 4. Múltiples Pestañas
**Objetivo**: Verificar manejo de múltiples conexiones

**Pasos**:
1. Abrir `/test-websocket` en 3 pestañas
2. Activar simulación en cada una
3. Observar que cada pestaña funciona independientemente
4. Cerrar pestañas una por una
5. Verificar que no hay errores

**Resultado esperado**: Cada pestaña mantiene su propia conexión

### 5. Red Lenta
**Objetivo**: Verificar comportamiento con latencia alta

**Pasos**:
1. Ir a "Edge Cases"
2. Activar "Red Lenta"
3. Simular eventos
4. Observar latencia incrementada
5. Desactivar "Red Lenta"

**Resultado esperado**: Sistema funciona con latencia alta, sin crashes

### 6. Token Expirado
**Objetivo**: Verificar manejo de autenticación

**Pasos**:
1. Ir a "Edge Cases"
2. Ejecutar "Token Expirado"
3. Verificar que la conexión es rechazada
4. Verificar mensaje de error apropiado

**Resultado esperado**: Error de autenticación manejado correctamente

### 7. Ráfaga de Eventos
**Objetivo**: Verificar rendimiento bajo carga

**Pasos**:
1. Ir a "Edge Cases"
2. Ejecutar "Ráfaga de Eventos"
3. Observar velocidad de procesamiento
4. Verificar que no hay pérdida de eventos

**Resultado esperado**: >50 eventos/segundo, sin pérdida

### 8. Uso de Memoria
**Objetivo**: Detectar memory leaks

**Pasos**:
1. Abrir DevTools > Memory
2. Tomar snapshot inicial
3. Ejecutar simulación automática por 5 minutos
4. Tomar snapshot final
5. Comparar uso de memoria

**Resultado esperado**: Incremento <50MB, sin crecimiento continuo

## Interpretación de Resultados

### Pruebas Exitosas ✓

- **Desconexión Temporal**: Reconexión en <10s
- **Token Expirado**: Error de autenticación detectado
- **Ráfaga de Eventos**: Todos los eventos procesados
- **Latencia**: <200ms en condiciones normales
- **Memoria**: Uso estable, sin leaks

### Pruebas Fallidas ✗

Si una prueba falla, revisar:

1. **Logs de consola**: Buscar errores o warnings
2. **Network tab**: Verificar requests WebSocket
3. **Estado de conexión**: Verificar que está conectado
4. **Token JWT**: Verificar que es válido
5. **Servidor WebSocket**: Verificar que está corriendo

## Troubleshooting

### No puedo acceder a /test-websocket

**Causa**: Página solo disponible en desarrollo

**Solución**: Verificar que `NODE_ENV=development`

### Los eventos no se reciben

**Causa**: WebSocket no conectado

**Solución**: 
1. Verificar que el servidor WebSocket está corriendo
2. Verificar token JWT válido
3. Revisar consola para errores

### Latencia muy alta

**Causa**: Red lenta o servidor sobrecargado

**Solución**:
1. Verificar conexión a internet
2. Verificar carga del servidor
3. Desactivar "Red Lenta" si está activa

### Memory leaks detectados

**Causa**: Listeners no limpiados

**Solución**:
1. Verificar que componentes limpian listeners en unmount
2. Revisar código de event handlers
3. Usar DevTools Memory profiler para identificar fuente

## Mejores Prácticas

1. **Ejecutar suite completa** antes de cada deploy
2. **Verificar consola** regularmente durante desarrollo
3. **Monitorear memoria** en sesiones largas
4. **Probar múltiples pestañas** para detectar race conditions
5. **Simular red lenta** para verificar UX con latencia
6. **Documentar** cualquier comportamiento inesperado

## Limitaciones

- Solo disponible en modo desarrollo
- Algunos eventos requieren servidor WebSocket real
- Simulación no replica exactamente comportamiento de dispositivos reales
- Pruebas de memoria limitadas por API del navegador

## Próximos Pasos

Posibles mejoras futuras:

- [ ] Grabación y reproducción de sesiones
- [ ] Exportar resultados de pruebas
- [ ] Pruebas automatizadas con Playwright
- [ ] Simulación de múltiples dispositivos
- [ ] Gráficos de latencia en tiempo real
- [ ] Alertas automáticas para anomalías

## Referencias

- [Socket.IO Client API](https://socket.io/docs/v4/client-api/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Chrome DevTools Memory Profiler](https://developer.chrome.com/docs/devtools/memory-problems/)
