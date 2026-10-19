-- Destila: initial schema (profiles, prompts, usage_log) with Row Level Security.
-- Meta-prompts are NOT stored here: they live in a private source (env or a
-- table created outside this public repo).

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  locale text not null default 'es' check (locale in ('es', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: update own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Users must not upgrade their own plan: only the service role (payments
-- webhook) can change it.
revoke update on public.profiles from authenticated;
grant update (display_name, avatar_url, locale) on public.profiles to authenticated;

-- Create a profile automatically for every new auth user (Google / GitHub).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- prompts: the user's personal library (history, favorites, tags)
-- ---------------------------------------------------------------------------
create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  raw_input text not null,
  result text not null,
  goal text,
  target_model text,
  title text,
  tags text[] not null default '{}',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index prompts_user_created_idx on public.prompts (user_id, created_at desc);

alter table public.prompts enable row level security;

create policy "prompts: read own"
  on public.prompts for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "prompts: insert own"
  on public.prompts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "prompts: update own"
  on public.prompts for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "prompts: delete own"
  on public.prompts for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- usage_log: one row per AI call. Written only by the server (service role,
-- which bypasses RLS). Users can read their own rows; nobody else can write.
-- ---------------------------------------------------------------------------
create table public.usage_log (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles (id) on delete set null,
  provider text not null,
  model text not null,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  cost_usd numeric(12, 6) not null default 0 check (cost_usd >= 0),
  status text not null check (status in ('ok', 'error', 'rejected')),
  created_at timestamptz not null default now()
);

create index usage_log_user_created_idx on public.usage_log (user_id, created_at desc);
create index usage_log_created_idx on public.usage_log (created_at);

alter table public.usage_log enable row level security;

create policy "usage_log: read own"
  on public.usage_log for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Global spend for the kill switch (day 17). Callable only by the server.
create function public.daily_spend_usd(day date default (now() at time zone 'utc')::date)
returns numeric
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(sum(cost_usd), 0)
  from public.usage_log
  where created_at >= day::timestamptz
    and created_at < (day + 1)::timestamptz;
$$;

revoke execute on function public.daily_spend_usd(date) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger prompts_set_updated_at
  before update on public.prompts
  for each row execute function public.set_updated_at();
