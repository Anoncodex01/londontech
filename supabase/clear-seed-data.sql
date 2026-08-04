-- ============================================================
-- Clear seeded / dummy rows from London Technologies tables
-- Run in Supabase SQL Editor if you already imported schema.sql seeds
-- Keeps table structure, storage bucket, and store_settings row
-- ============================================================

truncate table public.newsletter_subscribers restart identity cascade;
truncate table public.faqs restart identity cascade;
truncate table public.blog_posts restart identity cascade;
truncate table public.installations restart identity cascade;
truncate table public.reviews restart identity cascade;
truncate table public.customers restart identity cascade;
truncate table public.orders restart identity cascade;
truncate table public.products restart identity cascade;
truncate table public.brands restart identity cascade;
truncate table public.categories restart identity cascade;

-- Reset settings to blank operational defaults (no fake phone/email)
update public.store_settings
set
  phone = '',
  whatsapp = '',
  email = '',
  instagram = '#',
  facebook = '#',
  tiktok = '#',
  youtube = '#',
  linkedin = '#',
  updated_at = now()
where id = 'main';
