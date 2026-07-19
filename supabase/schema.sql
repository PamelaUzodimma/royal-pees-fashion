-- ============================================================
-- Royal Pees Fashion — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- products: the catalog, replaces the hardcoded CATALOG array
-- ---------------------------------------------------------------
create table if not exists products (
  id               text primary key,               -- e.g. 'agb-001'
  category         text not null,                   -- e.g. 'Agbada Suite'
  category_icon    text not null default '👔',
  sub_category     text not null,                   -- e.g. 'Premium Royal Embroidery'
  title            text not null,
  price            numeric(12,2) not null check (price >= 0),
  cost             numeric(12,2) not null default 0 check (cost >= 0),
  image_url        text,
  description      text not null default '',
  fabric           text not null default '',
  sizing           text not null default '',
  turnaround       text not null default '',
  sizes            text[],                          -- null/empty = no size selector
  active           boolean not null default true,   -- soft-hide instead of deleting
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- stock_levels: current available quantity per product.
-- Kept as its own table (rather than a column on products) so stock
-- writes/locks never contend with catalog edits, matching the
-- separation the brief asked for.
-- ---------------------------------------------------------------
create table if not exists stock_levels (
  product_id  text primary key references products(id) on delete cascade,
  quantity    integer not null default 0 check (quantity >= 0),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- orders: one row per WhatsApp checkout ("Booking ID")
-- ---------------------------------------------------------------
create table if not exists orders (
  id               text primary key,               -- e.g. 'FSH-260718-AB12CD'
  created_at       timestamptz not null default now(),
  total_revenue    numeric(12,2) not null,
  total_profit     numeric(12,2) not null,
  total_units      integer not null,
  whatsapp_sent    boolean not null default true
);

create table if not exists order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     text not null references orders(id) on delete cascade,
  product_id   text not null references products(id),
  title        text not null,       -- snapshot at time of purchase
  size         text,
  qty          integer not null check (qty > 0),
  unit_price   numeric(12,2) not null,
  unit_cost    numeric(12,2) not null default 0
);

create index if not exists order_items_order_id_idx on order_items(order_id);

-- ---------------------------------------------------------------
-- place_order: atomically validates stock, decrements it, and logs
-- the order + line items in one transaction. Called from the
-- server (service-role client) after the customer taps
-- "Send to WhatsApp" — never called directly by the browser.
-- ---------------------------------------------------------------
create or replace function place_order(
  p_order_id text,
  p_items jsonb -- [{product_id, title, size, qty, unit_price, unit_cost}, ...]
)
returns void
language plpgsql
security definer
as $$
declare
  item jsonb;
  available int;
  v_total_revenue numeric(12,2) := 0;
  v_total_profit numeric(12,2) := 0;
  v_total_units int := 0;
begin
  -- Lock and validate every line before writing anything.
  for item in select * from jsonb_array_elements(p_items) loop
    select quantity into available
    from stock_levels
    where product_id = (item->>'product_id')
    for update;

    if available is null or available < (item->>'qty')::int then
      raise exception 'Insufficient stock for product %', item->>'product_id';
    end if;
  end loop;

  insert into orders (id, total_revenue, total_profit, total_units)
  values (p_order_id, 0, 0, 0); -- placeholder, updated below

  for item in select * from jsonb_array_elements(p_items) loop
    update stock_levels
      set quantity = quantity - (item->>'qty')::int,
          updated_at = now()
      where product_id = (item->>'product_id');

    insert into order_items (order_id, product_id, title, size, qty, unit_price, unit_cost)
    values (
      p_order_id,
      item->>'product_id',
      item->>'title',
      item->>'size',
      (item->>'qty')::int,
      (item->>'unit_price')::numeric,
      (item->>'unit_cost')::numeric
    );

    v_total_units := v_total_units + (item->>'qty')::int;
    v_total_revenue := v_total_revenue + (item->>'qty')::int * (item->>'unit_price')::numeric;
    v_total_profit := v_total_profit + (item->>'qty')::int * ((item->>'unit_price')::numeric - (item->>'unit_cost')::numeric);
  end loop;

  update orders
    set total_revenue = v_total_revenue,
        total_profit = v_total_profit,
        total_units = v_total_units
    where id = p_order_id;
end;
$$;
