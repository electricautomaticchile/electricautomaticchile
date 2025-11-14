# Deployment - Frontend

## 🚀 Deployment en Producción

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://api.tudominio.com
   NEXT_PUBLIC_WS_URL=https://ws.tudominio.com
   JWT_SECRET=tu_secret_key_produccion
   ```
3. Deploy automático en cada push a `main`

### Build Manual

```bash
npm run build
npm start
```

## 🔧 Variables de Entorno

### Desarrollo

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:5000
JWT_SECRET=dev_secret_key_32_caracteres_min
```

### Producción

```env
NEXT_PUBLIC_API_URL=https://api.electricautomaticchile.com
NEXT_PUBLIC_WS_URL=https://ws.electricautomaticchile.com
JWT_SECRET=prod_secret_key_muy_seguro_32_chars
NODE_ENV=production
```

## 📦 Build Optimization

El proyecto está configurado con:

- **Code Splitting** automático por Next.js
- **Image Optimization** con next/image
- **Font Optimization** con next/font
- **Bundle Analysis** disponible con `npm run analyze`

## 🔒 Seguridad

- JWT almacenado en cookies httpOnly
- CORS configurado para dominios específicos
- Middleware de autenticación en rutas protegidas
- Validación de tokens en cada request

## 📊 Monitoreo

Recomendaciones:

- Vercel Analytics para métricas de rendimiento
- Sentry para error tracking
- LogRocket para session replay
