# Backend API - ElectricAutomaticChile

## 🚀 Setup Completo

### 1. Inicialización del Proyecto

```bash
# Crear directorio
mkdir electricautomaticchile-backend
cd electricautomaticchile-backend

# Inicializar proyecto
npm init -y

# Instalar dependencias
npm install express typescript @types/express @types/node
npm install mongoose bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
npm install cors helmet morgan compression @types/cors @types/morgan
npm install zod express-rate-limit dotenv winston
npm install @upstash/redis

# Dev dependencies
npm install -D nodemon ts-node @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D jest @types/jest supertest @types/supertest prettier

# Crear estructura
mkdir -p src/{controllers,middleware,models,routes,services,utils,types}
mkdir -p tests logs docs
```

### 2. package.json

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
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "keywords": ["iot", "energy", "chile", "api"],
  "author": "ElectricAutomaticChile",
  "license": "MIT"
}
```

### 3. tsconfig.json

```json
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
    "sourceMap": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 4. .env

```bash
NODE_ENV=development
PORT=3001

# Base de datos (usar la misma URI que tu Next.js)
MONGODB_URI=mongodb+srv://tu-usuario:tu-password@cluster.mongodb.net/electricautomaticchile

# JWT Secrets (generar nuevos)
JWT_SECRET=tu-jwt-secret-super-seguro-aqui-256-bits
JWT_REFRESH_SECRET=tu-refresh-secret-super-seguro-aqui-256-bits

# Redis (Upstash gratuito)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://main.d31trp39fgtk7e.amplifyapp.com

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## 📁 Código Fuente Completo

### src/index.ts

```typescript
import dotenv from 'dotenv';
import { createServer } from 'http';
import { app } from './app';
import { connectDatabase } from './utils/database';
import { logger } from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await connectDatabase();
    
    const server = createServer(app);
    
    server.listen(PORT, () => {
      logger.info(`🚀 Backend API iniciado en puerto ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Health: http://localhost:${PORT}/health`);
      logger.info(`📚 Docs: http://localhost:${PORT}/api-docs`);
    });
    
    process.on('SIGINT', () => {
      logger.info('🔄 Cerrando servidor...');
      server.close(() => {
        logger.info('✅ Servidor cerrado');
        process.exit(0);
      });
    });
    
  } catch (error) {
    logger.error('❌ Error al iniciar:', error);
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

// CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW!) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!) || 100,
  message: { error: 'Demasiadas solicitudes, intenta más tarde' }
});
app.use(limiter);

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);

// Error handling
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
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    logger.info('✅ Conectado a MongoDB');
    
    mongoose.connection.on('error', (error) => {
      logger.error('❌ Error MongoDB:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB desconectado');
    });
    
  } catch (error) {
    logger.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
}
```

### src/utils/logger.ts

```typescript
import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});
```

### src/utils/cache.ts

```typescript
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export class CacheManager {
  private static instance: CacheManager;
  
  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async rateLimit(identifier: string, limit: number, window: number) {
    try {
      const key = `rate_limit:${identifier}`;
      const current = await redis.incr(key);
      
      if (current === 1) {
        await redis.expire(key, window);
      }
      
      const ttl = await redis.ttl(key);
      
      return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current),
        resetTime: Date.now() + (ttl * 1000)
      };
    } catch (error) {
      return { allowed: true, remaining: limit, resetTime: Date.now() + window * 1000 };
    }
  }
}

export const cacheManager = CacheManager.getInstance();
```

## 🗃️ Modelos de Base de Datos

### src/models/User.model.ts

```typescript
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'superadmin' | 'admin' | 'empresa' | 'cliente';
  company?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  avatar?: string;
  phone?: string;
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'empresa', 'cliente'],
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: function() {
      return this.role !== 'superadmin';
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  avatar: String,
  phone: String,
  preferences: {
    language: { type: String, default: 'es' },
    timezone: { type: String, default: 'America/Santiago' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date
}, {
  timestamps: true
});

// Índices
userSchema.index({ email: 1 });
userSchema.index({ company: 1, role: 1 });
userSchema.index({ isActive: 1 });

// Hash password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = model<IUser>('User', userSchema);
```

### src/models/Company.model.ts

```typescript
import { Schema, model, Document } from 'mongoose';

export interface ICompany extends Document {
  _id: string;
  name: string;
  rut: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  address: {
    street: string;
    city: string;
    region: string;
    country: string;
    zipCode?: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  billing: {
    plan: 'basic' | 'professional' | 'enterprise';
    maxDevices: number;
    maxUsers: number;
    features: string[];
    monthlyRate: number;
  };
  subscription: {
    status: 'active' | 'suspended' | 'cancelled';
    startDate: Date;
    endDate?: Date;
    autoRenew: boolean;
  };
  settings: {
    timezone: string;
    currency: string;
    language: string;
    notifications: {
      billingAlerts: boolean;
      systemAlerts: boolean;
      deviceAlerts: boolean;
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>({
  name: { type: String, required: true, trim: true },
  rut: { type: String, required: true, unique: true },
  industry: { type: String, required: true },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'enterprise'],
    required: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    region: { type: String, required: true },
    country: { type: String, default: 'Chile' },
    zipCode: String
  },
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: String
  },
  billing: {
    plan: {
      type: String,
      enum: ['basic', 'professional', 'enterprise'],
      default: 'basic'
    },
    maxDevices: { type: Number, default: 10 },
    maxUsers: { type: Number, default: 5 },
    features: [String],
    monthlyRate: { type: Number, default: 0 }
  },
  subscription: {
    status: {
      type: String,
      enum: ['active', 'suspended', 'cancelled'],
      default: 'active'
    },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    autoRenew: { type: Boolean, default: true }
  },
  settings: {
    timezone: { type: String, default: 'America/Santiago' },
    currency: { type: String, default: 'CLP' },
    language: { type: String, default: 'es' },
    notifications: {
      billingAlerts: { type: Boolean, default: true },
      systemAlerts: { type: Boolean, default: true },
      deviceAlerts: { type: Boolean, default: true }
    }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Índices
companySchema.index({ rut: 1 });
companySchema.index({ 'subscription.status': 1 });
companySchema.index({ isActive: 1 });

export const Company = model<ICompany>('Company', companySchema);
```

## 🔐 Servicios de Autenticación

### src/services/auth.service.ts

```typescript
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.model';
import { Company } from '../models/Company.model';
import { cacheManager } from '../utils/cache';
import { logger } from '../utils/logger';

interface LoginCredentials {
  email: string;
  password: string;
  deviceInfo?: {
    userAgent: string;
    ip: string;
  };
}

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  companyId?: string;
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
  private readonly JWT_EXPIRES_IN = '15m';
  private readonly JWT_REFRESH_EXPIRES_IN = '7d';

  async login(credentials: LoginCredentials) {
    const { email, password, deviceInfo } = credentials;

    // Buscar usuario
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).populate('company');

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar bloqueo
    if (this.isAccountLocked(user)) {
      throw new Error('Cuenta bloqueada temporalmente');
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      await this.handleFailedLogin(user);
      throw new Error('Credenciales inválidas');
    }

    // Reset intentos fallidos
    await this.resetLoginAttempts(user);

    // Generar tokens
    const tokens = await this.generateTokens(user);

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Cache session
    await this.cacheUserSession(user._id, tokens.refreshToken);

    // Log login
    logger.info('Usuario logueado', {
      userId: user._id,
      email: user.email,
      role: user.role,
      ip: deviceInfo?.ip
    });

    return {
      ...tokens,
      user: this.serializeUser(user)
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as TokenPayload;
      
      // Verificar token en cache
      const cachedToken = await cacheManager.get(`refresh_token:${payload.userId}`);
      if (cachedToken !== refreshToken) {
        throw new Error('Token inválido');
      }

      const user = await User.findById(payload.userId).populate('company');
      if (!user || !user.isActive) {
        throw new Error('Usuario no encontrado');
      }

      return await this.generateTokens(user);
    } catch (error) {
      throw new Error('Refresh token inválido');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    // Invalidar refresh token
    await cacheManager.del(`refresh_token:${userId}`);
    
    // Blacklist access token
    if (refreshToken) {
      await cacheManager.set(`blacklist:${refreshToken}`, true, 60 * 60 * 24 * 7);
    }

    logger.info('Usuario deslogueado', { userId });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    companyId?: string;
  }) {
    const { email, password, firstName, lastName, role, companyId } = userData;

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Verificar empresa si no es superadmin
    if (role !== 'superadmin' && companyId) {
      const company = await Company.findById(companyId);
      if (!company) {
        throw new Error('Empresa no encontrada');
      }
    }

    // Crear usuario
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role,
      company: companyId || undefined
    });

    await user.save();

    logger.info('Usuario registrado', {
      userId: user._id,
      email: user.email,
      role: user.role
    });

    return this.serializeUser(user);
  }

  private async generateTokens(user: IUser) {
    const payload: TokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      companyId: user.company?.toString()
    };

    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });

    const refreshToken = jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60 // 15 minutos
    };
  }

  private async cacheUserSession(userId: string, refreshToken: string) {
    await cacheManager.set(`refresh_token:${userId}`, refreshToken, 60 * 60 * 24 * 7);
  }

  private isAccountLocked(user: IUser): boolean {
    return !!(user.lockUntil && user.lockUntil > new Date());
  }

  private async handleFailedLogin(user: IUser) {
    user.loginAttempts += 1;
    
    if (user.loginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
    }
    
    await user.save();
  }

  private async resetLoginAttempts(user: IUser) {
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
    }
  }

  private serializeUser(user: IUser) {
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      avatar: user.avatar,
      company: user.company,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      isEmailVerified: user.isEmailVerified
    };
  }
}

export const authService = new AuthService();
```

## 🛡️ Middleware de Autenticación

### src/middleware/auth.middleware.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { cacheManager } from '../utils/cache';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    // Verificar si el token está en blacklist
    const isBlacklisted = await cacheManager.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Verificar token
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Buscar usuario
    const user = await User.findById(payload.userId).populate('company');
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      company: user.company
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Sin permisos suficientes' });
    }

    next();
  };
};

export const requireSuperAdmin = requireRole(['superadmin']);
export const requireAdmin = requireRole(['admin', 'superadmin']);
export const requireEmpresa = requireRole(['empresa', 'admin', 'superadmin']);
```

### src/middleware/errorHandler.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error en API:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Error de validación de Mongoose
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return res.status(400).json({
      error: 'Error de validación',
      details: errors
    });
  }

  // Error de duplicado (email ya existe)
  if (error.code === 11000) {
    return res.status(400).json({
      error: 'El email ya está registrado'
    });
  }

  // Error de JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }

  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor'
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.path
  });
};
```

## 🎮 Controladores

### src/controllers/auth.controller.ts

```typescript
import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres')
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
  firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
  role: z.enum(['admin', 'empresa', 'cliente']),
  companyId: z.string().optional()
});

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const result = await authService.login({
        email,
        password,
        deviceInfo: {
          userAgent: req.get('User-Agent') || '',
          ip: req.ip || ''
        }
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error en login'
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const userData = registerSchema.parse(req.body);
      
      const user = await authService.register(userData);

      res.status(201).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error en registro'
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token requerido'
        });
      }

      const tokens = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: tokens
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Token inválido'
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const userId = (req as any).user?.id;

      await authService.logout(userId, refreshToken);

      res.json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error en logout'
      });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Error obteniendo perfil'
      });
    }
  }
}

export const authController = new AuthController();
```

### src/controllers/users.controller.ts

```typescript
import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { z } from 'zod';

const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  preferences: z.object({
    language: z.string().optional(),
    timezone: z.string().optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      sms: z.boolean().optional()
    }).optional()
  }).optional()
});

export class UsersController {
  async getUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, role, company } = req.query;
      
      const filter: any = { isActive: true };
      if (role) filter.role = role;
      if (company) filter.company = company;

      const users = await User.find(filter)
        .populate('company', 'name rut')
        .select('-password')
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(filter);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error obteniendo usuarios'
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id)
        .populate('company')
        .select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error obteniendo usuario'
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = updateUserSchema.parse(req.body);

      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('company').select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error actualizando usuario'
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Usuario desactivado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error eliminando usuario'
      });
    }
  }
}

export const usersController = new UsersController();
```

### src/controllers/companies.controller.ts

```typescript
import { Request, Response } from 'express';
import { Company } from '../models/Company.model';
import { z } from 'zod';

const createCompanySchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  rut: z.string().min(8, 'RUT inválido'),
  industry: z.string().min(2, 'Industria requerida'),
  size: z.enum(['small', 'medium', 'large', 'enterprise']),
  address: z.object({
    street: z.string().min(5, 'Dirección requerida'),
    city: z.string().min(2, 'Ciudad requerida'),
    region: z.string().min(2, 'Región requerida'),
    country: z.string().default('Chile'),
    zipCode: z.string().optional()
  }),
  contact: z.object({
    email: z.string().email('Email inválido'),
    phone: z.string().min(8, 'Teléfono inválido'),
    website: z.string().url().optional()
  })
});

export class CompaniesController {
  async getCompanies(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status, size } = req.query;
      
      const filter: any = { isActive: true };
      if (status) filter['subscription.status'] = status;
      if (size) filter.size = size;

      const companies = await Company.find(filter)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ createdAt: -1 });

      const total = await Company.countDocuments(filter);

      res.json({
        success: true,
        data: {
          companies,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error obteniendo empresas'
      });
    }
  }

  async getCompanyById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const company = await Company.findById(id);

      if (!company) {
        return res.status(404).json({
          success: false,
          error: 'Empresa no encontrada'
        });
      }

      res.json({
        success: true,
        data: { company }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error obteniendo empresa'
      });
    }
  }

  async createCompany(req: Request, res: Response) {
    try {
      const companyData = createCompanySchema.parse(req.body);
      
      const company = new Company(companyData);
      await company.save();

      res.status(201).json({
        success: true,
        data: { company }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error creando empresa'
      });
    }
  }

  async updateCompany(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const company = await Company.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!company) {
        return res.status(404).json({
          success: false,
          error: 'Empresa no encontrada'
        });
      }

      res.json({
        success: true,
        data: { company }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Error actualizando empresa'
      });
    }
  }

  async deleteCompany(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const company = await Company.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!company) {
        return res.status(404).json({
          success: false,
          error: 'Empresa no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Empresa desactivada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error eliminando empresa'
      });
    }
  }
}

export const companiesController = new CompaniesController();
```

## 🛣️ Rutas

### src/routes/auth.routes.ts

```typescript
import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Rutas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);

// Rutas protegidas
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.me);

export { router as authRoutes };
```

### src/routes/users.routes.ts

```typescript
import { Router } from 'express';
import { usersController } from '../controllers/users.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para administradores
router.get('/', requireAdmin, usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);
router.delete('/:id', requireAdmin, usersController.deleteUser);

export { router as userRoutes };
```

### src/routes/companies.routes.ts

```typescript
import { Router } from 'express';
import { companiesController } from '../controllers/companies.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', companiesController.getCompanies);
router.get('/:id', companiesController.getCompanyById);
router.post('/', requireAdmin, companiesController.createCompany);
router.put('/:id', requireAdmin, companiesController.updateCompany);
router.delete('/:id', requireAdmin, companiesController.deleteCompany);

export { router as companyRoutes };
```

## 🐳 Docker

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001
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
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    volumes:
      - ./logs:/app/logs

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

## 🚀 Comandos de Inicio

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start

# Con Docker
docker-compose up -d

# Tests
npm test
```

## 📚 Endpoints API

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/refresh-token` - Renovar token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Perfil actual

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Empresas
- `GET /api/companies` - Listar empresas
- `GET /api/companies/:id` - Obtener empresa
- `POST /api/companies` - Crear empresa
- `PUT /api/companies/:id` - Actualizar empresa
- `DELETE /api/companies/:id` - Eliminar empresa

## ✅ Checklist de Setup

- [ ] Crear proyecto con `npm init -y`
- [ ] Instalar dependencias
- [ ] Configurar variables de entorno
- [ ] Copiar código fuente
- [ ] Configurar Redis (Upstash gratuito)
- [ ] Probar con `npm run dev`
- [ ] Verificar health check: `http://localhost:3001/health`
- [ ] Probar login: `POST /api/auth/login`

¡Listo para usar! 🎉 