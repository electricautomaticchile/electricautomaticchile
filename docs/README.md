# ElectricAutomaticChile - Documentación

## Descripción del Proyecto

ElectricAutomaticChile es una aplicación web para la gestión y monitoreo de sistemas eléctricos automatizados. La plataforma permite a usuarios y empresas visualizar datos de consumo energético, administrar dispositivos remotos, y generar reportes detallados.

## Tecnologías Principales

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Gráficos**: Nivo (basado en D3.js)
- **Autenticación**: NextAuth.js y AWS Amplify
- **Validación**: Zod
- **Testing**: Jest y React Testing Library

## Estructura Modular

La aplicación está organizada en módulos funcionales:

1. **Autenticación y Gestión de Usuarios**
   - Registro, inicio de sesión y recuperación de contraseña
   - Gestión de perfiles y roles

2. **Dashboard de Usuario**
   - Visualización de consumo energético
   - Gestión de dispositivos personales
   - Historial de actividad

3. **Dashboard Empresarial**
   - Monitoreo en tiempo real de sistemas
   - Gestión de reposiciones y cortes
   - Análisis avanzado de datos

4. **API RESTful**
   - Endpoints documentados con Swagger
   - Validación de datos con Zod
   - Manejo centralizado de errores

## Arquitectura

La aplicación utiliza la arquitectura de App Router de Next.js, con un enfoque modular y escalable:

```
+-------------+      +-----------+      +------------+
|   Cliente   | <--> |  API REST | <--> |   MongoDB  |
|  (Next.js)  |      | (Next.js) |      |            |
+-------------+      +-----------+      +------------+
       |                  ^
       v                  |
+-------------+      +-----------+
|    Hooks    | <--> |  Contexto |
| Componentes |      |    API    |
+-------------+      +-----------+
```

## Flujo de Desarrollo

1. **Instalación**: `bun install`
2. **Desarrollo**: `bun dev`
3. **Testing**: `bun test`
4. **Build**: `bun build`

## Componentes Principales

### Gráficos Interactivos

La aplicación utiliza una versión mejorada de los componentes de Nivo para gráficos, implementados en `components/ui/enhanced-chart.tsx`. Estos componentes ofrecen:

- Animaciones fluidas
- Exportación de datos a CSV
- Zoom interactivo
- Personalización de colores

### Gestión de Dispositivos

El sistema permite manejar diferentes tipos de dispositivos a través de un diseño modular:

- LED
- Sensores
- Relés
- Interruptores
- Medidores
- Gateways

Cada tipo de dispositivo tiene su propia interfaz en TypeScript y puede ser extendido mediante el tipo `Custom`.

## API RESTful

La API sigue principios REST y ofrece las siguientes funcionalidades principales:

- Gestión de dispositivos (CRUD)
- Autenticación y autorización
- Reportes y exportación de datos
- Operaciones en tiempo real

## Enlaces Útiles

- [Guía de Estilo](./STYLEGUIDE.md)
- [Documentación de API](./API.md)
- [Guía de Contribución](./CONTRIBUTING.md)

## Licencia

Este proyecto es propiedad de ElectricAutomaticChile. Todos los derechos reservados. 