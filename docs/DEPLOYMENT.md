# Guía de Despliegue - Electricautomaticchile

## 🚀 Configuración de Producción

### Variables de Entorno Requeridas

#### Variables Críticas de Seguridad

```bash
# JWT Secret (OBLIGATORIO - Mínimo 64 caracteres)
JWT_SECRET=su_secreto_jwt_extremadamente_seguro_de_64_caracteres_minimo

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/electricautomaticchile?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=https://su-dominio.com
NEXTAUTH_SECRET=otro_secreto_seguro_para_nextauth_minimo_32_caracteres

# AWS Credentials
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=su_secret_key_aws
AWS_REGION=us-east-1
AWS_S3_BUCKET=electricautomaticchile-storage

# Email Service (Resend)
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@electricautomaticchile.cl

# Transbank (Pagos)
TRANSBANK_API_KEY=597...
TRANSBANK_SECRET_KEY=579b4...
TRANSBANK_ENVIRONMENT=PRODUCCION

# IoT Device Communication
IOT_API_ENDPOINT=https://api-iot.electricautomaticchile.cl
IOT_DEVICE_SECRET=dispositivo_secret_key_seguro
```

#### Variables Opcionales

```bash
# Redis Cache (Recomendado)
REDIS_URL=redis://usuario:password@host:6379

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
NEW_RELIC_LICENSE_KEY=...

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🏭 Despliegue en AWS Amplify

### 1. Configuración Inicial

```bash
# Instalar Amplify CLI
npm install -g @aws-amplify/cli

# Configurar credenciales AWS
amplify configure

# Inicializar proyecto Amplify
amplify init
```

### 2. Configuración de Build

**amplify.yml**

```yaml
version: 1
applications:
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
            - npm run validate-security
        build:
          commands:
            - npm run amplify:build
      artifacts:
        baseDirectory: .next
        files:
          - "**/*"
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
    backend:
      phases:
        build:
          commands:
            - npx amplify-backend-cli build
```

### 3. Configuración de Dominio

```bash
# Asociar dominio personalizado
amplify add hosting

# Configurar SSL y CDN
amplify configure project
```

## 🐳 Despliegue con Docker

### Dockerfile de Producción

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose para Producción

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - MONGODB_URI=${MONGODB_URI}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - redis
    networks:
      - prod-network
    restart: unless-stopped

  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_prod:/data
    networks:
      - prod-network
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - prod-network
    restart: unless-stopped

volumes:
  redis_prod:

networks:
  prod-network:
    driver: bridge
```

## 🔧 Configuración de Base de Datos

### MongoDB Atlas Setup

1. **Crear Cluster**

   ```bash
   # Crear cluster M10 mínimo para producción
   # Configurar IP Whitelist
   # Configurar usuarios con permisos específicos
   ```

2. **Índices Requeridos**

   ```javascript
   // Usuarios
   db.usuarios.createIndex({ email: 1 }, { unique: true });
   db.usuarios.createIndex({ numeroCliente: 1 }, { unique: true });

   // Dispositivos IoT
   db.dispositivos.createIndex({ deviceId: 1 }, { unique: true });
   db.dispositivos.createIndex({ gpsLocation: "2dsphere" });

   // Mediciones
   db.mediciones.createIndex({ deviceId: 1, timestamp: -1 });
   db.mediciones.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 días

   // Registros de acceso
   db.registrosAcceso.createIndex(
     { timestamp: 1 },
     { expireAfterSeconds: 2592000 }
   ); // 30 días
   ```

## 🔒 Configuración de Seguridad

### Firewall y Red

```bash
# Configurar Security Groups (AWS)
# Puerto 443 (HTTPS) - Abierto
# Puerto 80 (HTTP) - Redirigido a 443
# Puerto 22 (SSH) - Solo IPs específicas
# Puerto 3000 - Solo desde Load Balancer
```

### Headers de Seguridad

```javascript
// next.config.mjs
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];
```

## 📊 Monitoreo y Logs

### Configuración de Logs

```javascript
// lib/logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "electricautomaticchile" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

### Health Checks

```bash
# Endpoint de health check
GET /api/health

# Response esperado
{
  "status": "ok",
  "timestamp": "2024-12-07T10:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "iot_devices": "online"
  }
}
```

## 🚨 Procedimientos de Emergencia

### Rollback Rápido

```bash
# AWS Amplify
amplify env checkout previous

# Docker
docker-compose down
docker-compose -f docker-compose.backup.yml up -d
```

### Backup de Base de Datos

```bash
# MongoDB Atlas - Configurar backups automáticos
# Retención: 30 días mínimo
# Frecuencia: Cada 6 horas
```

## 🔧 Optimización de Performance

### CDN Configuration

```javascript
// next.config.mjs
module.exports = {
  images: {
    domains: ["tu-bucket.s3.amazonaws.com"],
    formats: ["image/webp", "image/avif"],
  },
  experimental: {
    outputStandalone: true,
  },
};
```

### Caching Strategy

```javascript
// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST,
  port: 6379,
  ttl: 3600, // 1 hour
  max_connections: 10,
};
```

---

**⚠️ Importante**: Esta documentación contiene información sensible. Mantener confidencial y actualizar regularmente.
