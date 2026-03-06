-- Run this script in Supabase SQL Editor.
-- Public mode: không cần auth, ai có URL cũng dùng được

-- Fixed user ID cho single user (personal app)
create table if not exists public.pregnancy_settings (
  user_id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  lmp_date date not null,
  due_date date,
  baseline_weight_kg numeric(5,2),
  timezone text not null default 'Asia/Ho_Chi_Minh',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default '00000000-0000-0000-0000-000000000001'::uuid,
  date date not null,
  weight_kg numeric(5,2) not null,
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create table if not exists public.weight_target_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default '00000000-0000-0000-0000-000000000001'::uuid,
  start_week int not null check (start_week >= 1),
  end_week int not null check (end_week >= start_week),
  min_per_week_kg numeric(4,2) not null,
  max_per_week_kg numeric(4,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default '00000000-0000-0000-0000-000000000001'::uuid,
  trigger_type text not null check (trigger_type in ('date', 'week', 'month')),
  trigger_date date,
  trigger_value int,
  title text not null,
  message text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (
    (trigger_type = 'date' and trigger_date is not null and trigger_value is null) or
    (trigger_type in ('week', 'month') and trigger_date is null and trigger_value is not null)
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_pregnancy_settings_updated_at on public.pregnancy_settings;
create trigger trg_pregnancy_settings_updated_at
before update on public.pregnancy_settings
for each row
execute function public.set_updated_at();

-- Public access: disable RLS entirely
alter table public.pregnancy_settings disable row level security;
alter table public.weight_logs disable row level security;
alter table public.weight_target_rules disable row level security;
alter table public.alerts disable row level security;
