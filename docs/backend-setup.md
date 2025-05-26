# Configuración Backend - ElectricAutomaticChile

## 🚀 Setup Inicial

### 1. Crear Proyecto Backend

```bash
# Crear directorio y navegar
mkdir electricautomaticchile-backend
cd electricautomaticchile-backend

# Inicializar proyecto Node.js
npm init -y

# Instalar dependencias principales
npm install express typescript @types/express @types/node
npm install mongoose bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
npm install cors helmet morgan compression @types/cors @types/morgan
npm install zod express-rate-limit
npm install winston dotenv
npm install @upstash/redis

# Dependencias de desarrollo
npm install -D nodemon ts-node
npm install -D jest @types/jest supertest @types/supertest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier
```

### 2. Configuración TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@/controllers/*": ["src/controllers/*"],
      "@/models/*": ["src/models/*"],
      "@/services/*": ["src/services/*"],
      "@/middleware/*": ["src/middleware/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"]
    },
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "tests"
  ]
}
```

### 3. Package.json Scripts

```json
{
  "name": "electricautomaticchile-backend",
  "version": "1.0.0",
  "description": "Backend API para ElectricAutomaticChile",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts"
  },
  "keywords": ["iot", "energy", "chile", "api"],
  "author": "ElectricAutomaticChile",
  "license": "MIT"
}
```

### 4. Variables de Entorno

```bash
# .env
NODE_ENV=development
PORT=3001

# Base de datos - usar la misma que Next.js
MONGODB_URI=mongodb://localhost:27017/electricautomaticchile
MONGODB_DB=electricautomaticchile

# JWT Secrets
JWT_SECRET=tu-jwt-secret-muy-seguro-aqui
JWT_REFRESH_SECRET=tu-refresh-secret-muy-seguro-aqui

# Redis para cache y sesiones
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# CORS Origins
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
LOG_DIR=./logs

# Email (para futuras notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 5. Estructura de Directorios

```bash
# Crear estructura de carpetas
mkdir -p src/{controllers,middleware,models,routes,services,utils,types}
mkdir -p tests/{unit,integration}
mkdir -p docs
mkdir -p logs

# Archivos principales
touch src/index.ts
touch src/app.ts
touch .env
touch .gitignore
touch README.md
touch Dockerfile
touch docker-compose.yml
```

## 📁 Archivos Base

### src/index.ts

```typescript
import dotenv from 'dotenv';
import { createServer } from 'http';
import { app } from './app';
import { connectDatabase } from './utils/database';
import { logger } from './utils/logger';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Conectar a la base de datos
    await connectDatabase();
    
    // Crear servidor HTTP
    const server = createServer(app);
    
    // Iniciar servidor
    server.listen(PORT, () => {
      logger.info(`🚀 Servidor iniciado en puerto ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    });
    
    // Manejo de cierre graceful
    process.on('SIGINT', () => {
      logger.info('🔄 Cerrando servidor...');
      server.close(() => {
        logger.info('✅ Servidor cerrado correctamente');
        process.exit(0);
      });
    });
    
  } catch (error) {
    logger.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
```

### src/app.ts

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/users.routes';
import { companyRoutes } from './routes/companies.routes';

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares de seguridad
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW!) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!) || 100,
  message: 'Demasiadas solicitudes desde esta IP, intenta nuevamente más tarde.'
});
app.use(limiter);

// Logging de requests
app.use(morgan('combined'));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
```

### src/utils/database.ts

```typescript
import mongoose from 'mongoose';
import { logger } from './logger';

const MONGODB_URI = process.env.MONGODB_URI!;

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      // Opciones recomendadas para producción
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    
    logger.info('✅ Conectado a MongoDB');
    
    // Event listeners
    mongoose.connection.on('error', (error) => {
      logger.error('❌ Error de MongoDB:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB desconectado');
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconectado');
    });
    
  } catch (error) {
    logger.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
}
```

### .gitignore

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
.nyc_output/

# Docker
.dockerignore
```

## 🐳 Docker Setup

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Build
RUN npm run build

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Cambiar ownership
RUN chown -R backend:nodejs /app
USER backend

EXPOSE 3001

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/electricautomaticchile
    depends_on:
      - mongo
      - redis
    volumes:
      - ./logs:/app/logs

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=electricautomaticchile

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongo_data:
  redis_data:
```

## ✅ Próximos Pasos

1. **Ejecutar setup inicial:**
   ```bash
   npm run dev  # Modo desarrollo
   ```

2. **Probar health check:**
   ```bash
   curl http://localhost:3001/health
   ```

3. **Implementar modelos de datos** (User, Company)

4. **Crear controladores de autenticación**

5. **Configurar middleware de autenticación JWT**

¿Quieres que continuemos con la implementación de algún componente específico? 