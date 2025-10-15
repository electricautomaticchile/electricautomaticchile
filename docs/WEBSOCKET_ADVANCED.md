# WebSocket - Guía Avanzada

## 📋 Contenido

1. [Arquitectura](#arquitectura)
2. [Manejo de Errores](#manejo-de-errores)
3. [Optimización de Rendimiento](#optimización-de-rendimiento)
4. [Manejadores de Eventos](#manejadores-de-eventos)
5. [Estado Global](#estado-global)

---

## Arquitectura

### Componentes Principales

```
lib/websocket/
├── AdministradorWebSocket.ts    # Gestión de conexión
├── ProveedorWebSocket.tsx       # React Provider
├── useWebSocket.ts              # Hook principal
├── logger.ts                    # Sistema de logging
├── errorHandlers.ts             # Manejo de errores
└── manejadores/                 # Manejadores de eventos
    ├── manejadoresIoT.ts
    ├── manejadoresNotificaciones.ts
    └── manejadoresHardware.ts
```

### Flujo de Datos

```
Servidor WebSocket
    ↓
AdministradorWebSocket (conexión)
    ↓
Manejadores de Eventos (procesamiento)
    ↓
Zustand Store (estado global)
    ↓
Componentes React (UI)
```

---

## Manejo de Errores

### Tipos de Errores

```typescript
enum TipoErrorWebSocket {
  AUTENTICACION = 'autenticacion',  // JWT inválido, 401, 403
  RED = 'red',                      // Problemas de conexión
  TIMEOUT = 'timeout',              // Timeouts
  EVENTO = 'evento',                // Errores en manejadores
  DESCONOCIDO = 'desconocido'       // Otros errores
}
```

### Manejo Automático

El sistema maneja automáticamente:
- **Errores de autenticación**: Limpia tokens y redirige a login
- **Errores de red**: Intenta reconectar automáticamente
- **Errores en eventos**: Loggea pero no crashea la app

### Uso en Componentes

```typescript
import { manejarErrorEvento } from '@/lib/websocket/errorHandlers';

function procesarEvento(datos: any) {
  try {
    // Tu lógica aquí
    actualizarUI(datos);
  } catch (error) {
    const resultado = manejarErrorEvento('mi:evento', error, datos);
    
    if (resultado.debeNotificarUsuario) {
      toast({
        title: 'Error',
        description: resultado.mensajeUsuario,
        variant: 'destructive',
      });
    }
  }
}
```

### Logging

```typescript
import { wsLogger } from '@/lib/websocket/logger';

// Loggear conexión
wsLogger.logConexionExitosa({ socketId: 'abc123' });

// Loggear error
wsLogger.logErrorConexion(error, { url: 'ws://localhost:5000' });

// Loggear evento
wsLogger.logEventoRecibido('dispositivo:voltaje', { voltaje: 220 });

// Obtener métricas
const metricas = wsLogger.obtenerMetricas();
console.log('Eventos recibidos:', metricas.eventosRecibidos);
```

---

## Optimización de Rendimiento

### Debouncing (Eventos Rápidos)

Para eventos que llegan muy rápido (>10/segundo):

```typescript
import { debounce } from '@/lib/websocket';

// Crear handler con debounce
const handleSensorUpdate = debounce((data) => {
  updateUI(data);
}, 200); // 200ms de delay

useWebSocket('hardware:sensor', handleSensorUpdate);
```

### Throttling (Actualizaciones de UI)

Para limitar actualizaciones a 60fps:

```typescript
import { throttleRAF } from '@/lib/websocket';

// Throttle a 60fps
const updateChart = throttleRAF((data) => {
  setChartData(prev => [...prev, data]);
});

useWebSocket('dispositivo:potencia', updateChart);
```

### Hooks Optimizados

#### useWebSocketLatest
Solo el último valor, detecta datos obsoletos:

```typescript
import { useWebSocketLatest } from '@/lib/websocket';

function LatestPower() {
  const { data, isStale, timeSinceUpdate } = useWebSocketLatest(
    'dispositivo:potencia',
    30000 // Obsoleto después de 30s
  );
  
  return (
    <div className={isStale ? 'opacity-50' : ''}>
      <p>Potencia: {data?.potenciaActiva} W</p>
      <p>Actualizado hace {Math.floor(timeSinceUpdate / 1000)}s</p>
    </div>
  );
}
```

#### useWebSocketHistory
Mantiene historial limitado:

```typescript
import { useWebSocketHistory } from '@/lib/websocket';

function EventHistory() {
  const { events, getRecent, clear, size } = useWebSocketHistory(
    'dispositivo:potencia',
    100 // Últimos 100 eventos
  );
  
  // Eventos de los últimos 5 minutos
  const recentEvents = getRecent(5 * 60 * 1000);
  
  return <div>Total: {size} eventos</div>;
}
```

#### useWebSocketAggregated
Agrega múltiples eventos:

```typescript
import { useWebSocketAggregated } from '@/lib/websocket';

function AveragePower() {
  const avgPower = useWebSocketAggregated(
    'dispositivo:potencia',
    (events) => {
      const sum = events.reduce((acc, e) => acc + e.potenciaActiva, 0);
      return sum / events.length;
    },
    100 // Agregar cada 100ms
  );
  
  return <div>Promedio: {avgPower} W</div>;
}
```

### Gestión de Memoria

El sistema limpia automáticamente:
- Listeners antiguos (>5 minutos sin uso)
- Historial de eventos (máximo 100 por tipo)
- Eventos obsoletos

```typescript
import { getMemoryManager } from '@/lib/websocket';

// Obtener estadísticas
const manager = getMemoryManager();
const stats = manager.getListenerStats();
console.log('Total listeners:', stats.totalListeners);

// Verificar salud de memoria
const health = manager.checkMemoryLimits();
if (!health.isHealthy) {
  console.warn('Advertencias:', health.warnings);
}
```

---

## Manejadores de Eventos

### Eventos IoT

```typescript
// Registrar automáticamente
import { registrarManejadoresIoT } from '@/lib/websocket/manejadores';

registrarManejadoresIoT(socket.escuchar.bind(socket));

// Obtener datos procesados
import { obtenerAlertasActivas } from '@/lib/websocket/manejadores';

const alertas = obtenerAlertasActivas();
```

**Eventos manejados:**
- `dispositivo:actualizacion_voltaje`
- `dispositivo:actualizacion_corriente`
- `dispositivo:actualizacion_potencia`
- `dispositivo:actualizacion_conexion`
- `iot:alerta:nueva`

### Notificaciones

```typescript
import { 
  registrarManejadoresNotificaciones,
  obtenerNotificacionesNoLeidas,
  marcarNotificacionComoLeida,
  useContadorNotificaciones
} from '@/lib/websocket/manejadores';

// En componente
function NotificationBadge() {
  const contador = useContadorNotificaciones();
  
  return <Badge>{contador}</Badge>;
}
```

**Eventos manejados:**
- `notificacion:recibida`
- `notificacion:leida`

### Hardware

```typescript
import { 
  registrarManejadoresHardware,
  enviarComandoDispositivo,
  controlarRele,
  solicitarLecturaSensor
} from '@/lib/websocket/manejadores';

// Controlar relé
controlarRele('device-123', 'rele-1', 'encendido', socket.emitir.bind(socket));

// Solicitar lectura
solicitarLecturaSensor('device-123', 'sensor-temp', socket.emitir.bind(socket));
```

**Eventos manejados:**
- `hardware:resultado_comando`
- `hardware:actualizacion_sensor`
- `hardware:actualizacion_rele`

### Registro Automático

```typescript
import { registrarTodosLosManejadores } from '@/lib/websocket/manejadores';

// Registra todos los manejadores de una vez
registrarTodosLosManejadores(socket.escuchar.bind(socket));
```

---

## Estado Global

### Zustand Store

Todos los eventos se almacenan en el store global:

```typescript
import { useWebSocketStore } from '@/lib/store/useWebSocketStore';

function MyComponent() {
  // Estado de conexión
  const { estaConectado, estadoConexion } = useWebSocketStore();
  
  // Métricas
  const metricas = useWebSocketStore(state => state.metricas);
  
  // Eventos
  const eventos = useWebSocketStore(state => state.ultimosEventos);
  
  // Obtener eventos por tipo
  const eventosVoltaje = useWebSocketStore(
    state => state.obtenerEventosPorTipo('dispositivo:voltaje')
  );
  
  return <div>Conectado: {estaConectado ? 'Sí' : 'No'}</div>;
}
```

### Hooks Selectores (Optimizados)

Para mejor rendimiento, usa los hooks selectores:

```typescript
import { 
  useEstadoConexion,
  useInfoReconexion,
  useMetricasWebSocket,
  useEventosWebSocket 
} from '@/lib/store/useWebSocketStore';

// Solo re-renderiza cuando cambia el estado de conexión
function ConnectionStatus() {
  const { estaConectado, estadoConexion } = useEstadoConexion();
  return <div>{estadoConexion}</div>;
}

// Solo re-renderiza cuando cambian las métricas
function Metrics() {
  const { metricas } = useMetricasWebSocket();
  return <div>Latencia: {metricas.latencia}ms</div>;
}
```

### Acciones del Store

```typescript
const store = useWebSocketStore.getState();

// Actualizar estado
store.establecerConectado(true);
store.establecerEstadoConexion('conectado');

// Métricas
store.actualizarLatencia(45);
store.incrementarEventosRecibidos();

// Eventos
store.agregarEvento('mi:evento', { data: 'valor' });
store.limpiarEventosPorTipo('dispositivo:voltaje');

// Reiniciar todo
store.reiniciarStore();
```

---

## Mejores Prácticas

### 1. Usar Hooks Optimizados

```typescript
// ✅ Bueno - Hook optimizado
const { estaConectado } = useEstadoConexion();

// ❌ Malo - Re-renderiza en cada cambio del store
const estaConectado = useWebSocketStore(state => state.estaConectado);
```

### 2. Debounce para Eventos Rápidos

```typescript
// ✅ Bueno - Debounce para sensores
const handler = debounce(updateUI, 200);

// ❌ Malo - Sin debounce, actualiza demasiado
useWebSocket('sensor', updateUI);
```

### 3. Limitar Historial

```typescript
// ✅ Bueno - Límite razonable
useWebSocketHistory('evento', 100);

// ❌ Malo - Sin límite, memory leak
useWebSocketHistory('evento', Infinity);
```

### 4. Manejar Errores

```typescript
// ✅ Bueno - Try-catch
try {
  procesarDatos(datos);
} catch (error) {
  manejarErrorEvento('evento', error, datos);
}

// ❌ Malo - Sin manejo de errores
procesarDatos(datos); // Puede crashear
```

### 5. Cleanup de Listeners

```typescript
// ✅ Bueno - Cleanup automático
useWebSocket('evento', callback);

// ✅ También bueno - Cleanup manual
useEffect(() => {
  socket.on('evento', callback);
  return () => socket.off('evento', callback);
}, []);
```

---

## Troubleshooting

### Eventos no se reciben
1. Verificar que el socket esté conectado: `estaConectado`
2. Verificar nombre del evento (case-sensitive)
3. Verificar que el manejador esté registrado

### Memory leaks
1. Verificar que los listeners se limpien en unmount
2. Limitar historial de eventos
3. Usar hooks optimizados

### UI lenta
1. Usar debouncing para eventos rápidos
2. Usar throttling para actualizaciones de UI
3. Usar `useWebSocketLatest` en lugar de historial completo

### Errores de autenticación
1. Verificar que el token JWT sea válido
2. Verificar que `JWT_SECRET` sea el mismo en Backend y WebSocket
3. El sistema redirige automáticamente a login

---

## Referencias

- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hooks](https://react.dev/reference/react)
