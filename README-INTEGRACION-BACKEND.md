# 🔗 Integración Frontend-Backend - Electric Automatic Chile

## 📋 Resumen de la Integración

Este documento describe la **migración completa** del frontend Next.js para usar el **backend externo** de Electric Automatic Chile (`api-electricautomaticchile`) en lugar de las APIs internas.

## 🚀 ¿Qué se ha implementado?

### ✅ **1. Servicio API Centralizado** (`lib/api/apiService.ts`)
- 🔐 **Autenticación JWT** con renovación automática de tokens
- 🛡️ **Manejo de errores** robusto y automático
- 📝 **TypeScript interfaces** completas para todos los modelos
- 🔄 **Retry automático** en caso de tokens expirados

### ✅ **2. Formulario de Contacto Actualizado** (`app/formulario/page.tsx`)
- 🌐 **Conectado al backend externo** (`POST /api/cotizaciones/contacto`)
- 📁 **Subida de archivos** mantenida (S3)
- 🎯 **Validación mejorada** con mensajes de error específicos
- 📄 **Número de cotización** mostrado al enviar exitosamente

### ✅ **3. Dashboard de Cotizaciones Nuevo** (`dashboard-superadmin/componentes/cotizaciones-dashboard-nuevo.tsx`)
- 📊 **Estadísticas en tiempo real** desde el backend
- 🔍 **Filtros avanzados** (estado, prioridad, búsqueda)
- 📄 **Paginación** completa
- 🔄 **Estados dinámicos** (pendiente → en_revision → cotizando → cotizada → aprobada → convertida_cliente)
- 👤 **Conversión automática a cliente** desde cotizaciones aprobadas
- 💰 **Gestión de cotizaciones** con items, precios y totales

### ✅ **4. Sistema de Autenticación Actualizado** (`app/auth/login/page.tsx`)
- 🔐 **Login con número de cliente** (formato: 123456-7) conectado al backend externo
- 🎨 **Diseño Portal de Clientes** restaurado (fondo negro, tema oscuro)
- ⚡ **Manejo de errores** intuitivo
- 🔄 **Redirección automática** según tipo de usuario (admin/cliente)
- 📧 **Soporte dual**: número de cliente o email

## 🛠️ Configuración Requerida

### **1. Variables de Entorno**
El archivo `.env.local` ya está configurado con:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_BACKEND_HEALTH_CHECK_INTERVAL=30000
```

### **2. Iniciar los Servidores**

#### **Backend (Puerto 4000)**
```bash
cd /c:/Users/pipea/OneDrive/Documents/api-electricautomaticchile
npm run dev
```

#### **Frontend (Puerto 3000)**
```bash
cd /c:/Users/pipea/OneDrive/Documents/electricautomaticchile
npm run dev
```

### **3. Crear Usuarios de Prueba**

#### **Crear Admin de Prueba**
```bash
cd api-electricautomaticchile
node scripts/crear-admin-prueba.js
```

#### **Crear Cliente de Prueba**
```bash
cd api-electricautomaticchile
node scripts/crear-cliente-prueba.js
```

## 🔑 Credenciales de Prueba

### **👑 Administrador**
- **Email**: `admin@electricautomaticchile.com`
- **Contraseña**: `admin123`
- **Acceso**: Dashboard Superadmin

### **👤 Cliente**
- **Número de Cliente**: `123456-7`
- **Contraseña**: `123456`
- **Acceso**: Dashboard Cliente

### **🌐 URL de Login**
- **Portal**: `http://localhost:3000/auth/login`

## 📡 Endpoints Integrados

### **🔐 Autenticación**
- `POST /api/auth/login` - Iniciar sesión con JWT (email o número de cliente)
- `GET /api/auth/me` - Obtener perfil usuario autenticado
- `POST /api/auth/refresh-token` - Renovar token expirado
- `POST /api/auth/logout` - Cerrar sesión

### **💰 Cotizaciones**
- `POST /api/cotizaciones/contacto` - **Formulario de contacto** (público)
- `GET /api/cotizaciones` - Listar cotizaciones con filtros
- `GET /api/cotizaciones/pendientes` - Cotizaciones pendientes
- `GET /api/cotizaciones/estadisticas` - Dashboard de estadísticas
- `GET /api/cotizaciones/:id` - Obtener cotización específica
- `PUT /api/cotizaciones/:id/estado` - Cambiar estado
- `PUT /api/cotizaciones/:id/cotizar` - Agregar datos de cotización
- `POST /api/cotizaciones/:id/convertir-cliente` - **Conversión automática a cliente**

### **🏢 Clientes**
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente

### **👥 Usuarios**
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario

## 🔄 Flujo de Trabajo Unificado

### **📝 1. Formulario de Contacto**
```
Usuario llena formulario → POST /api/cotizaciones/contacto → Cotización creada con estado "pendiente"
```

### **👁️ 2. Revisión en Dashboard**
```
Admin ve cotización → Cambia estado a "en_revision" → Comienza análisis
```

### **💰 3. Preparación de Cotización**
```
Admin cambia a "cotizando" → Agrega items y precios → Estado "cotizada"
```

### **✅ 4. Aprobación**
```
Cliente aprueba → Admin cambia a "aprobada" → Listo para conversión
```

### **👤 5. Conversión a Cliente**
```
Admin clickea "Convertir a Cliente" → POST /api/cotizaciones/:id/convertir-cliente → Cliente creado automáticamente
```

## 🎯 Beneficios de la Integración

### **🔗 Arquitectura Unificada**
- ✅ **Un solo backend** para todo el sistema
- ✅ **APIs RESTful** consistentes y documentadas
- ✅ **Base de datos MongoDB** centralizada
- ✅ **Autenticación JWT** segura

### **⚡ Funcionalidades Nuevas**
- 🎯 **Estados granulares** de cotizaciones
- 📊 **Estadísticas en tiempo real**
- 🔍 **Filtros y búsqueda avanzada**
- 👤 **Conversión automática a cliente**
- 💰 **Gestión completa de cotizaciones**

### **🛡️ Mejoras de Seguridad**
- 🔐 **JWT con refresh tokens**
- 🔄 **Renovación automática**
- 🛡️ **Validación de permisos**
- 🚫 **Protección contra ataques comunes**

### **🎨 Experiencia de Usuario**
- ⚡ **Carga más rápida**
- 🔄 **Actualizaciones en tiempo real**
- 📱 **UI responsiva y moderna**
- 🎯 **Feedback inmediato**

## 🚦 Estados de las Cotizaciones

### **📋 Flujo Completo**
1. **`pendiente`** - Nueva solicitud recibida
2. **`en_revision`** - Admin revisando requisitos
3. **`cotizando`** - Preparando presupuesto
4. **`cotizada`** - Lista para aprobación del cliente
5. **`aprobada`** - Cliente acepta la cotización
6. **`rechazada`** - Cliente rechaza o admin cancela
7. **`convertida_cliente`** - Cliente creado automáticamente

### **🎨 Badges de Prioridad**
- 🔴 **Crítica** - Plazo urgente (1-2 días)
- 🟠 **Alta** - Plazo pronto (3-7 días)
- 🔵 **Media** - Plazo normal (1-2 semanas)
- ⚪ **Baja** - En planificación (1+ mes)

## 🔧 Archivos Principales Modificados

### **📁 Servicios y APIs**
- `lib/api/apiService.ts` - **Servicio API centralizado**
- `lib/hooks/useAuth.ts` - **Hook de autenticación**

### **📱 Componentes Frontend**
- `app/formulario/page.tsx` - **Formulario actualizado**
- `app/auth/login/page.tsx` - **Login con backend externo**
- `app/dashboard-superadmin/cotizaciones/page.tsx` - **Dashboard actualizado**
- `app/dashboard-superadmin/componentes/cotizaciones-dashboard-nuevo.tsx` - **Componente nuevo**

### **⚙️ Configuración**
- `.env.local` - **Variables de entorno del backend**

## 🎯 Próximos Pasos Sugeridos

### **🔧 Opcional - Mejoras Adicionales**
1. **📧 Notificaciones Email** - Integrar con el sistema de emails
2. **🔔 Notificaciones en Tiempo Real** - WebSockets o Server-Sent Events
3. **📊 Dashboard de Analytics** - Métricas y reportes avanzados
4. **📱 PWA** - Convertir a Progressive Web App
5. **🔐 Roles Granulares** - Permisos más específicos

### **🧪 Testing**
1. **🔍 Tests de Integración** - Verificar conexión frontend-backend
2. **⚡ Tests de Performance** - Optimizar velocidad de carga
3. **🛡️ Tests de Seguridad** - Validar autenticación y autorización

## 🆘 Troubleshooting

### **❌ Errores Comunes**

#### **🔗 "Error de conexión"**
```bash
# Verificar que el backend esté corriendo
cd api-electricautomaticchile
npm run dev

# Verificar puerto 4000
curl http://localhost:4000/api/usuarios
```

#### **🔐 "Token inválido"**
- El sistema renueva automáticamente los tokens
- Si persiste, cerrar sesión y volver a entrar

#### **📡 "CORS Error"**
- El backend ya está configurado para CORS
- Verificar que las URLs coincidan en `.env.local`

### **🔧 Debug Mode**
```javascript
// En el navegador (DevTools Console)
localStorage.setItem('debug', 'true');
// Ver logs detallados de las peticiones API
```

## 🎉 ¡Integración Completada!

El frontend ahora está **100% integrado** con el backend externo. Todos los formularios, dashboards y autenticación funcionan de manera unificada con la API REST de `api-electricautomaticchile`.

### **🚀 Para empezar:**
1. Iniciar backend: `npm run dev` en `api-electricautomaticchile`
2. Iniciar frontend: `npm run dev` en `electricautomaticchile`
3. Ir a: `http://localhost:3000/formulario` (público)
4. O login: `http://localhost:3000/auth/login` (admin)

**¡Ya tienes un sistema completo y funcional!** 🎯 