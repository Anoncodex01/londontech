# Supabase setup — London Technologies

## 1. Run the SQL

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/idambuzdyptvtmdjpjlb/sql)
2. Paste the full contents of `schema.sql`
3. Click **Run**

This creates:

- Tables for products, categories, brands, orders, customers, reviews, installations, blog, FAQs, newsletter, settings, admin profiles
- Public storage bucket `product-images`
- Empty store settings row (no dummy catalog data)
- RLS policies (open for anon while building; tighten later)

If you already ran an older schema with seed rows, clear them with `clear-seed-data.sql`.

For multi-photo product galleries on an existing database, also run `add-product-gallery.sql`.

For checkout delivery fields on an existing database, also run `extend-orders-checkout.sql`.

For full blog article bodies (detail pages), also run `add-blog-content.sql`.

## 2. Env vars

Already set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://idambuzdyptvtmdjpjlb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 3. Verify

1. Restart `npm run dev`
2. Open `/admin` — banner should say **Connected to Supabase**
3. Add a product with an image under **Products**

## 4. Optional: Auth admin user

1. Authentication → Users → Add user  
   - Email: `admin@londontechnologies.co.tz`  
   - Password: `london2026`
2. Run the `admin_profiles` insert at the bottom of `schema.sql`
