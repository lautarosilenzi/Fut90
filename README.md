# Fut90

Resultados de fútbol con selector de fecha/calendario, partidos en vivo,
cuotas de ejemplo y notificaciones push por partido, un menú con **más de
50 ligas y copas** de Argentina y el resto del mundo, el **Chat del
hincha** (chat en vivo por partido) y **Tuits**: una red social tipo
Twitter adentro de la app, con perfiles, likes, retuits, respuestas y
fotos/videos.

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
- **Escudos de equipo**: todavía son un círculo de color con las iniciales
  del club (`TeamCrest`), no logos reales — se cambia el día que haya una
  fuente de datos real, sin tocar el resto de los componentes.
- **Cuotas de apuestas**: siempre son de ejemplo, calculadas con una
  fórmula determinística (no vienen de ninguna casa de apuestas real) y
  están marcadas como tal en la pantalla. Ver "Cuotas de apuestas" abajo.
- **Ligas y copas**: el menú de las tres líneas lista más de 50, pero solo
  7 tienen equipos y partidos de ejemplo cargados hoy (`comingSoon: false`
  en `src/lib/football-data/mock/categories.ts`): Liga Profesional,
  Primera Nacional, Primera B Metropolitana, Torneo Federal A, Premier
  League, La Liga y la Champions League. El resto aparece en el menú con
  una etiqueta "Pronto" y muestra "Próximamente" al entrar — están listas
  para el día que se conecte una fuente de datos real.
- **Login, chat en vivo, tuits, perfiles, reportar/bloquear, avisos de
  partido**: código real, funciona en cuanto conectes un proyecto de
  Supabase (gratis) — ver más abajo.

## Conectar Supabase (login + chat en vivo + tuits)

1. Creá una cuenta gratis en [supabase.com](https://supabase.com) y un
   proyecto nuevo.
2. En el proyecto, andá a **SQL Editor**, pegá todo el contenido de
   `supabase/schema.sql` y ejecutalo (`Run`). Esto crea todas las tablas
   (perfiles, tuits, likes, seguidores, avisos de partido...), los
   permisos de seguridad, activa el chat en tiempo real y crea los dos
   buckets de Storage (`post-media` y `avatars`) donde se guardan las fotos
   y videos de los tuits y las fotos de perfil. Las notificaciones push
   necesitan un paso extra de configuración — ver "Notificaciones push"
   más abajo.
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
API y su documentación de endpoints — y confirmar cuáles de las ligas del
menú cubre (varias APIs gratuitas solo tienen Primera División de un país).

## Partidos: fecha, en vivo y ligas

La pantalla de inicio (`/`) y el fixture de cada liga (`/partidos/[liga]`)
tienen:

- **Selector de fecha**: pills de Ayer / Hoy / Mañana, y un botón de
  calendario (ícono 📅) que abre un mini-calendario para elegir cualquier
  fecha. La fecha elegida queda en la URL (`?fecha=YYYY-MM-DD`), así se
  puede compartir o volver atrás con el botón del navegador.
- **En vivo**: un filtro aparte (`?vivo=1`) que muestra solo los partidos
  que están jugándose en este momento, de cualquier fecha.
- **Menú de ligas** (ícono ☰, arriba a la izquierda): las ligas y copas
  pedidas, agrupadas por país, con buscador. Elegir una te lleva a su
  fixture — si todavía no tiene datos de ejemplo carga, muestra
  "Próximamente" en vez de romperse.

Para agregar una liga nueva a la lista corta con datos de ejemplo: sumar
sus equipos en `src/lib/football-data/mock/teams.ts` (con el mismo
`categorySlug`) y poner `comingSoon: false` en su entrada de
`mock/categories.ts` — el generador de fixture/tabla/cuotas funciona para
cualquier categoría con equipos cargados, no hace falta tocar nada más.

## Cuotas de apuestas

Cada partido programado o en vivo muestra una cuota 1X2 (Local / Empate /
Visitante) en su página de detalle, con un cartel bien visible de
**"Valores de ejemplo"**. Se calculan con una fórmula determinística
(`oddsFromSeed` en `src/lib/football-data/mock/random.ts`) a partir del id
del partido — no vienen de ninguna casa de apuestas real ni cambian según
apuestas de nadie. El día que se quiera conectar un proveedor de cuotas de
verdad, ese cálculo es lo único que hay que reemplazar.

## Notificaciones push ("Avisarme")

Cada partido programado tiene un botón **Avisarme** que manda una
notificación push al navegador ~15 minutos antes de que arranque —
funciona aunque tengas la app cerrada, como una notificación de app nativa.

**Cómo activarlo:**

1. Generá un par de claves VAPID (identifican a tu servidor ante los
   navegadores, son gratis y no dependen de ningún proveedor):
   ```bash
   npx web-push generate-vapid-keys
   ```
2. En `.env.local` (ver `.env.local.example`), completá:
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` y `VAPID_PRIVATE_KEY` (las que generó
     el comando de arriba).
   - `SUPABASE_SERVICE_ROLE_KEY`: en tu proyecto de Supabase, **Project
     Settings > API > Project API keys > service_role** (es secreta,
     nunca la pongas en una variable `NEXT_PUBLIC_*`). Hace falta porque
     el proceso que manda los avisos tiene que leer los de todos los
     usuarios, no solo el tuyo.
   - `CRON_SECRET`: cualquier texto random — protege la ruta que manda
     los avisos para que no la pueda llamar cualquiera.
3. Si todavía no corriste la v3 de `supabase/schema.sql` (las tablas
   `push_subscriptions` y `match_reminders`), pegala en el SQL Editor de
   Supabase y ejecutala.

**Quién manda los avisos, en la práctica**: la ruta
`/api/cron/send-match-reminders` revisa qué avisos ya vencieron y los
manda. Algo tiene que llamarla seguido para que el aviso llegue cerca del
horario real del partido:

- **`vercel.json` ya trae un cron una vez por día** (`0 12 * * *`, mediodía
  UTC) — es lo máximo que permite el plan gratis (Hobby) de Vercel; con
  eso solo, un aviso puede llegar hasta 24 hs tarde, así que por sí solo
  no alcanza para "15 minutos antes". Sirve como red de respaldo, no como
  mecanismo principal.
- **Para que llegue de verdad cerca del partido**, sumá un cron externo
  gratis apuntando a la misma ruta cada 5 minutos — por ejemplo
  [cron-job.org](https://cron-job.org), configurado para pegarle a
  `https://tu-dominio.vercel.app/api/cron/send-match-reminders` cada 5
  minutos, mandando el header `Authorization: Bearer TU_CRON_SECRET`. Esto
  funciona en cualquier plan de Vercel, incluido el gratis.
- Si tenés **Vercel Pro**, podés subir la frecuencia del cron de
  `vercel.json` vos mismo (por ejemplo a `*/5 * * * *`) y no hace falta
  nada externo.
- **En local** (`npm run dev`), probalo a mano visitando esa URL en el
  navegador — no hace falta el header si no configuraste `CRON_SECRET`.

Sin `NEXT_PUBLIC_VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` configuradas, el
botón "Avisarme" avisa que las notificaciones no están disponibles — el
resto de la app sigue funcionando igual.

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
    api/cron/           ruta que manda las notificaciones push vencidas
    tuits/              feed y detalle de un tuit
    perfil/[username]/  perfil público, con pestañas
  components/          ui/ layout/ match/ standings/ team/ chat/ timeline/
  lib/
    branding/          nombre de marca + paleta de colores (fuente única)
    football-data/     datos de fútbol (mock hoy, API real después),
                        incluye países, ligas, cuotas de ejemplo
    supabase/          clientes de Supabase (browser, server, admin)
    auth/               registro/login/sesión
    moderation/         reportar y bloquear
    chat/                publicar mensajes en el chat de partido
    timeline/            tuits: queries, acciones, subida de multimedia
    notifications/       suscripción push y avisos "Avisarme" por partido
supabase/schema.sql    script de base de datos (correr una vez en Supabase)
vercel.json            programa el cron de notificaciones en Vercel
public/sw.js           service worker (solo muestra las notificaciones push)
```

## Diseño

Paleta y tipografía centralizadas en `src/lib/branding/colors.ts` (fuente
para JS/TS) y `src/app/globals.css` (tokens que usa Tailwind — mantener
sincronizados, ver comentario en cada archivo). Tipografías: **Bebas Neue**
para títulos y marcadores, **Inter** para texto — cargadas por Google Fonts
vía `next/font`, sin configuración adicional.

## Deploy

Pensado para [Vercel](https://vercel.com) (gratis): conectar el repo de
GitHub, cargar las variables de entorno de `.env.local.example` en la
configuración del proyecto, listo — cada push a la rama principal hace un
deploy nuevo. Las de Supabase (URL + anon key) alcanzan para todo menos
las notificaciones push, que son opcionales (ver esa sección arriba).
