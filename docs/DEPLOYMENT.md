# Deployment - Frontend

## Vercel (Recomendado)

### 1. Conectar con GitHub

1. Ir a [Vercel](https://vercel.com)
2. Importar proyecto desde GitHub
3. Seleccionar el repositorio

### 2. Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NEXT_PUBLIC_WS_URL=https://ws.tudominio.com
NEXTAUTH_URL=https://tudominio.com
NEXTAUTH_SECRET=<nextauth_secret>
DATABASE_URL=<mongodb_uri>
```

### 3. Deploy

Vercel desplegará automáticamente en cada push a `main`.

## AWS Amplify

### 1. Conectar con GitHub

1. Ir a AWS Amplify Console
2. Conectar repositorio
3. Seleccionar branch `main`

### 2. Build Settings

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 3. Variables de Entorno

Configurar en Amplify Console:

```bash
NEXT_PUBLIC_API_URL=<backend_url>
NEXT_PUBLIC_WS_URL=<websocket_url>
NEXTAUTH_URL=<frontend_url>
NEXTAUTH_SECRET=<secret>
DATABASE_URL=<mongodb_uri>
```

## Build Local

```bash
npm run build
npm start
```

## Variables de Entorno Importantes

### NEXT_PUBLIC_API_URL
URL del Backend API. Debe ser accesible desde el navegador.

### NEXT_PUBLIC_WS_URL
URL del WebSocket API. Debe ser accesible desde el navegador.

### NEXTAUTH_SECRET
Secret único para NextAuth. Generar con:
```bash
openssl rand -base64 32
```

## Verificación Post-Deployment

1. Abrir la URL del frontend
2. Verificar que carga correctamente
3. Intentar login
4. Verificar conexión WebSocket en DevTools → Network → WS
5. Verificar que llegan notificaciones en tiempo real
