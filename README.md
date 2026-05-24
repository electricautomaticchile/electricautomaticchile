# Electric Automatic Chile - Frontend

Aplicación web para monitoreo y gestión de consumo eléctrico en tiempo real con dispositivos IoT.

## 🚀 ¿Qué hace este proyecto?

Frontend desarrollado en Next.js que permite:

- **Dashboard de Clientes**: Visualización en tiempo real del consumo eléctrico desde dispositivos Arduino
- **Dashboard de Empresas**: Gestión de múltiples clientes y sus dispositivos
- **Dashboard de Superadmin**: Administración completa del sistema
- **Autenticación JWT**: Sistema seguro de login y gestión de sesiones
- **WebSocket en tiempo real**: Actualización automática de datos de consumo cada 5 segundos
- **Gestión de dispositivos IoT**: Asignación y monitoreo de dispositivos Arduino

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con SSR
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Socket.IO Client** - WebSocket para datos en tiempo real
- **Zustand** - Gestión de estado global
- **Recharts** - Gráficos de consumo

## 📦 Instalación

```bash
npm install
```

## 🔧 Configuración

Crea un archivo `.env.local` con las siguientes variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:5000
JWT_SECRET=tu_secret_key_aqui
```

## 🚀 Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📚 Documentación Detallada

Para más información sobre variables, autenticación, blog y checks locales, consulta [`docs/operacion.md`](./docs/operacion.md).

## 🔗 Proyectos Relacionados

- [API Backend](../api-electricautomaticchile/)
- [WebSocket API](../Websocket-api/)
