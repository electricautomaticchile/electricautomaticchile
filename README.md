# Frontend - Electric Automatic Chile

Aplicación web construida con Next.js que proporciona la interfaz de usuario del sistema.

## 🎯 ¿Para qué sirve?

Este es el **frontend del sistema**. Proporciona:
- Interfaz de usuario para clientes y administradores
- Dashboard con datos en tiempo real
- Gestión de cotizaciones y servicios
- Visualización de dispositivos IoT
- Notificaciones en tiempo real vía WebSocket

## 🔌 ¿Cómo se conecta con los otros proyectos?

```
Frontend (Puerto 3000) ← Tú estás aquí
    ↓ HTTP/REST          ↓ WebSocket
Backend API              WebSocket API
(Puerto 4000)            (Puerto 5000)
```

- **Frontend → Backend**: Envía peticiones HTTP para todas las operaciones (login, CRUD, etc.)
- **Frontend ↔ WebSocket**: Mantiene conexión WebSocket para recibir notificaciones y eventos en tiempo real
- **Usuario**: Interactúa con esta aplicación desde el navegador

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env.local
# Editar .env.local con tus valores
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

### 4. Build para producción
```bash
npm run build
npm start
```

## 📱 Páginas Principales

- `/` - Página de inicio
- `/auth/login` - Inicio de sesión
- `/dashboard` - Dashboard principal
- `/cotizaciones` - Gestión de cotizaciones
- `/dispositivos` - Monitoreo de dispositivos IoT
- `/reportes` - Reportes y analítica

## ⚙️ Variables de Entorno Importantes

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NEXT_PUBLIC_API_URL` | URL del Backend API | ✅ Sí |
| `NEXT_PUBLIC_WS_URL` | URL del WebSocket API | ✅ Sí |
| `NEXTAUTH_SECRET` | Secret para NextAuth | ✅ Sí |
| `NEXTAUTH_URL` | URL de esta aplicación | ✅ Sí |

## 🔄 WebSocket en Tiempo Real

El frontend se conecta automáticamente al WebSocket API para recibir:
- Notificaciones instantáneas
- Actualizaciones de dispositivos IoT
- Alertas del sistema
- Cambios en cotizaciones

## 📚 Documentación Adicional

Ver carpeta `docs/` para documentación detallada.
