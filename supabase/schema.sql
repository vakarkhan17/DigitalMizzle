-- DigitalMizzle preview schema for Supabase PostgreSQL.
-- Run only in a dedicated development Supabase project after review.

create extension if not exists "pgcrypto";

create type public.app_role as enum ('user', 'editor', 'admin');
create type public.content_status as enum ('draft', 'published', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  role public.app_role not null default 'user',
  is_disabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null default '',
  difficulty text not null,
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  instructor text not null default 'DigitalMizzle Academy',
  status public.content_status not null default 'draft',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position integer not null check (position > 0),
  unique (course_id, position)
);

create table public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  slug text not null,
  title text not null,
  preview_text text not null default '',
  protected_body jsonb not null default '{}'::jsonb,
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  position integer not null check (position > 0),
  status public.content_status not null default 'draft',
  unique (module_id, slug),
  unique (module_id, position)
);

create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  public_preview text not null default '',
  protected_body jsonb not null default '{}'::jsonb,
  author_id uuid references public.profiles(id),
  category text not null default '',
  featured_image_path text,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tools (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null default '',
  platform text not null default '',
  difficulty text not null default 'Beginner',
  public_description text not null default '',
  protected_guide jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_course_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  started_at timestamptz not null default now(),
  last_opened_at timestamptz not null default now(),
  completed_at timestamptz,
  percent numeric(5,2) not null default 0 check (percent between 0 and 100),
  primary key (user_id, course_id)
);

create table public.user_lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.course_modules(id) on delete cascade,
  title text not null,
  pass_mark integer not null default 70 check (pass_mark between 0 and 100),
  questions jsonb not null default '[]'::jsonb
);

create table public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  passed boolean not null,
  answers jsonb not null default '[]'::jsonb,
  attempted_at timestamptz not null default now()
);

create table public.user_activity (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_type text not null,
  content_type text,
  content_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index on public.course_modules(course_id);
create index on public.course_lessons(module_id);
create index on public.user_course_progress(user_id, last_opened_at desc);
create index on public.user_lesson_progress(user_id, updated_at desc);
create index on public.quiz_results(user_id, attempted_at desc);
create index on public.user_activity(user_id, created_at desc);

create or replace function public.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and not is_disabled
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    case when lower(coalesce(new.email, '')) = 'vakar.khan@gmail.com'
      then 'admin'::public.app_role
      else 'user'::public.app_role
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;
alter table public.blogs enable row level security;
alter table public.tools enable row level security;
alter table public.user_course_progress enable row level security;
alter table public.user_lesson_progress enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_results enable row level security;
alter table public.user_activity enable row level security;

create policy "Profiles are readable by owner or admin"
on public.profiles for select
using (id = auth.uid() or public.current_role() = 'admin');

create policy "Profiles are editable by owner or admin"
on public.profiles for update
using (id = auth.uid() or public.current_role() = 'admin')
with check (id = auth.uid() or public.current_role() = 'admin');

create policy "Published courses are public"
on public.courses for select
using (status = 'published' or public.current_role() in ('editor', 'admin'));

create policy "Published modules are public metadata"
on public.course_modules for select
using (
  exists (
    select 1 from public.courses
    where courses.id = course_modules.course_id
      and (courses.status = 'published' or public.current_role() in ('editor', 'admin'))
  )
);

create policy "Lessons require a verified user"
on public.course_lessons for select
using (auth.uid() is not null and status = 'published' or public.current_role() in ('editor', 'admin'));

create policy "Published blog metadata is public"
on public.blogs for select
using (status = 'published' or public.current_role() in ('editor', 'admin'));

create policy "Published tool metadata is public"
on public.tools for select
using (status = 'published' or public.current_role() in ('editor', 'admin'));

create policy "Users manage their course progress"
on public.user_course_progress for all
using (user_id = auth.uid() or public.current_role() = 'admin')
with check (user_id = auth.uid() or public.current_role() = 'admin');

create policy "Users manage their lesson progress"
on public.user_lesson_progress for all
using (user_id = auth.uid() or public.current_role() = 'admin')
with check (user_id = auth.uid() or public.current_role() = 'admin');

create policy "Verified users read quizzes"
on public.quizzes for select
using (auth.uid() is not null);

create policy "Users manage their quiz results"
on public.quiz_results for all
using (user_id = auth.uid() or public.current_role() = 'admin')
with check (user_id = auth.uid() or public.current_role() = 'admin');

create policy "Users read and create their activity"
on public.user_activity for select
using (user_id = auth.uid() or public.current_role() = 'admin');

create policy "Users create their activity"
on public.user_activity for insert
with check (user_id = auth.uid());

create policy "Admins manage courses"
on public.courses for all
using (public.current_role() in ('editor', 'admin'))
with check (public.current_role() in ('editor', 'admin'));

create policy "Admins manage modules"
on public.course_modules for all
using (public.current_role() in ('editor', 'admin'))
with check (public.current_role() in ('editor', 'admin'));

create policy "Admins manage lessons"
on public.course_lessons for all
using (public.current_role() in ('editor', 'admin'))
with check (public.current_role() in ('editor', 'admin'));

create policy "Admins manage blogs"
on public.blogs for all
using (public.current_role() in ('editor', 'admin'))
with check (public.current_role() in ('editor', 'admin'));

create policy "Admins manage tools"
on public.tools for all
using (public.current_role() in ('editor', 'admin'))
with check (public.current_role() in ('editor', 'admin'));

-- If the admin account already exists before this schema is applied:
-- update public.profiles set role = 'admin'
-- where lower(email) = 'vakar.khan@gmail.com';
