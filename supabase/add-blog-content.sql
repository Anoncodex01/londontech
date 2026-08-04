-- Add full article body for blog detail pages.
-- Run this once in the Supabase SQL editor.

alter table public.blog_posts
  add column if not exists content text not null default '';
