# Operacion del Frontend

## Variables requeridas

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
JWT_SECRET=clave-local-de-al-menos-32-caracteres
```

## Blog con Notion

El blog usa `NOTION_TOKEN` y `NOTION_BLOG_DB_ID`. Si no estan configuradas, el sitio compila igual y el blog queda sin articulos publicados.

```env
NOTION_TOKEN=secret_xxx
NOTION_BLOG_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Autenticacion

El backend debe emitir `auth_token` y `refresh_token` como cookies `HttpOnly`.
El frontend solo guarda cookies no sensibles, como `user_data`, para pintar navegacion y datos basicos de UI.

En desarrollo local no es necesario configurar dominio de cookie. En produccion con API en subdominio, configurar el backend con:

```env
AUTH_COOKIE_DOMAIN=.electricautomaticchile.com
CORS_ORIGINS=https://electricautomaticchile.com
```

## Checks locales

```bash
npm run lint
npm run build
```

Para validar el backend relacionado:

```bash
cd ../electric-backend
go test ./...
```
