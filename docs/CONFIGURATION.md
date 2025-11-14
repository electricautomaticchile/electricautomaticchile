# Configuración - Frontend

## 🔧 Configuración del Proyecto

### Next.js Config

El archivo `next.config.js` incluye:

```javascript
{
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: true
  }
}
```

### TypeScript Config

Configuración estricta en `tsconfig.json`:

- `strict: true`
- `noImplicitAny: true`
- Path aliases configurados (`@/`)

## 🎨 Tailwind CSS

Configuración en `tailwind.config.ts`:

- Tema personalizado con colores de marca
- Dark mode habilitado
- Plugins: forms, typography

## 🔌 WebSocket Configuration

### Configuración del Cliente

```typescript
// lib/websocket/AdministradorWebSocket.ts
{
  conectarAutomaticamente: false,
  reconexion: true,
  intentosReconexion: 5,
  retrasoReconexion: 1000,
  retrasoReconexionMax: 30000,
  timeout: 20000,
  intervaloHeartbeat: 25000,
  timeoutHeartbeat: 60000
}
```

### Eventos Disponibles

- `connection:confirmed` - Conexión establecida
- `room:joined` - Unido a sala
- `dispositivo:actualizacion_potencia` - Datos de consumo
- `alert:new` - Nueva alerta
- `command:result` - Resultado de comando

## 🔐 Autenticación

### Middleware

El middleware en `middleware.ts` protege rutas:

- `/dashboard-cliente/*` - Solo clientes
- `/dashboard-empresa/*` - Solo empresas
- `/dashboard-superadmin/*` - Solo superadmins

### Token Management

```typescript
// lib/api/utils/tokenManager.ts
- getToken() - Obtener token actual
- setToken(token) - Guardar token
- removeToken() - Eliminar token
- isTokenExpired() - Verificar expiración
```

## 📱 Responsive Design

Breakpoints configurados:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🌐 Internacionalización

Formato de moneda: `es-CL` (Pesos Chilenos)
Formato de fecha: `es-CL`
Zona horaria: `America/Santiago`
