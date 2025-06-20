# Electricautomaticchile - Plataforma IoT de Gestión Eléctrica Inteligente

## 🔌 Descripción del Proyecto

**Electricautomaticchile** es una plataforma IoT empresarial diseñada específicamente para empresas distribuidoras de electricidad en Chile. La plataforma automatiza el proceso completo de gestión del suministro eléctrico, desde la medición del consumo hasta la reposición automática del servicio tras regularización de pagos.

### 🎯 Propósito Principal

Transformar el proceso manual de reposición de servicio eléctrico (que tradicionalmente toma 24-72 horas) en un proceso automatizado que se ejecuta en segundos, reduciendo costos operativos en más del 30% y eliminando reclamos por demoras.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

- **Frontend**: Next.js 14 con TypeScript
- **Backend**: Next.js API Routes + AWS Amplify
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: NextAuth.js
- **Cloud Provider**: AWS (Amplify, S3)
- **IoT**: Dispositivos con GPS integrado y comunicación en tiempo real
- **UI/UX**: Tailwind CSS + Radix UI
- **Monitoreo**: Gráficos con Recharts y Nivo

### Tipos de Usuario

1. **Clientes Finales**: Usuarios residenciales y comerciales
2. **Empresas Distribuidoras**: Gestión operativa de la red
3. **Superadministradores**: Control global del sistema

## 🚀 Características Principales

### Para Empresas Distribuidoras

- **Automatización Completa**: Corte y reconexión automática del servicio
- **Monitoreo en Tiempo Real**: Visualización 24/7 del estado de la red
- **Prevención de Fraude**: Dispositivos IoT con GPS integrado
- **Reducción de Costos**: Eliminación de cuadrillas manuales
- **Cumplimiento Normativo**: Diseñado según lineamientos SEC

### Para Clientes Finales

- **Portal Web Intuitivo**: Gestión completa del servicio eléctrico
- **Monitoreo de Consumo**: Gráficos detallados en tiempo real
- **Gestión de Pagos**: Sistema integrado de facturación
- **Notificaciones**: Alertas automáticas por email y SMS
- **Control de Servicio**: Activación/desactivación remota

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o bun
- MongoDB
- Docker (opcional, para desarrollo con contenedores)

### Instalación Básica

```bash
# Clonar el repositorio
git clone [repository-url]
cd electricautomaticchile

# Instalar dependencias
npm install
# o
bun install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en modo desarrollo
npm run dev
```

### Desarrollo con Docker

```bash
# Iniciar servicios de desarrollo
npm run docker:start

# Ver logs
npm run docker:logs

# Detener servicios
npm run docker:stop
```

## 🧪 Testing

El proyecto incluye una suite completa de pruebas:

```bash
# Ejecutar todas las pruebas
npm test

# Pruebas con coverage
npm run test:coverage

# Pruebas por categoría
npm run test:unit
npm run test:integration
npm run test:auth
npm run test:ui
```

## 📊 Dashboards Disponibles

### Dashboard Cliente (`/dashboard-cliente`)

- Consumo eléctrico en tiempo real
- Historial de pagos y facturas
- Estado del servicio
- Soporte técnico

### Dashboard Empresa (`/dashboard-empresa`)

- Control de dispositivos Arduino
- Estadísticas de consumo sectorial
- Gestión de clientes
- Alertas del sistema

### Dashboard Superadmin (`/dashboard-superadmin`)

- Gestión global de empresas
- Estadísticas globales
- Sistema de mensajería
- Configuración avanzada

## 🔒 Seguridad

- Validación de seguridad automatizada
- Autenticación multi-nivel
- Encriptación de datos sensibles
- Cumplimiento con normativas chilenas
- Monitoreo de accesos y auditoría

## 📋 Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run build        # Build para producción
npm run start        # Iniciar en producción
npm run lint         # Linting
npm test             # Ejecutar pruebas
npm run docker:start # Desarrollo con Docker
```

## 🔧 Configuración de Entorno

Para configuración detallada de variables de entorno, seguridad, y despliegue, consulte la documentación técnica en `/docs`.

## 📚 Documentación Adicional

- [Documentación Técnica Completa](./docs/)
- [Guía de Despliegue](./docs/DEPLOYMENT.md)
- [Configuración de Seguridad](./docs/SECURITY.md)
- [Integración con Arduino](./docs/ARDUINO_INTEGRATION.md)
- [API Reference](./docs/API_REFERENCE.md)

## 📞 Soporte

Para soporte técnico o consultas comerciales:

- **Email**: electricautomaticchile@gmail.com
- **Documentación**: Ver carpeta `/docs`

## ⚖️ Cumplimiento Legal

Esta plataforma ha sido desarrollada considerando las normativas y lineamientos técnicos de la Superintendencia de Electricidad y Combustibles (SEC) de Chile.

---

**Versión**: 0.1.0  
**Última actualización**: Diciembre 2024
