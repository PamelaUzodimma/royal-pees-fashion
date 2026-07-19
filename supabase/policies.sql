-- ============================================================
-- Row Level Security — run after schema.sql
--
-- Model: the anon key (used by the browser and by RSC reads) can
-- only ever SELECT active products and read stock quantities.
-- Every write (products, stock_levels, orders, order_items) is
-- performed exclusively by Next.js API routes using the
-- service-role key, which bypasses RLS entirely. RLS here is a
-- second line of defense in case the anon key is ever used
-- directly (e.g. someone calls the Supabase REST API by hand).
-- The Next.js layer (middleware.ts + ADMIN_PIN + signed cookie)
-- is what actually gates the /admin dashboard.
-- ============================================================

alter table products enable row level security;
alter table stock_levels enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public (anon + authenticated) can read active products only.
create policy "Public can view active products"
  on products for select
  to anon, authenticated
  using (active = true);

-- Public can read stock quantities (needed to render "in stock" /
-- "fully booked" state client-side).
create policy "Public can view stock levels"
  on stock_levels for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policies are defined for anon/authenticated
-- on products, stock_levels, orders, or order_items — meaning those
-- operations are denied by default for anyone but the service role.

-- Orders and order_items are never readable via the anon key; only
-- the admin dashboard (service-role, server-side) can read sales logs.
-- (No select policy for anon/authenticated = default deny.)
