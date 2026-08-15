# Fut90

Resultados en vivo del fútbol argentino (Liga Profesional, Primera Nacional,
Primera B Metropolitana y Torneo Federal A) con el **Chat del hincha** (un
chat en vivo por partido) y **Tuits**: una red social tipo Twitter adentro de
la app, con perfiles, likes, retuits, respuestas y fotos/videos.

> El nombre "Fut90" está centralizado en `src/lib/branding/config.ts`. Si
> cambia más adelante, se edita ahí y en ningún otro lado.

## Cómo correr esto en tu máquina

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000`. Vas a ver toda la app funcionando con datos de
ejemplo (resultados, fixture, posiciones, fichas de equipo) sin necesitar
ninguna cuenta externa. El login y el chat en vivo van a mostrar un aviso de
"todavía no conectado" hasta que sigas los pasos de abajo.

## Qué es real y qué es de ejemplo hoy

- **Resultados, fixture, posiciones, equipos**: datos de ejemplo (mock),
  generados con fechas relativas a "hoy" para que la demo siempre se vea
  viva. Viven en `src/lib/football-data/mock/`.
- **Login, chat en vivo, tuits, perfiles, reportar/bloquear**: código real,
  funciona en cuanto conectes un proyecto de Supabase (gratis) — ver más
  abajo.

## Conectar Supabase (login + chat en vivo + tuits)

1. Creá una cuenta gratis en [supabase.com](https://supabase.com) y un
   proyecto nuevo.
2. En el proyecto, andá a **SQL Editor**, pegá todo el contenido de
   `supabase/schema.sql` y ejecutalo (`Run`). Esto crea las tablas, los
   permisos de seguridad, activa el chat en tiempo real y crea los dos
   buckets de Storage (`post-media` y `avatars`) donde se guardan las fotos
   y videos de los tuits y las fotos de perfil.
3. Andá a **Authentication > Sign In / Providers > Email** y **desactivá
   "Confirm email"**. Así, cuando alguien se registra, entra directo sin
   tener que confirmar un mail (más adelante, si querés, se puede prender
   esto — pero necesita configurar un proveedor de emails aparte).
4. Andá a **Project Settings > API** y copiá el **Project URL** y la
   **anon public key**.
5. Copiá `.env.local.example` a `.env.local` y pegá esos dos valores:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
   ```
6. Reiniciá `npm run dev`. El login (`/login`, `/registro`), el chat de
   partido y la sección Tuits (`/tuits`) ya deberían funcionar.

> Si tu proyecto de Supabase usa un dominio propio (no `*.supabase.co`),
> agregalo también en `images.remotePatterns` de `next.config.ts` — si no,
> las fotos de los tuits no se van a poder mostrar con `next/image`.

Para desplegar en Vercel, esas mismas dos variables se cargan en
**Project Settings > Environment Variables** del proyecto en Vercel.

**Importante**: el proyecto gratis de Supabase se pausa solo después de 7
días sin uso. Si un día el login deja de andar, probablemente sea eso — se
reactiva con un click desde el dashboard de Supabase.

## Conectar una API real de resultados

Hoy los partidos son de ejemplo. Toda la app llama siempre a las funciones
de `src/lib/football-data/index.ts` (nunca a los datos mock directamente),
así que conectar una API real es:

1. Crear `src/lib/football-data/adapters/api-real-adapter.ts` que
   implemente la misma interfaz que `mock-adapter.ts` (ver
   `adapters/adapter.ts`).
2. Guardar la clave de la API como variable de entorno.
3. Cambiar una línea en `src/lib/football-data/index.ts` (está marcada con
   comentarios) para usar el adapter nuevo en vez del mock.

Cuando llegue el momento, lo que necesito de tu parte: la clave/token de la
API y su documentación de endpoints — y confirmar que cubre las 4
categorías (varias APIs gratuitas solo tienen Primera División).

## La sección Tuits

`/tuits` es un timeline público al estilo Twitter/X, adentro de la misma
app:

- **Publicar tuits** de hasta 280 caracteres, con hasta 4 fotos o videos.
- **Likes** y **retuits**, con contador y actualización optimista (se ve el
  cambio al toque, se corrige solo si la base de datos lo rechaza).
- **Respuestas**: cada tuit tiene su propia página (`/tuits/[id]`) con el
  hilo de respuestas.
- **Perfiles** (`/perfil/[usuario]`): bio, foto, seguidores/seguidos,
  botón de seguir, y pestañas de Tuits / Respuestas / Multimedia / Me
  gusta. El dueño del perfil puede editarlo (nombre, bio, foto) desde ahí
  mismo.
- El feed principal se actualiza en vivo entre pestañas/usuarios (Supabase
  Realtime), igual que el chat de partido.
- Reportar/bloquear funciona igual que en el chat (mismo botón "···" en
  cada tuit).

Las fotos y videos se suben directo desde el navegador al bucket
`post-media` de Supabase Storage (y las fotos de perfil a `avatars`), cada
usuario solo puede escribir dentro de su propia carpeta — la seguridad la
da Row Level Security, no el código de la app.

## Moderación

Desde el día 1 hay **reportar** y **bloquear usuario**, tanto en el chat
como en los tuits. Los reportes se guardan en la tabla `reports` de
Supabase; en esta v1 no hay panel de moderación todavía, así que se
revisan a mano desde el **Table Editor** del dashboard de Supabase.
Bloquear a alguien oculta su contenido para vos (no para el resto).

## Estructura del proyecto

```
src/
  app/                 rutas (Next.js App Router)
    tuits/              feed y detalle de un tuit
    perfil/[username]/  perfil público, con pestañas
  components/          ui/ layout/ match/ standings/ team/ chat/ timeline/
  lib/
    branding/          nombre de marca + paleta de colores (fuente única)
    football-data/     datos de fútbol (mock hoy, API real después)
    supabase/          clientes de Supabase (browser y server)
    auth/               registro/login/sesión
    moderation/         reportar y bloquear
    chat/                publicar mensajes en el chat de partido
    timeline/            tuits: queries, acciones, subida de multimedia
supabase/schema.sql    script de base de datos (correr una vez en Supabase)
```

## Diseño

Paleta y tipografía centralizadas en `src/lib/branding/colors.ts` (fuente
para JS/TS) y `src/app/globals.css` (tokens que usa Tailwind — mantener
sincronizados, ver comentario en cada archivo). Tipografías: **Bebas Neue**
para títulos y marcadores, **Inter** para texto — cargadas por Google Fonts
vía `next/font`, sin configuración adicional.

## Deploy

Pensado para [Vercel](https://vercel.com) (gratis): conectar el repo de
GitHub, cargar las dos variables de Supabase en la configuración del
proyecto, listo — cada push a la rama principal hace un deploy nuevo.
