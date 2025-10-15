# WebSocket Integration - Frontend

## Uso del Hook useWebSocket

El frontend incluye un hook personalizado para manejar la conexión WebSocket.

### Importar

```typescript
import { useWebSocket } from '@/lib/websocket/useWebSocket';
```

### Uso Básico

```typescript
function MiComponente() {
  const {
    socket,
    estaConectado,
    estadoConexion,
    emitir,
    reconectar,
    desconectar
  } = useWebSocket();

  // Verificar si está conectado
  if (estaConectado) {
    console.log('WebSocket conectado');
  }

  // Emitir evento
  const enviarDatos = () => {
    emitir('iot:data', {
      deviceId: 'device123',
      data: { voltage: 220 }
    });
  };

  return (
    <div>
      <p>Estado: {estadoConexion}</p>
      <button onClick={enviarDatos}>Enviar Datos</button>
    </div>
  );
}
```

## Escuchar Eventos

```typescript
import { useEffect } from 'react';

function MiComponente() {
  const { socket } = useWebSocket();

  useEffect(() => {
    if (!socket) return;

    // Escuchar notificaciones
    socket.on('notification:received', (data) => {
      console.log('Notificación:', data);
      // Mostrar notificación al usuario
    });

    // Escuchar datos IoT
    socket.on('iot:data:update', (data) => {
      console.log('Datos IoT:', data);
      // Actualizar UI con nuevos datos
    });

    // Cleanup
    return () => {
      socket.off('notification:received');
      socket.off('iot:data:update');
    };
  }, [socket]);

  return <div>...</div>;
}
```

## Proveedor WebSocket

El proveedor debe envolver la aplicación en `app/layout.tsx`:

```typescript
import { ProveedorWebSocket } from '@/lib/websocket/ProveedorWebSocket';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ProveedorWebSocket>
          {children}
        </ProveedorWebSocket>
      </body>
    </html>
  );
}
```

## Configuración

El WebSocket se configura automáticamente usando `NEXT_PUBLIC_WS_URL`.

### Reconexión Automática

El sistema intenta reconectar automáticamente si se pierde la conexión:
- Backoff exponencial
- Máximo 10 intentos
- Delay inicial: 1 segundo

## Estados de Conexión

- `desconectado` - Sin conexión
- `conectando` - Intentando conectar
- `conectado` - Conexión establecida
- `reconectando` - Intentando reconectar
- `error` - Error de conexión

## Debugging

Para ver logs de WebSocket en desarrollo:

```typescript
// En el navegador
localStorage.setItem('debug', 'socket.io-client:*');
```

## Página de Testing

En desarrollo, acceder a `/test-websocket` para:
- Ver estado de conexión
- Simular eventos
- Probar reconexión
- Ver métricas
