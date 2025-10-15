# Documentación - Frontend

## 📋 Documentos Disponibles

### [📄 Deployment](./DEPLOYMENT.md)
Guía completa para desplegar el frontend en producción (Vercel, AWS Amplify).

### [🔌 WebSocket - Guía Básica](./WEBSOCKET.md)
Cómo usar el sistema de WebSocket en tiempo real en el frontend.

### [⚡ WebSocket - Guía Avanzada](./WEBSOCKET_ADVANCED.md)
Arquitectura, manejo de errores, optimización de rendimiento y manejadores de eventos.

## 🏗️ Arquitectura del Frontend

```
Frontend (Next.js 14)
├── app/                    # App Router (Next.js 14)
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Dashboard principal
│   ├── cotizaciones/      # Gestión de cotizaciones
│   └── dispositivos/      # Monitoreo IoT
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI base
│   └── websocket/        # Componentes WebSocket
├── lib/                  # Librerías y utilidades
│   ├── websocket/        # Sistema WebSocket
│   ├── store/            # Estado global (Zustand)
│   └── utils/            # Utilidades
└── public/               # Archivos estáticos
```

## 🔄 Flujo de Datos

### 1. Autenticación
```
Usuario → Login Form → Backend API → JWT Token → Frontend
```

### 2. Datos en Tiempo Real
```
Backend API → WebSocket API → Frontend (useWebSocket hook)
```

### 3. Operaciones CRUD
```
Frontend → Backend API → MongoDB → Backend API → Frontend
```

## 🎨 Componentes Principales

### Dashboard
- Vista general del sistema
- Métricas en tiempo real
- Gráficos y estadísticas

### Gestión de Cotizaciones
- Crear/editar cotizaciones
- Seguimiento de estado
- Exportación de reportes

### Monitoreo IoT
- Estado de dispositivos en tiempo real
- Alertas y notificaciones
- Control remoto

## 🔌 WebSocket

El frontend mantiene una conexión WebSocket permanente para:
- Notificaciones instantáneas
- Actualizaciones de dispositivos IoT
- Alertas del sistema
- Cambios en cotizaciones

Ver [WEBSOCKET.md](./WEBSOCKET.md) para más detalles.

## 🛠️ Desarrollo

### Comandos
```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run lint     # Linting
npm run type-check # Verificar tipos
```

### Variables de Entorno
Ver `.env.example` en la raíz del proyecto.

## 📱 Responsive Design

El frontend está optimizado para:
- Desktop (1920x1080+)
- Tablet (768x1024)
- Mobile (375x667+)

## 🧪 Testing

Para testing de WebSocket en desarrollo:
- Acceder a `/test-websocket`
- Simular eventos
- Ver métricas de conexión

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
