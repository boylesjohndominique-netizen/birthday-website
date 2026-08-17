-- =============================================================================
-- schema.sql — "A Keepsake, For You" gift PWA
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query).
-- Safe to run once on a fresh project. Re-running will error on existing
-- objects — drop tables first if you need to reset (see bottom of file).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- Table: photos
-- ---------------------------------------------------------------------------
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  caption text,
  taken_on date,
  tags text[] not null default '{}',
  curator_note text,
  is_special boolean not null default false,
  unlock_key text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_photos_tags on photos using gin (tags);
create index if not exists idx_photos_is_special on photos (is_special);
create index if not exists idx_photos_unlock_key on photos (unlock_key);
create index if not exists idx_photos_sort_order on photos (sort_order);

-- ---------------------------------------------------------------------------
-- Table: favorites
-- ---------------------------------------------------------------------------
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('music', 'todo', 'quote', 'link', 'video')),
  title text not null,
  content text,
  meta jsonb not null default '{}',
  is_surprise boolean not null default false,
  completed boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_favorites_type on favorites (type);
create index if not exists idx_favorites_sort_order on favorites (sort_order);

drop trigger if exists trg_favorites_updated_at on favorites;
create trigger trg_favorites_updated_at
  before update on favorites
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Table: events
-- ---------------------------------------------------------------------------
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  event_key text unique not null,
  name text not null,
  event_at timestamptz not null,
  description text,
  celebrated boolean not null default false,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_events_event_key on events (event_key);

-- ---------------------------------------------------------------------------
-- Table: games
-- ---------------------------------------------------------------------------
create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  game_key text not null,
  user_id uuid,
  score int not null default 0,
  unlocked boolean not null default false,
  unlocked_payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_games_game_key_unique on games (game_key);
create index if not exists idx_games_game_key on games (game_key);

drop trigger if exists trg_games_updated_at on games;
create trigger trg_games_updated_at
  before update on games
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Table: love_notes
-- ---------------------------------------------------------------------------
create table if not exists love_notes (
  id uuid primary key default gen_random_uuid(),
  note text not null,
  note_index int not null,
  visible boolean not null default true,
  special_date date,
  unlock_key text,
  created_at timestamptz not null default now()
);

create index if not exists idx_love_notes_note_index on love_notes (note_index);
create index if not exists idx_love_notes_special_date on love_notes (special_date);
create index if not exists idx_love_notes_unlock_key on love_notes (unlock_key);

-- ---------------------------------------------------------------------------
-- Table: game_questions (trivia bank)
-- ---------------------------------------------------------------------------
create table if not exists game_questions (
  id uuid primary key default gen_random_uuid(),
  game_key text not null default 'trivia',
  question text not null,
  choices text[] not null,
  answer_index int not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_game_questions_game_key on game_questions (game_key);

-- ---------------------------------------------------------------------------
-- Table: unlocks (tracks which surprises have been revealed)
-- ---------------------------------------------------------------------------
create table if not exists unlocks (
  id uuid primary key default gen_random_uuid(),
  unlock_key text unique not null,
  source text, -- e.g. 'trivia', 'memory', 'clicker', 'birthday'
  payload jsonb not null default '{}',
  unlocked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_unlocks_unlock_key on unlocks (unlock_key);

-- ---------------------------------------------------------------------------
-- Table: app_settings (single-row-ish config table)
-- ---------------------------------------------------------------------------
create table if not exists app_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_app_settings_updated_at on app_settings;
create trigger trg_app_settings_updated_at
  before update on app_settings
  for each row execute function set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================
-- This app is designed as a mostly-public gift experience: the URL itself is
-- the "access control" (shared privately with one person). Reads are public;
-- writes are locked down. If you want real privacy, enable Supabase Auth and
-- replace the `true` read policies below with `auth.uid() is not null` (or a
-- specific user id check). See README.md "Security & privacy" for details.

alter table photos enable row level security;
alter table favorites enable row level security;
alter table events enable row level security;
alter table games enable row level security;
alter table love_notes enable row level security;
alter table game_questions enable row level security;
alter table unlocks enable row level security;
alter table app_settings enable row level security;

-- Public read policies -------------------------------------------------------
create policy "public can read photos" on photos for select using (true);
create policy "public can read favorites" on favorites for select using (true);
create policy "public can read events" on events for select using (true);
create policy "public can read games" on games for select using (true);
create policy "public can read love_notes" on love_notes for select using (true);
create policy "public can read game_questions" on game_questions for select using (true);
create policy "public can read unlocks" on unlocks for select using (true);
create policy "public can read app_settings" on app_settings for select using (true);

-- Restricted write policies ---------------------------------------------------
-- The favorites to-do list and mini-game scores are the only things this app
-- writes from the browser with the anon key, since they are low-stakes and
-- meant to be interactive for the recipient. Everything else (photos, notes,
-- events) should be managed from the Supabase Dashboard's Table Editor, or
-- behind a real admin auth flow if you extend this app.

create policy "anyone can insert favorites" on favorites for insert with check (true);
create policy "anyone can update favorites" on favorites for update using (true) with check (true);
create policy "anyone can delete favorites" on favorites for delete using (true);

create policy "anyone can upsert games" on games for insert with check (true);
create policy "anyone can update games" on games for update using (true) with check (true);

create policy "anyone can update event celebrated flag" on events for update using (true) with check (true);

-- photos, love_notes, game_questions, unlocks, app_settings: no public write
-- policy is defined, so anon writes are denied by default even though RLS
-- read policies are public. Manage these tables from the Supabase Dashboard.

-- =============================================================================
-- Storage: photos bucket
-- =============================================================================
-- Supabase's storage.buckets table can be seeded via SQL, but bucket-level
-- access policies are best set from Dashboard > Storage > Policies, since the
-- storage.objects RLS policy UI keeps them in sync with the Storage API.
-- The insert below is idempotent (on conflict do nothing).

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- MANUAL STEP (Supabase Dashboard): if you prefer a private bucket instead of
-- public read (recommended for real privacy), go to Storage > photos > Edit
-- bucket, uncheck "Public", and add a SELECT policy on storage.objects such as:
--
--   create policy "authenticated can read photos"
--   on storage.objects for select
--   using (bucket_id = 'photos' and auth.role() = 'authenticated');
--
-- Then switch the frontend to use getSignedPhotoUrl() instead of getPhotoUrl()
-- (see src/services/storageService.js).

-- With public = true (the default here), no additional storage.objects policy
-- is required for reads. Uploads still require you to be signed in as the
-- project owner via the Dashboard, or to add your own authenticated upload
-- policy — the app itself does not expose an upload UI to the recipient.

-- =============================================================================
-- Seed data
-- =============================================================================

-- app_settings ----------------------------------------------------------------
insert into app_settings (key, value) values
  ('recipient_name', '{"value": "My Love"}'),
  ('theme_preference', '{"value": "auto"}')
on conflict (key) do nothing;

-- events ------------------------------------------------------------------
-- TODO(user): update event_at to the real birthday date and timezone.
insert into events (event_key, name, event_at, description, meta) values
  ('birthday', 'Birthday', '2026-12-31T00:00:00+08:00', 'The day this whole app has been counting down to.',
   '{"celebration_message": "Here is to another year of us.", "music_url": "https://open.spotify.com/"}')
on conflict (event_key) do nothing;

-- love_notes --------------------------------------------------------------
insert into love_notes (note, note_index, visible, special_date, unlock_key) values
  ('Every timeline I run through in my head, you are in the good ones.', 0, true, null, null),
  ('You make ordinary Tuesdays feel like they deserve a soundtrack.', 1, true, null, null),
  ('I still remember exactly where I was standing when you laughed for the first time around me.', 2, true, null, null),
  ('If I had to pick your laugh out of a crowd of a thousand, I would, every time.', 3, true, null, 'trivia'),
  ('Some people search their whole lives for someone as easy to love as you.', 4, true, null, 'memory'),
  ('You are the calm I did not know I needed and the excitement I did not expect.', 5, true, null, 'clicker'),
  ('I like the version of me that exists when I am around you.', 6, true, null, null),
  ('Happy birthday. Thank you for choosing me, every single day.', 7, true, '2026-12-31', null);

-- favorites -----------------------------------------------------------------
insert into favorites (type, title, content, meta, is_surprise, completed, sort_order) values
  ('music', 'Our song', 'https://open.spotify.com/', '{"artist": "Placeholder Artist"}', false, false, 0),
  ('quote', 'Something you said once', 'I did not know a person could feel like home.', '{}', false, false, 1),
  ('todo', 'Watch the sunset at that one spot again', null, '{}', false, false, 2),
  ('todo', 'Try that ramen place downtown', null, '{}', false, true, 3),
  ('link', 'The article you kept talking about', 'https://example.com', '{}', false, false, 4),
  ('quote', 'Surprise', 'You are, without question, my favorite person.', '{}', true, false, 5);

-- game_questions --------------------------------------------------------------
insert into game_questions (game_key, question, choices, answer_index, sort_order) values
  ('trivia', 'Where did we go on our first real date?',
   array['The cafe downtown', 'The beach at Dumaguete', 'A movie theater', 'Nowhere, we stayed in'], 0, 0),
  ('trivia', 'What is my go-to comfort food?',
   array['Ramen', 'Adobo', 'Pizza', 'Sinigang'], 1, 1),
  ('trivia', 'Which season do I love most?',
   array['Summer', 'Rainy season', 'Christmas season', 'Whichever one you''re in'], 3, 2);

-- photos ------------------------------------------------------------------
-- TODO(user): upload real images to the `photos` storage bucket under these
-- paths (or update storage_path to match what you upload), then adjust
-- captions/tags/dates freely from the Table Editor.
insert into photos (storage_path, caption, taken_on, tags, curator_note, is_special, unlock_key, sort_order) values
  ('sample/photo-01.jpg', 'The trip we almost cancelled', '2024-04-12', array['travel', 'sunsets'], 'This is the one where you insisted the ferry would be "fine."', false, null, 0),
  ('sample/photo-02.jpg', 'Rainy day, good coffee', '2024-06-02', array['home', 'quiet'], 'Neither of us wanted to leave that cafe.', false, 'museum-egg', 1),
  ('sample/photo-03.jpg', 'The look right before you laughed', '2024-09-19', array['candid'], null, false, null, 2),
  ('sample/photo-04.jpg', 'A quiet kind of happy', '2025-01-05', array['home'], 'Saving this one for your birthday exhibit.', true, null, 3);

-- =============================================================================
-- Optional reset (uncomment and run manually if you need a clean slate)
-- =============================================================================
-- drop table if exists unlocks cascade;
-- drop table if exists game_questions cascade;
-- drop table if exists games cascade;
-- drop table if exists love_notes cascade;
-- drop table if exists events cascade;
-- drop table if exists favorites cascade;
-- drop table if exists photos cascade;
-- drop table if exists app_settings cascade;
