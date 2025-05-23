![Logo](https://electricautomaticchile-data.s3.amazonaws.com/favicon.png)


# Electricautomaticchile

Desarrollar y ofrecer soluciones tecnológicas innovadoras que optimicen la gestión del suministro eléctrico, contribuyendo a la eficiencia energética, la reducción de costos y la sostenibilidad ambiental, para el beneficio de nuestros clientes y la comunidad.


## Instalacion y uso fisico/software

- Se instala un dispositivo dentro del medidor de luz.
- Se utiliza una plataforma web para administrar y programar cortes de servicio.
- Se toma automáticamente la lectura del consumo energético y se envía un reporte a la plataforma web y cliente.
- Se puede hacer una reposición automatizada o programada a distancia del suministro electrico.
- Se puede generar reportes de consumo del suministro electrico de los 3 meses de consumo.
- Control y gestion del consumo electrico.

## Colores Bases

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Primario | ![#e66100](https://via.placeholder.com/10/e66100?text=+) #e66100|
| Primario | ![#f8f8f8](https://via.placeholder.com/10/000000?text=+) #000000 
| Secundario | ![#FFFFFF](https://via.placeholder.com/10/FFFFFF?text=+) #FFFFFF 



## Demo

https://main.d31trp39fgtk7e.amplifyapp.com/


## ejecutar en local

Clonar el repositorio

```bash
  git clone https://github.com/electricautomaticchile/electricautomaticchile
```

Ir al directorio

```bash
  cd electricautomaticchile
```

Configurar variables de entorno

```bash
  # Copiar el archivo de ejemplo
  cp .env.example .env.local
  
  # Editar .env.local con tus credenciales reales
  # ⚠️ IMPORTANTE: Nunca subas archivos .env con credenciales reales al repositorio
```

instalar dependencias

```bash
  bun install
```

Iniciar el servidor local

```bash
  bun run dev
```

## Variables de entorno

Para configurar las variables de entorno:

1. **Copia el archivo de ejemplo**: `cp .env.example .env.local`
2. **Edita `.env.local`** con tus credenciales reales
3. **Consulta `.env.example`** para ver todas las variables necesarias y sus descripciones

### Variables críticas que necesitas configurar:

- `MONGODB_URI`: Cadena de conexión a tu base de datos MongoDB
- `NEXTAUTH_SECRET`: Secreto para autenticación (generar con `openssl rand -base64 32`)
- `GOOGLE_ID` y `GOOGLE_SECRET`: Credenciales de Google OAuth
- Credenciales de AWS S3 para almacenamiento de archivos
- API keys para servicios de correo electrónico

**🔒 IMPORTANTE**: 
- Nunca compartas tus credenciales reales
- Usa secretos únicos y complejos para cada entorno
- Mantén las credenciales de producción separadas de desarrollo

## Producción

Para sacar a Producción (solo tendran permiso las personas designadas para sacar a Producción, una vez haya pasado las pruebas unitarias y se haya documentado el proceso).


## Documentación


Framework
|-------------------|
[Next.js /app](https://nextjs.org/docs)
[Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
[React](https://es.react.dev/learn)


UIX
|-------------------|
[Tailwindcss](https://tailwindcss.com/docs/installation)
[Lucide](https://lucide.dev/icons/)
[Shadcn](https://ui.shadcn.com/docs)
[Nivo](https://nivo.rocks/components/)

Base de datos
| ----------------- | 
[MongoAtlas](https://www.mongodb.com/docs/atlas/getting-started/)


AWS
| ----------------- | 
[AWS Amplify](https://docs.aws.amazon.com/es_es/amplify/latest/userguide/welcome.html)
[AWS Lambda](https://docs.aws.amazon.com/es_es/lambda/latest/dg/welcome.html)
[Amazon S3](https://docs.aws.amazon.com/es_es/AmazonS3/latest/userguide/Welcome.html)
[Amazon DocumentDB (con compatibilidad con MongoDB)](https://docs.aws.amazon.com/es_es/documentdb/latest/developerguide/what-is.html)
[Amazon EC2](https://docs.aws.amazon.com/es_es/AWSEC2/latest/UserGuide/concepts.html)
[AWS IoT Core](https://docs.aws.amazon.com/es_es/iot/?icmpid=docs_homepage_iot)
[AWS IoT Analytics](https://docs.aws.amazon.com/es_es/iot-device-defender/?icmpid=docs_homepage_iot)
[AWS IoT Device Management](https://docs.aws.amazon.com/es_es/iot-device-management/?icmpid=docs_homepage_iot)
[AWS IoT Events](https://docs.aws.amazon.com/es_es/iotevents/?icmpid=docs_homepage_iot)

Librerias
|-----------------|
[Auth.js](https://authjs.dev/getting-started/installation?framework=next.js)


## Caracteristicas

- Dark mode toggle
- Dashboard
- Responsive desing
- Navbar
- Base de datos implementada
- UIX


## Roadmap

- Additional browser support

- Add more integrations


## Screenshots
**Esta screen es la fase de inicial para el diseño(se puede ir modificando a lo largo del tiempo)**

![App Screenshot](https://electricautomaticchile-data.s3.amazonaws.com/Untitled-2024-05-17-2329.png)


## Soporte

Para cualquier problema o duda contactarse a electricautomaticchile@gmail.com.


## Stack de técnologia usada hasta el momento

**Client:** Next.js,React, Redux, TailwindCSS, Django

**Server:** Node, Express, SQL , Mongodb, Python,C#

**Cloud Computing:** Amazon web services


## Clientes

- Chilquinta


