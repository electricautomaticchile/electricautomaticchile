# 🔗 Implementación Backend Externo - Electric Automatic Chile

## 📋 Resumen

Este documento describe la implementación completa de la arquitectura **Frontend + Backend separados** para Electric Automatic Chile, donde:

- **Frontend**: Next.js 14 (`electricautomaticchile/`)
- **Backend**: Express.js + TypeScript (`electricautomaticchile-backend/`)

## 🏗️ Arquitectura Implementada

```
┌─────────────────────────────────────────────────────────────┐
│                 ELECTRIC AUTOMATIC CHILE                   │
│               FRONTEND + BACKEND SEPARADOS                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   FRONTEND      │◄──────────────────►│   BACKEND       │
│   (Next.js)     │    Port 3000        │   (Express.js)  │
│                 │                     │   Port 4000     │
│ • Next.js 14    │                     │ • TypeScript    │
│ • NextAuth.js   │                     │ • Express.js    │
│ • Tailwind CSS  │                     │ • MongoDB       │
│ • React Query   │                     │ • JWT Auth      │
│ • ShadCN/UI     │                     │ • Socket.IO     │
└─────────────────┘                     └─────────────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────┐                     ┌─────────────────┐
│   DEPLOYMENT    │                     │   DEPLOYMENT    │
│                 │                     │                 │
│ • Vercel        │                     │ • Railway       │
│ • AWS Amplify   │                     │ • Heroku        │
│ • Netlify       │                     │ • AWS EC2       │
└─────────────────┘                     └─────────────────┘
```

## ⚙️ Configuración del Backend

### 1. Variables de Entorno (`electricautomaticchile-backend/.env`)

```env
# Servidor
PORT=4000
NODE_ENV=development
API_VERSION=v1

# Base de Datos
MONGODB_URI=mongodb://localhost:27017/electric-automatic-chile

# JWT
JWT_SECRET=your-super-secret-jwt-key-backend
JWT_REFRESH_SECRET=your-super-secret-refresh-key-backend
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS - URLs del Frontend
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,https://electricautomaticchile.com

# Email
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@electricautomaticchile.com

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=electric-automatic-files

# Redis (opcional para cache)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 2. Middleware de Integración Frontend

**Archivo**: `src/middleware/frontend-integration.middleware.ts`

```typescript
// Middleware para habilitar comunicación con frontend
export const enableFrontendIntegration = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.cors.allowedOrigins.join(','));
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
};
```

### 3. Iniciar Backend

```bash
cd electricautomaticchile-backend
npm install
npm run dev
```

El backend estará disponible en: `http://localhost:4000`

## ⚙️ Configuración del Frontend

### 1. Variables de Entorno (`electricautomaticchile/.env.local`)

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_BACKEND_HEALTH_CHECK_INTERVAL=30000

# NextAuth (para frontend)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# MongoDB (para sesiones de NextAuth)
MONGODB_URI=mongodb://localhost:27017/electric-automatic-chile

# Email (para formularios del frontend)
RESEND_API_KEY=your-resend-api-key
```

### 2. Cliente API (`lib/api/client.ts`)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiClient {
  private async getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Agregar token de NextAuth
    const session = await getSession();
    if (session?.user) {
      headers['X-User-Info'] = JSON.stringify(session.user);
    }

    return headers;
  }

  async get(endpoint: string, params?: any) {
    const url = new URL(`${API_BASE_URL}/api/v1/${endpoint}`);
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: await this.getHeaders(),
      credentials: 'include',
    });

    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();
```

### 3. Servicios del Backend (`lib/services/backend.service.ts`)

```typescript
export class NotificationService {
  static async getNotifications(params?: any) {
    return apiClient.get('/notificaciones/listar', params);
  }

  static async markAsRead(notificationId: string) {
    return apiClient.put('/notificaciones/marcar-leida', { notificationId });
  }
}

export class MessageService {
  static async getConversations() {
    return apiClient.get('/mensajes/listar');
  }

  static async sendMessage(messageData: any) {
    return apiClient.post('/mensajes/crear', messageData);
  }
}
```

### 4. Iniciar Frontend

```bash
cd electricautomaticchile
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

## 🔄 Flujo de Comunicación

### 1. Autenticación Dual

```typescript
// Frontend: NextAuth.js para sesiones web
const session = await getServerSession(authOptions);

// Backend: JWT para API authentication
const token = jwt.sign({ userId, role }, JWT_SECRET);
```

### 2. Llamadas API

```typescript
// Desde componentes React
const { data: notifications } = await NotificationService.getNotifications();

// Automáticamente envía:
// - Headers de CORS
// - Información de usuario de NextAuth
// - Cookies de sesión
```

### 3. Manejo de Estados

```typescript
// Estado de conectividad
const [backendStatus, setBackendStatus] = useState({
  connected: false,
  loading: true
});

// Verificación automática cada 30s
useEffect(() => {
  const interval = setInterval(async () => {
    const status = await HealthService.getBackendStatus();
    setBackendStatus(status);
  }, 30000);
}, []);
```

## 🚀 Desarrollo Local

### 1. Ejecutar Ambos Proyectos

```bash
# Terminal 1: Backend
cd electricautomaticchile-backend
npm run dev
# Backend: http://localhost:4000

# Terminal 2: Frontend  
cd electricautomaticchile
npm run dev
# Frontend: http://localhost:3000
```

### 2. Verificar Conectividad

- Visita: `http://localhost:3000`
- En el dashboard debería aparecer: **"Backend Conectado"**
- API Health Check: `http://localhost:4000/`

### 3. Testing de Endpoints

```bash
# Probar backend directamente
curl http://localhost:4000/
curl http://localhost:4000/api/v1/health

# Desde frontend, verificar en DevTools:
# Network tab debería mostrar calls a localhost:4000
```

## 📦 Deployment

### Backend Deployment

**Opción 1: Railway**
```bash
cd electricautomaticchile-backend
railway login
railway init
railway add
railway deploy
```

**Opción 2: Heroku**
```bash
cd electricautomaticchile-backend
heroku create electric-backend
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
git push heroku main
```

### Frontend Deployment

**Opción 1: Vercel**
```bash
cd electricautomaticchile
vercel --prod
# Agregar variables de entorno en dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

**Opción 2: AWS Amplify**
```bash
cd electricautomaticchile
amplify init
amplify add hosting
amplify publish
```

### Variables de Producción

**Backend (.env)**
```env
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/production
ALLOWED_ORIGINS=https://electricautomaticchile.com,https://www.electricautomaticchile.com
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=https://api.electricautomaticchile.com
NEXTAUTH_URL=https://electricautomaticchile.com
```

## 🔧 Funcionalidades Implementadas

### ✅ Backend APIs Disponibles

- **Autenticación**: `/api/v1/auth/*`
- **Usuarios**: `/api/v1/users/*`
- **Notificaciones**: `/api/v1/notificaciones/*`
- **Mensajes**: `/api/v1/mensajes/*`
- **Dispositivos**: `/api/v1/dispositivos/*`
- **Mediciones**: `/api/v1/mediciones/*`
- **Analytics**: `/api/v1/analytics/*`
- **Clientes**: `/api/v1/clientes/*`

### ✅ Frontend Integrado

- **Cliente API**: Configurado para backend externo
- **Servicios**: Clases para cada endpoint
- **Estado**: Verificación de conectividad
- **Auth**: Sincronización NextAuth ↔ Backend JWT
- **UI**: Componente de estado del backend

### ✅ Desarrollo

- **Hot Reload**: Ambos proyectos independientes
- **CORS**: Configurado correctamente
- **Debug**: Logs de requests entre servicios
- **Health Check**: Monitoreo de estado

## 🐛 Troubleshooting

### Backend no conecta

```bash
# Verificar que está ejecutándose
curl http://localhost:4000
# Si falla, revisar logs del backend

# Verificar MongoDB
mongosh "mongodb://localhost:27017/electric-automatic-chile"
```

### CORS Errors

```typescript
// Backend: src/utils/config.ts
cors: {
  allowedOrigins: ['http://localhost:3000', 'https://yourfrontend.com']
}
```

### Frontend no encuentra Backend

```bash
# Verificar variables de entorno
echo $NEXT_PUBLIC_API_URL
# Debe ser: http://localhost:4000

# Verificar en browser DevTools > Network
# Buscar calls a localhost:4000
```

### Authentication Issues

```typescript
// Verificar headers en DevTools
{
  "X-User-Info": "{\"id\":\"...\",\"email\":\"...\"}",
  "Authorization": "Bearer eyJ..."
}
```

## 📈 Beneficios de esta Arquitectura

### ✅ **Separación de Responsabilidades**
- Frontend: UI/UX, SEO, formularios
- Backend: Lógica de negocio, APIs, base de datos

### ✅ **Escalabilidad Independiente**
- Escalar frontend (CDN, múltiples instancias)
- Escalar backend (load balancer, microservicios)

### ✅ **Desarrollo Paralelo**
- Equipos frontend y backend independientes
- Hot reload independiente
- Testing separado

### ✅ **Deployment Flexible**
- Frontend: Vercel, Netlify, AWS Amplify
- Backend: Railway, Heroku, AWS EC2
- Diferentes proveedores si es necesario

### ✅ **Seguridad Mejorada**
- APIs protegidas por CORS
- Tokens JWT independientes de cookies
- Validación en múltiples capas

## 🎯 Próximos Pasos

1. **WebSockets**: Implementar Socket.IO entre frontend y backend
2. **Cache**: Redis en backend + React Query en frontend
3. **Monitoring**: Healthchecks, logs, métricas
4. **CI/CD**: GitHub Actions para deploy automático
5. **Testing**: Jest backend + Cypress frontend

---

**¡Implementación completa de arquitectura frontend + backend separados exitosa!** 🎉 