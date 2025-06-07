# Electric Automatic Chile - Frontend Application 🔌⚡

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Status](https://img.shields.io/badge/Status-Frontend%20Ready-brightgreen.svg)]()

Aplicación frontend moderna para la gestión de dispositivos IoT, clientes y análisis energético de Electric Automatic Chile.

## 🚀 Características Principales

### 🎨 Interfaz de Usuario Moderna
- **Next.js 14** con App Router y React 18
- **Diseño responsive** con Tailwind CSS
- **Componentes UI** con Radix UI + ShadCN/UI
- **Modo oscuro/claro** con next-themes
- **Animaciones fluidas** con Tailwind CSS Animate

### 📊 Dashboards Interactivos
- **Visualizaciones avanzadas** con Nivo y Recharts
- **Métricas en tiempo real** para monitoreo energético
- **Dashboards diferenciados** por roles de usuario
- **Exportación de reportes** en PDF y CSV
- **Filtros avanzados** y análisis temporal

### 🔐 Autenticación y Seguridad
- **NextAuth.js** para autenticación segura
- **Roles y permisos** granulares
- **Sesiones persistentes** y renovación automática
- **Protección de rutas** basada en roles
- **Formularios seguros** con validación Zod

### 💬 Comunicación y Formularios
- **Formularios de contacto** optimizados
- **Lead magnets** con descarga de PDFs
- **Integración con email** (Resend + Nodemailer)
- **Notificaciones toast** para feedback del usuario

### 📱 Responsividad y UX
- **Diseño mobile-first** completamente responsive
- **PWA ready** para instalación en dispositivos
- **Performance optimizada** con Next.js
- **SEO optimizado** con metadatos dinámicos

## 🏗️ Arquitectura Frontend

```
┌─────────────────────────────────────────────────────────────┐
│                 ELECTRIC AUTOMATIC CHILE                   │
│                   FRONTEND ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WEB BROWSERS  │    │   MOBILE APPS   │    │    TABLETS      │
│                 │    │                 │    │                 │
│ • Chrome        │    │ • iOS Safari   │    │ • iPad          │
│ • Firefox       │    │ • Android      │    │ • Android       │
│ • Safari        │    │ • WebView      │    │ • Surface       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   NEXT.JS APP   │
                    │                 │
                    │ • App Router    │
                    │ • SSR/SSG       │
                    │ • API Routes    │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI LAYER      │    │   DATA LAYER    │    │   SERVICES      │
│                 │    │                 │    │                 │
│ • React         │    │ • NextAuth      │    │ • Resend Email  │
│ • Radix UI      │    │ • Zod Schemas   │    │ • AWS S3        │
│ • Tailwind      │    │ • Local State   │    │ • Transbank     │
│ • Recharts      │    │ • Form State    │    │ • External APIs │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   DEPLOYMENT    │
                    │                 │
                    │ • AWS Amplify   │
                    │ • Vercel        │
                    │ • CDN Global    │
                    └─────────────────┘
```

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js 18.x
- **Framework**: Next.js 14.x (App Router)
- **Lenguaje**: TypeScript 5.x
- **UI Framework**: React 18.x
- **Estilos**: Tailwind CSS 3.x
- **Componentes**: Radix UI + ShadCN/UI
- **Gráficos**: Recharts + Nivo
- **Autenticación**: NextAuth.js
- **Formularios**: React Hook Form + Zod
- **Email**: Resend + Nodemailer
- **Cloud Storage**: AWS S3
- **Pagos**: Transbank SDK
- **Testing**: Jest + React Testing Library
- **Deployment**: AWS Amplify

## 📦 Instalación

### Prerrequisitos
- Node.js 18.x o superior
- npm, yarn o bun

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/electric-automatic-chile/frontend.git
cd frontend
```

2. **Instalar dependencias**
```bash
npm install
# o usando bun (recomendado)
bun install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con tus configuraciones
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
# o
bun dev
```

5. **Construir para producción**
```bash
npm run build
npm start
```

## ⚙️ Variables de Entorno

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# MongoDB (para sesiones)
MONGODB_URI=mongodb://localhost:27017/electric-automatic-chile

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@electricautomaticchile.com

# AWS S3 (para archivos)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Transbank (pagos)
TRANSBANK_API_KEY=your-transbank-key
TRANSBANK_ENVIRONMENT=production

# API Backend (si existe)
NEXT_PUBLIC_API_URL=https://api.electricautomaticchile.com
```

## 📚 Rutas y Páginas

### 🏠 Páginas Públicas
```
/                     # Landing page
/acercade            # Sobre nosotros
/navservices         # Servicios
/formulario          # Formulario de contacto
/terminosycondiciones # Términos y condiciones
/auth/login          # Iniciar sesión
/auth/register       # Registro
```

### 🔐 Páginas Protegidas
```
/dashboard-cliente        # Dashboard del cliente
/dashboard-empresa       # Dashboard de empresa
/dashboard-superadmin    # Panel de superadministrador
```

### 📡 API Routes (Internas)
```
/api/lead-magnet         # Descarga de PDF promocional
/api/envioformulario     # Procesamiento de formularios
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 🎨 Desarrollo de UI

### Estructura de Componentes
```
components/
├── ui/              # Componentes base (ShadCN/UI)
├── forms/           # Formularios reutilizables
├── charts/          # Componentes de gráficos
├── layout/          # Componentes de layout
└── dashboard/       # Componentes específicos de dashboard

app/
├── (public)/        # Rutas públicas
├── (protected)/     # Rutas protegidas
├── api/             # API Routes de Next.js
└── globals.css      # Estilos globales
```

### Scripts Disponibles
```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run lint:fix     # Corregir errores de linting
npm run type-check   # Verificación de tipos TypeScript
```

## 🚀 Despliegue

### AWS Amplify
```bash
# Configurar Amplify
amplify init
amplify add hosting
amplify publish
```

### Vercel
```bash
# Desplegar a Vercel
vercel --prod
```

### Docker
```bash
# Construir imagen
docker build -t electric-automatic-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 electric-automatic-frontend
```

## 📱 Características Responsive

- **Mobile First**: Diseñado primero para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Botones y elementos optimizados para touch
- **Performance**: Lazy loading y optimización de imágenes

## 🎯 Funcionalidades por Rol

### 👤 Cliente
- Dashboard personal con métricas energéticas
- Histórico de consumo y facturas
- Solicitudes de servicio técnico
- Descarga de reportes personalizados

### 🏢 Empresa
- Panel de gestión de múltiples clientes
- Analytics consolidados
- Gestión de dispositivos IoT
- Reportes empresariales

### ⚡ Super Admin
- Control total del sistema
- Gestión de usuarios y permisos
- Métricas del sistema completo
- Configuración global

## 📈 Performance y Optimización

- **Core Web Vitals** optimizados
- **Bundle splitting** automático con Next.js
- **Image optimization** con next/image
- **Font optimization** con next/font
- **Static generation** para páginas que no cambian
- **Incremental static regeneration** para contenido dinámico

## 🔧 Configuración Avanzada

### Middleware
```typescript
// middleware.ts - Protección de rutas
export function middleware(request: NextRequest) {
  // Lógica de autenticación y redirecciones
}
```

### Configuración de Next.js
```javascript
// next.config.mjs
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['your-domain.com'],
  },
  // Más configuraciones...
};
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

- **Email**: soporte@electricautomaticchile.com
- **Documentación**: [docs.electricautomaticchile.com](https://docs.electricautomaticchile.com)
- **Issues**: [GitHub Issues](https://github.com/electric-automatic-chile/frontend/issues)

---

**Desarrollado con ❤️ por el equipo de Electric Automatic Chile**

## ✅ Estado del Proyecto Frontend

### Progreso Completado: **100%** 🎉

- ✅ **UI/UX**: Diseño moderno y responsive
- ✅ **Autenticación**: NextAuth.js integrado
- ✅ **Dashboards**: Visualizaciones interactivas
- ✅ **Formularios**: Contacto y lead magnets
- ✅ **Performance**: Optimizado para producción

### Estadísticas Finales
- **Framework**: Next.js 14 con App Router
- **Componentes**: 50+ componentes reutilizables
- **Páginas**: 10+ rutas implementadas
- **Testing**: Jest + React Testing Library
- **Deployment**: AWS Amplify ready


