create extension if not exists pgcrypto;

create table if not exists public.surprises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  recipient text not null,
  sender text not null default 'Un être cher',
  message text not null,
  theme text not null default 'rose',
  question text not null,
  answer text not null,
  occasion text not null default 'Autre',
  tone text not null default 'Romantique',
  music_url text default '',
  photos text default '',
  unlock_date timestamptz default null,
  slug text not null unique default encode(gen_random_bytes(8),'hex'),
  published boolean not null default false,
  views integer not null default 0,
  created_at timestamptz not null default now()
);

-- Migrations/Alter statements
alter table public.surprises add column if not exists sender text not null default 'Un être cher';
alter table public.surprises add column if not exists occasion text not null default 'Autre';
alter table public.surprises add column if not exists tone text not null default 'Romantique';
alter table public.surprises add column if not exists music_url text default '';
alter table public.surprises add column if not exists photos text default '';
alter table public.surprises add column if not exists unlock_date timestamptz default null;

create table if not exists public.surprise_views (
  id uuid primary key default gen_random_uuid(),
  surprise_id uuid not null references public.surprises(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.surprises enable row level security;
alter table public.surprise_views enable row level security;

create policy "owners can read surprises" on public.surprises for select to authenticated using (auth.uid() = user_id);
create policy "owners can create surprises" on public.surprises for insert to authenticated with check (auth.uid() = user_id);
create policy "owners can update surprises" on public.surprises for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners can delete surprises" on public.surprises for delete to authenticated using (auth.uid() = user_id);

-- Drop function first to allow return type modification
drop function if exists public.get_public_surprise(text);

create or replace function public.get_public_surprise(surprise_slug text)
returns table (
  id uuid,
  title text,
  recipient text,
  sender text,
  message text,
  theme text,
  question text,
  published boolean,
  occasion text,
  tone text,
  music_url text,
  photos text,
  unlock_date timestamptz
)
language sql security definer set search_path = '' as $$
  select s.id, s.title, s.recipient, s.sender, s.message, s.theme, s.question, s.published, s.occasion, s.tone, s.music_url, s.photos, s.unlock_date
  from public.surprises s where s.slug = surprise_slug and s.published = true limit 1;
$$;

create or replace function public.verify_surprise_answer(surprise_slug text, provided_answer text)
returns boolean language sql security definer set search_path = '' as $$
  select exists (select 1 from public.surprises s where s.slug = surprise_slug and s.published = true and lower(trim(s.answer)) = lower(trim(provided_answer)));
$$;

create or replace function public.record_surprise_view(surprise_slug text) returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.surprises set views = views + 1 where slug = surprise_slug and published = true;
  insert into public.surprise_views(surprise_id) select id from public.surprises where slug = surprise_slug and published = true;
end;
$$;

revoke all on function public.get_public_surprise(text) from public;
revoke all on function public.verify_surprise_answer(text, text) from public;
grant execute on function public.get_public_surprise(text) to anon, authenticated;
grant execute on function public.verify_surprise_answer(text, text) to anon, authenticated;
grant execute on function public.record_surprise_view(text) to anon, authenticated;
