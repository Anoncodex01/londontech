-- Extend orders for checkout + delivery tracking (run once in SQL Editor)

alter table public.orders
  add column if not exists email text,
  add column if not exists address text,
  add column if not exists region text,
  add column if not exists notes text,
  add column if not exists delivery_estimate text,
  add column if not exists items jsonb not null default '[]'::jsonb;

create index if not exists orders_phone_idx on public.orders (phone);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
