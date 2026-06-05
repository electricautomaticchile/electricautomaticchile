# ElectricAutomaticChile - Frontend Web

Frontend Next.js para monitoreo y gestion de consumo electrico, clientes,
empresas, dispositivos IoT, boletas, reportes y administracion.

## Funcionalidades

- Dashboard de clientes con consumo, boletas, notificaciones y soporte.
- Dashboard de empresas para gestion de clientes y dispositivos.
- Vista superadmin para administracion del sistema.
- Autenticacion por cookies `HttpOnly` emitidas por el backend.
- WebSocket/Socket.IO para actualizaciones en tiempo real.
- Reportes, mapas, configuracion, control y monitoreo de dispositivos IoT.
- Blog opcional usando Notion.

## Tecnologias

- Next.js 16.
- React 19.
- TypeScript.
- Tailwind CSS.
- Zustand y TanStack Query.
- Socket.IO Client.
- Nivo/Recharts para graficos.

## Requisitos

- Node.js `>=20.9.0`.
- npm `>=10.0.0`.
- Backend `../electric-backend` disponible.

## Configuracion

Crear `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
JWT_SECRET=clave-local-de-al-menos-32-caracteres
```

Variables opcionales:

```env
NEXT_PUBLIC_SHOW_QUERY_DEVTOOLS=true
NOTION_TOKEN=
NOTION_BLOG_DB_ID=
```

## Desarrollo

```bash
npm install
npm run dev
```

La aplicacion queda disponible en `http://localhost:3000`.

Checks locales:

```bash
npm run lint
npm run typecheck
npm run build
```

Build standalone:

```bash
npm run build
npm run start
```

## Produccion

- Configurar `NEXT_PUBLIC_API_URL` con la URL publica del backend.
- Configurar `NEXT_PUBLIC_WS_URL` si el WebSocket usa una URL distinta.
- Usar el mismo dominio de cookies definido en el backend.
- Ejecutar `npm run lint`, `npm run typecheck` y `npm run build` antes de
  publicar.
- Mantener `JWT_SECRET` fuera de Git y con al menos 32 caracteres.

## Documentacion relacionada

Ver `docs/operacion.md` para variables, autenticacion, blog y checks locales.
