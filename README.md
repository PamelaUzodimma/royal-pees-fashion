# Royal Pees Fashion House — Production Web App

Next.js 14 (App Router) + TypeScript + Tailwind + Supabase rebuild of the
original single-file HTML/JS prototype.

## Project structure

```
app/
  page.tsx                 storefront (server component, fetches catalog)
  layout.tsx                root layout, wraps app in CartProvider
  admin/
    login/page.tsx          PIN entry (posts to /api/admin/auth)
    page.tsx                 dashboard, gated by middleware.ts
  api/
    products/route.ts        public: catalog + live stock
    orders/route.ts          public: checkout, re-prices + calls place_order RPC
    admin/auth/route.ts       PIN check, issues signed session cookie
    admin/stock/route.ts      admin: read/adjust stock levels
    admin/sales/route.ts      admin: sales metrics + order history
components/
  Header.tsx, ProductCard.tsx, ProductGrid.tsx, BottomBar.tsx,
  CartDrawer.tsx, ProductDetailDrawer.tsx, CheckoutFlow.tsx, Storefront.tsx
  admin/AdminDashboard.tsx, SalesLog.tsx, StockControl.tsx
context/CartContext.tsx      cart state (persisted to localStorage, guest-only)
lib/
  order.ts                   order id + WhatsApp message builder (isomorphic)
  products.ts                 shared catalog-fetch helper (RSC + API route)
  admin-auth.ts                PIN + signed cookie verification (server-only)
  supabase/client.ts            browser client (anon key)
  supabase/server.ts            RSC client (anon key) + admin client (service role)
middleware.ts                 gates /admin and /api/admin/*
supabase/
  schema.sql                  tables + place_order() RPC
  policies.sql                 RLS policies
  seed.sql                     seed data ported from the original CATALOG
```

## 1. Supabase setup

1. Create a new Supabase project.
2. In the SQL editor, run in order:
   - `supabase/schema.sql`
   - `supabase/policies.sql`
   - `supabase/seed.sql`
3. Copy your project URL, anon key, and service-role key from
   **Project Settings → API**.

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase (server-only, never exposed
  to the browser bundle; only imported in files under `app/api/**`).
- `NEXT_PUBLIC_WA_PHONE`, `NEXT_PUBLIC_STORE_NAME`, `NEXT_PUBLIC_STORE_TAGLINE`
  — replace the old `:root` CSS variables from the prototype.
- `ADMIN_PIN` — replaces the old hardcoded `MASTER_ADMIN_PIN = "1234"`.
  Pick something longer than 4 digits if you want; it's checked server-side
  now, never shipped to the client.
- `ADMIN_SESSION_SECRET` — any long random string (e.g. `openssl rand -hex 32`).
  Used to sign the admin session cookie.

## 3. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Double-tap the store name in the header to
reach `/admin/login` (same easter egg as the original prototype, now backed
by a real server-side check instead of a client-side `if (pin === "1234")`).

## 4. Deploy to Vercel

```bash
vercel
```

Or connect the repo in the Vercel dashboard. Add the same environment
variables from `.env.local` in **Project Settings → Environment Variables**
(mark `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PIN`, and `ADMIN_SESSION_SECRET`
as sensitive). `vercel.json` is included but Next.js's defaults handle
almost everything automatically.

## What changed from the prototype, and why

- **Admin PIN**: moved from a client-side `if (pin === MASTER_ADMIN_PIN)`
  check (visible in view-source) to a POST to `/api/admin/auth`, which
  compares against `process.env.ADMIN_PIN` using a constant-time comparison
  and issues an HMAC-signed, httpOnly session cookie. `middleware.ts`
  verifies that cookie before allowing any `/admin` or `/api/admin/*`
  request through — the PIN itself never reaches the browser.
- **Cart**: still `localStorage`-backed (via `CartContext`), since a
  shopping bag is genuinely a per-device, ephemeral concept — no need for
  a database row per guest.
- **Stock & sales**: moved from `localStorage` to Supabase (`stock_levels`,
  `orders`, `order_items`), written only through the service-role client on
  the server, with RLS on the anon key limiting the browser to read-only
  access to products/stock.
- **Order placement**: uses a single Postgres function (`place_order`) that
  locks and validates stock and writes the order atomically, closing the
  race condition the original app had (two customers claiming the last unit
  at once).

## Known follow-ups worth considering

- Swap the PIN-only admin login for Supabase Auth (email+password or magic
  link) if you ever need more than one admin account or an audit trail of
  who changed stock.
- Add product image uploads via Supabase Storage instead of external
  `i.ibb.co` links, so images aren't dependent on a third-party host.
- Add pagination/infinite scroll to `SalesLog` once order volume grows
  beyond what fits comfortably in one fetch.
