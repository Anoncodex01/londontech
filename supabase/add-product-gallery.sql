-- Enable multiple product images (run once in Supabase SQL Editor)
alter table public.products
  add column if not exists image_urls text[] not null default '{}';

-- Keep existing single image as first gallery item
update public.products
set image_urls = array[image_url]
where image_url is not null
  and image_url <> ''
  and (image_urls is null or cardinality(image_urls) = 0);
