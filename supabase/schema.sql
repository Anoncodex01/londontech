-- ============================================================
-- London Technologies — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- Project: idambuzdyptvtmdjpjlb
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  icon text not null default 'Package',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brands (
  id text primary key,
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  brand text not null,
  price numeric(12,0) not null check (price >= 0),
  original_price numeric(12,0),
  rating numeric(2,1) not null default 4.5,
  reviews integer not null default 0,
  stock text not null default 'in-stock'
    check (stock in ('in-stock', 'limited', 'out-of-stock')),
  warranty text not null default '12 months',
  delivery text not null default '1–3 days',
  badge text,
  accent text not null default '#2596be',
  specs text[] not null default '{}',
  featured boolean not null default false,
  best_seller boolean not null default false,
  new_arrival boolean not null default false,
  deal boolean not null default false,
  quantity integer not null default 0,
  active boolean not null default true,
  image_url text,
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  phone text not null,
  city text not null,
  product_name text not null,
  amount numeric(12,0) not null check (amount >= 0),
  status text not null default 'pending'
    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  payment text not null default 'mobile-money'
    check (payment in ('mobile-money','bank-transfer','cash-on-delivery')),
  channel text not null default 'website'
    check (channel in ('website','whatsapp','phone')),
  email text,
  address text,
  region text,
  notes text,
  delivery_estimate text,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id text primary key,
  name text not null,
  phone text not null,
  email text,
  city text not null,
  orders integer not null default 0,
  spent numeric(12,0) not null default 0,
  joined_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key,
  name text not null,
  city text not null,
  rating integer not null check (rating between 1 and 5),
  text text not null,
  product_name text not null,
  status text not null default 'pending'
    check (status in ('published','pending','hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.installations (
  id text primary key,
  customer_name text not null,
  phone text not null,
  service text not null,
  city text not null,
  preferred_date date not null,
  status text not null default 'requested'
    check (status in ('requested','scheduled','completed','cancelled')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id text primary key,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  status text not null default 'draft'
    check (status in ('published','draft')),
  created_at date not null default current_date,
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id text primary key,
  question text not null,
  answer text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id text primary key,
  email text not null unique,
  subscribed_at date not null default current_date,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id text primary key default 'main',
  store_name text not null,
  tagline text not null,
  phone text not null,
  whatsapp text not null,
  email text not null,
  weekday_hours text not null,
  sunday_hours text not null,
  delivery_dar text not null,
  delivery_regions text not null,
  instagram text not null default '#',
  facebook text not null default '#',
  tiktok text not null default '#',
  youtube text not null default '#',
  linkedin text not null default '#',
  updated_at timestamptz not null default now()
);

-- Optional: track admin accounts (create real users in Authentication → Users)
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default 'Admin',
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists products_category_idx on public.products (category);
create index if not exists products_brand_idx on public.products (brand);
create index if not exists products_deal_idx on public.products (deal);
create index if not exists products_active_idx on public.products (active);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists reviews_status_idx on public.reviews (status);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'categories','brands','products','orders','customers','reviews',
    'installations','blog_posts','faqs','newsletter_subscribers','store_settings'
  ]
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()',
      t
    );
  end loop;
end $$;

-- ============================================================
-- STORAGE (product images)
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies
drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Anon upload product images" on storage.objects;
create policy "Anon upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images');

drop policy if exists "Anon update product images" on storage.objects;
create policy "Anon update product images"
on storage.objects for update
using (bucket_id = 'product-images');

drop policy if exists "Anon delete product images" on storage.objects;
create policy "Anon delete product images"
on storage.objects for delete
using (bucket_id = 'product-images');

-- ============================================================
-- ROW LEVEL SECURITY
-- NOTE: Open policies so the anon key can power the current admin UI.
-- Tighten later with Supabase Auth (authenticated role only).
-- ============================================================

alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.customers enable row level security;
alter table public.reviews enable row level security;
alter table public.installations enable row level security;
alter table public.blog_posts enable row level security;
alter table public.faqs enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.store_settings enable row level security;
alter table public.admin_profiles enable row level security;

-- Helper to (re)create open CRUD policies
do $$
declare
  t text;
begin
  foreach t in array array[
    'categories','brands','products','orders','customers','reviews',
    'installations','blog_posts','faqs','newsletter_subscribers','store_settings'
  ]
  loop
    execute format('drop policy if exists "anon select %s" on public.%I', t, t);
    execute format('drop policy if exists "anon insert %s" on public.%I', t, t);
    execute format('drop policy if exists "anon update %s" on public.%I', t, t);
    execute format('drop policy if exists "anon delete %s" on public.%I', t, t);

    execute format(
      'create policy "anon select %s" on public.%I for select using (true)',
      t, t
    );
    execute format(
      'create policy "anon insert %s" on public.%I for insert with check (true)',
      t, t
    );
    execute format(
      'create policy "anon update %s" on public.%I for update using (true)',
      t, t
    );
    execute format(
      'create policy "anon delete %s" on public.%I for delete using (true)',
      t, t
    );
  end loop;
end $$;

drop policy if exists "admin profiles read own" on public.admin_profiles;
create policy "admin profiles read own"
on public.admin_profiles for select
using (auth.uid() = id);

-- ============================================================
-- DEFAULT STORE SETTINGS (empty contacts — fill from Admin → Settings)
-- No dummy products/orders/customers are inserted.
-- ============================================================

insert into public.store_settings (
  id, store_name, tagline, phone, whatsapp, email,
  weekday_hours, sunday_hours, delivery_dar, delivery_regions
) values (
  'main',
  'London Technologies',
  'Smart Technology. Trusted Quality.',
  '',
  '',
  '',
  'Monday – Saturday · 8:00 AM – 8:00 PM',
  'Sunday · 10:00 AM – 5:00 PM',
  'Dar es Salaam: 1 Day',
  'Other Regions: 2–5 Days'
)
on conflict (id) do nothing;

-- Optional: create Auth user in Dashboard, then link:
-- insert into public.admin_profiles (id, email, full_name, role)
-- select id, email, 'London Admin', 'admin'
-- from auth.users
-- where email = 'admin@londontechnologies.co.tz'
-- on conflict (id) do nothing;
