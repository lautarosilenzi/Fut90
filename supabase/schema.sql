-- ============================================================
-- Fut90 — esquema inicial de Supabase
-- ============================================================
-- Instrucciones: Dashboard de tu proyecto > SQL Editor > pegar todo
-- este archivo > Run. Se puede correr una sola vez; si lo corrés de
-- nuevo con las tablas ya creadas, va a tirar error de "ya existe"
-- (no rompe nada, solo no hace falta repetirlo).
--
-- Diseño pensado para no tener que rehacerlo cuando se agregue la v2
-- (perfiles completos, timeline, seguidores): la tabla `posts` sirve
-- tanto para los mensajes del chat en vivo de un partido (cuando
-- `match_id` no es NULL) como para los futuros posteos de timeline
-- (cuando `match_id` es NULL). Likes, reposts y respuestas funcionan
-- igual para los dos casos.

-- ------------------------------------------------------------
-- profiles: un perfil público por usuario registrado
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-zA-Z0-9_]{3,20}$'),
  display_name text,
  avatar_url text,
  bio text check (char_length(bio) <= 160),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Los perfiles son públicos" on public.profiles
  for select using (true);

create policy "Cada usuario edita solo su propio perfil" on public.profiles
  for update using (auth.uid() = id);

create policy "Cada usuario crea solo su propio perfil" on public.profiles
  for insert with check (auth.uid() = id);

-- Crea el perfil automáticamente cuando alguien se registra.
-- El username sale del formulario de registro (raw_user_meta_data).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'hincha_' || substr(new.id::text, 1, 8)),
    new.raw_user_meta_data ->> 'username'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- posts: mensajes de chat de partido (v1) y timeline (v2)
-- ------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  -- id del partido tal como lo da la capa de datos de fútbol (hoy mock,
  -- después una API real). No es una FK real porque los partidos no
  -- viven en esta base de datos.
  match_id text,
  content text not null check (char_length(content) between 1 and 280),
  parent_post_id uuid references public.posts (id) on delete cascade,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now()
);

create index posts_match_id_idx on public.posts (match_id, created_at);
create index posts_author_id_idx on public.posts (author_id);

alter table public.posts enable row level security;

create policy "Los posteos no borrados son públicos, salvo de bloqueados" on public.posts
  for select using (
    is_deleted = false
    and not exists (
      select 1 from public.blocks
      where blocks.blocker_id = auth.uid()
        and blocks.blocked_id = posts.author_id
    )
  );

create policy "Solo usuarios logueados publican, y a su propio nombre" on public.posts
  for insert with check (auth.uid() = author_id);

create policy "El autor (o un admin) puede borrar su posteo" on public.posts
  for update using (
    auth.uid() = author_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

-- ------------------------------------------------------------
-- likes / reposts (listos para v2, no se usan en la v1)
-- ------------------------------------------------------------
create table public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);

alter table public.likes enable row level security;
create policy "Los likes son públicos" on public.likes for select using (true);
create policy "Cada usuario da like a su propio nombre" on public.likes
  for insert with check (auth.uid() = user_id);
create policy "Cada usuario saca su propio like" on public.likes
  for delete using (auth.uid() = user_id);

create table public.reposts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);

alter table public.reposts enable row level security;
create policy "Los reposts son públicos" on public.reposts for select using (true);
create policy "Cada usuario repostea a su propio nombre" on public.reposts
  for insert with check (auth.uid() = user_id);
create policy "Cada usuario saca su propio repost" on public.reposts
  for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- follows (listo para v2, no se usa en la v1)
-- ------------------------------------------------------------
create table public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

alter table public.follows enable row level security;
create policy "Quién sigue a quién es público" on public.follows for select using (true);
create policy "Cada usuario sigue a su propio nombre" on public.follows
  for insert with check (auth.uid() = follower_id);
create policy "Cada usuario deja de seguir a su propio nombre" on public.follows
  for delete using (auth.uid() = follower_id);

-- ------------------------------------------------------------
-- reports: moderación básica — reportar un posteo o un usuario
-- ------------------------------------------------------------
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  post_id uuid references public.posts (id) on delete cascade,
  reported_user_id uuid references public.profiles (id) on delete cascade,
  reason text not null,
  details text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now(),
  check (post_id is not null or reported_user_id is not null)
);

alter table public.reports enable row level security;

-- A propósito no hay política de SELECT para usuarios comunes: en v1 no
-- hay panel de moderación, los reportes se revisan a mano desde el
-- Table Editor de Supabase con tu cuenta de dueño del proyecto.
create policy "Cualquier usuario logueado puede reportar" on public.reports
  for insert with check (auth.uid() = reporter_id);

-- ------------------------------------------------------------
-- blocks: bloquear usuarios
-- ------------------------------------------------------------
create table public.blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

alter table public.blocks enable row level security;
create policy "Cada usuario ve solo su propia lista de bloqueados" on public.blocks
  for select using (auth.uid() = blocker_id);
create policy "Cada usuario bloquea a su propio nombre" on public.blocks
  for insert with check (auth.uid() = blocker_id);
create policy "Cada usuario desbloquea a su propio nombre" on public.blocks
  for delete using (auth.uid() = blocker_id);

-- ------------------------------------------------------------
-- Realtime: el chat necesita escuchar los inserts nuevos en `posts`
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.posts;

-- ============================================================
-- v2 — sección Tuits: multimedia en posteos + Storage
-- ============================================================
-- Si ya habías corrido la v1 de este archivo, correr solo esto de acá
-- para abajo no rompe nada (usa "if exists"/"if not exists" y
-- "on conflict do nothing" a propósito). Si es la primera vez, correr
-- el archivo entero de punta a punta también funciona.

alter table public.posts
  add column if not exists media_urls text[] not null default '{}';

-- Antes el contenido era obligatorio (1 a 280 caracteres). Ahora un
-- tuit puede ser solo foto/video, sin texto — pero si no tiene
-- multimedia, sigue necesitando al menos 1 caracter.
alter table public.posts drop constraint if exists posts_content_check;
alter table public.posts add constraint posts_content_check check (
  char_length(content) <= 280
  and (char_length(content) >= 1 or array_length(media_urls, 1) >= 1)
);

alter table public.posts add constraint posts_media_urls_check check (
  array_length(media_urls, 1) is null or array_length(media_urls, 1) <= 4
);

create index if not exists posts_parent_post_id_idx on public.posts (parent_post_id);
create index if not exists likes_post_id_idx on public.likes (post_id);
create index if not exists reposts_post_id_idx on public.reposts (post_id);
create index if not exists follows_following_id_idx on public.follows (following_id);

-- Buckets de Storage: multimedia de tuits y fotos de perfil. Públicos
-- para leer (son de un feed público), pero cada usuario solo puede
-- escribir dentro de su propia carpeta (el primer segmento del path
-- tiene que ser su user id — eso lo pone el código de la app solo).
insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Multimedia de tuits es pública para leer" on storage.objects
  for select using (bucket_id = 'post-media');

create policy "Cada usuario sube su propia multimedia" on storage.objects
  for insert with check (
    bucket_id = 'post-media' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Cada usuario borra su propia multimedia" on storage.objects
  for delete using (
    bucket_id = 'post-media' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Fotos de perfil son públicas para leer" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Cada usuario sube su propia foto de perfil" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Cada usuario borra su propia foto de perfil" on storage.objects
  for delete using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
