# Plan de Separación Frontend/Backend - ElectricAutomaticChile

## 🎯 Objetivo

Separar el monolito Next.js actual en una arquitectura desacoplada de frontend y backend, comenzando por el sistema de usuarios y autenticación.

## 📋 Estado Actual vs. Objetivo

### Estado Actual (Monolito)
```
┌─────────────────────────────────────┐
│         Next.js Monolito            │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │Dashboard│ │   API   │ │  Auth  │ │
│  │  React  │ │ Routes  │ │NextAuth│ │
│  └─────────┘ └─────────┘ └────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │        MongoDB Atlas           │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Arquitectura Objetivo (Desacoplada)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Backend API    │    │   Database      │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Dashboard   │ │    │ │ Auth API    │ │    │ │ Users       │ │
│ │ Superadmin  │ │    │ │ Users API   │ │    │ │ Sessions    │ │
│ │ Empresa     │ │    │ │ Roles API   │ │    │ │ Companies   │ │
│ │ Cliente     │ │    │ │ JWT Service │ │    │ │ Permissions │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Plan de Implementación

### Fase 1: Backend de Usuarios (2-3 semanas)

#### 1.1 Crear Backend API Independiente

**Stack Recomendado:**
- **Framework**: Express.js + TypeScript
- **Base de Datos**: MongoDB (mantener actual)
- **Autenticación**: JWT + Refresh Tokens
- **Validación**: Zod
- **ORM**: Mongoose
- **Documentación**: Swagger/OpenAPI

#### 1.2 Estructura del Backend

```
backend-api/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── users.controller.ts
│   │   ├── companies.controller.ts
│   │   └── roles.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── rateLimiting.middleware.ts
│   │   └── cors.middleware.ts
│   ├── models/
│   │   ├── User.model.ts
│   │   ├── Company.model.ts
│   │   ├── Role.model.ts
│   │   └── Session.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── companies.routes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── jwt.service.ts
│   │   ├── email.service.ts
│   │   └── cache.service.ts
│   ├── utils/
│   │   ├── database.ts
│   │   ├── logger.ts
│   │   └── config.ts
│   └── types/
│       ├── auth.types.ts
│       ├── user.types.ts
│       └── api.types.ts
├── tests/
├── docs/
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```

### Fase 2: Migración de Autenticación (1-2 semanas)

#### 2.1 Reemplazar NextAuth con JWT personalizado

**Beneficios del cambio:**
- ✅ Control total sobre tokens
- ✅ Refresh tokens seguros
- ✅ Multi-device support
- ✅ API-first approach
- ✅ Mobile app ready

#### 2.2 Flujo de Autenticación Propuesto

```typescript
// Flujo de Login
POST /api/auth/login
{
  "email": "user@company.com",
  "password": "password",
  "deviceInfo": {
    "userAgent": "Mozilla/5.0...",
    "fingerprint": "abc123"
  }
}

// Response
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",
  "user": {
    "id": "user-uuid",
    "email": "user@company.com",
    "role": "admin",
    "company": {
      "id": "company-uuid",
      "name": "Constructora Santiago"
    }
  },
  "expiresIn": 3600
}
```

### Fase 3: Frontend Desacoplado (1-2 semanas)

#### 3.1 Refactorizar Frontend para usar APIs

**Cambios principales:**
- Remover NextAuth
- Implementar client HTTP (Axios/Fetch)
- Context API para estado global
- Interceptors para tokens
- Error handling centralizado

## 🔧 Implementación Práctica

### Paso 1: Crear Backend API

```bash
# Crear proyecto backend
mkdir electricautomaticchile-backend
cd electricautomaticchile-backend
npm init -y

# Instalar dependencias
npm install express typescript @types/express
npm install mongoose bcryptjs jsonwebtoken
npm install cors helmet morgan compression
npm install zod express-rate-limit
npm install winston multer @aws-sdk/client-s3
npm install socket.io redis

# Dependencias de desarrollo
npm install -D @types/node @types/bcryptjs @types/jsonwebtoken
npm install -D @types/cors @types/morgan nodemon ts-node
npm install -D jest @types/jest supertest @types/supertest
```

### Paso 2: Modelos de Base de Datos

#### Usuario Mejorado
```typescript
// models/User.model.ts
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'superadmin' | 'admin' | 'empresa' | 'cliente';
  company?: string; // ObjectId referencia
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
    language: {
      type: String,
      default: 'es'
    },
    timezone: {
      type: String,
      default: 'America/Santiago'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, {
  timestamps: true
});

// Índices para performance
userSchema.index({ email: 1 });
userSchema.index({ company: 1, role: 1 });
userSchema.index({ isActive: 1, role: 1 });

export const User = model<IUser>('User', userSchema);
```

#### Empresa Mejorada
```typescript
// models/Company.model.ts
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
    zipCode: string;
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
  name: {
    type: String,
    required: true,
    trim: true
  },
  rut: {
    type: String,
    required: true,
    unique: true
  },
  industry: {
    type: String,
    required: true
  },
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices
companySchema.index({ rut: 1 });
companySchema.index({ 'subscription.status': 1 });
companySchema.index({ isActive: 1 });

export const Company = model<ICompany>('Company', companySchema);
```

### Paso 3: Servicio de Autenticación

```typescript
// services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.model';
import { Company } from '../models/Company.model';
import { cacheManager } from '../utils/cache';

interface LoginCredentials {
  email: string;
  password: string;
  deviceInfo?: {
    userAgent: string;
    fingerprint: string;
  };
}

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  companyId?: string;
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
  private readonly JWT_EXPIRES_IN = '15m';
  private readonly JWT_REFRESH_EXPIRES_IN = '7d';

  async login(credentials: LoginCredentials) {
    const { email, password, deviceInfo } = credentials;

    // Buscar usuario con empresa
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).populate('company');

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar si la cuenta está bloqueada
    if (this.isAccountLocked(user)) {
      throw new Error('Cuenta bloqueada temporalmente');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      await this.handleFailedLogin(user);
      throw new Error('Credenciales inválidas');
    }

    // Reset login attempts on successful login
    await this.resetLoginAttempts(user);

    // Generar tokens
    const tokens = await this.generateTokens(user);

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Cache user session
    await this.cacheUserSession(user._id, tokens.refreshToken);

    return {
      ...tokens,
      user: this.serializeUser(user)
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as TokenPayload;
      
      // Verificar si el refresh token está en cache
      const cachedToken = await cacheManager.get(`refresh_token:${payload.userId}`);
      if (cachedToken !== refreshToken) {
        throw new Error('Token inválido');
      }

      const user = await User.findById(payload.userId).populate('company');
      if (!user || !user.isActive) {
        throw new Error('Usuario no encontrado');
      }

      // Generar nuevos tokens
      return await this.generateTokens(user);
    } catch (error) {
      throw new Error('Refresh token inválido');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    // Invalidar refresh token del cache
    await cacheManager.invalidate([`refresh_token:${userId}`]);
    
    // Blacklist access token (opcional)
    if (refreshToken) {
      await cacheManager.set(
        `blacklist:${refreshToken}`,
        true,
        { ttl: 60 * 60 * 24 * 7 } // 7 días
      );
    }
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
      expiresIn: 15 * 60 // 15 minutos en segundos
    };
  }

  private async cacheUserSession(userId: string, refreshToken: string) {
    await cacheManager.set(
      `refresh_token:${userId}`,
      refreshToken,
      { ttl: 60 * 60 * 24 * 7 } // 7 días
    );
  }

  private isAccountLocked(user: IUser): boolean {
    return !!(user.lockUntil && user.lockUntil > new Date());
  }

  private async handleFailedLogin(user: IUser) {
    user.loginAttempts += 1;
    
    // Bloquear después de 5 intentos fallidos
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
      role: user.role,
      avatar: user.avatar,
      company: user.company,
      preferences: user.preferences,
      lastLogin: user.lastLogin
    };
  }
}
```

## 🎯 Beneficios de esta Separación

### Técnicos
- **Escalabilidad independiente**: Frontend y backend pueden escalar por separado
- **Desarrollo paralelo**: Equipos pueden trabajar independientemente
- **Reutilización**: APIs pueden usarse para web, móvil, y terceros
- **Performance**: Mejor caching y optimización por capas
- **Testing**: Más fácil testear APIs por separado

### De Negocio
- **Time to market**: Desarrollos más rápidos
- **Mobile ready**: Base para app móvil nativa
- **API pública**: Futuro marketplace de integraciones
- **Mantenimiento**: Código más organizado y mantenible

## ⚡ Cronograma de Migración

### Semana 1-2: Backend Setup
- [ ] Configurar proyecto backend
- [ ] Migrar modelos de base de datos
- [ ] Implementar autenticación JWT
- [ ] APIs básicas de usuarios

### Semana 3: Integración
- [ ] Refactorizar frontend para usar APIs
- [ ] Implementar interceptors HTTP
- [ ] Manejo de estados global
- [ ] Testing de integración

### Semana 4: Optimización
- [ ] Performance tuning
- [ ] Security hardening
- [ ] Documentación API
- [ ] Deploy en producción

## 🚨 Consideraciones Importantes

### Base de Datos
- **No migrar datos**: Mantener MongoDB actual
- **Conexión dual**: Backend se conecta a misma BD
- **Migración gradual**: Ir moviendo funcionalidades poco a poco

### Autenticación
- **Período de transición**: Mantener NextAuth mientras migras
- **Feature flags**: Activar/desactivar nuevo sistema
- **Rollback plan**: Poder volver al sistema anterior

### Frontend
- **Mantener rutas**: No cambiar URLs existentes
- **Progressive enhancement**: Mejorar gradualmente
- **Error boundaries**: Manejo robusto de errores

¿Te parece bien este enfoque? ¿Quieres que profundice en alguna parte específica o comenzamos con la implementación del backend de usuarios? 