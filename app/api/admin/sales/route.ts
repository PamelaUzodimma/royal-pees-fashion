import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createAdminSupabaseClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select(
      'id, created_at, total_revenue, total_profit, total_units, order_items(title, size, qty)'
    )
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (orders ?? []).map((o: any) => ({
    orderId: o.id,
    createdAt: o.created_at,
    itemsText: (o.order_items ?? [])
      .map((li: any) => `${li.title}${li.size ? ` (Size: ${li.size})` : ''} (x${li.qty})`)
      .join(', '),
    totalItemsSold: o.total_units,
    revenue: Number(o.total_revenue),
    profit: Number(o.total_profit),
  }));

  const totals = rows.reduce(
    (acc, r) => ({
      orders: acc.orders + r.totalItemsSold,
      revenue: acc.revenue + r.revenue,
      profit: acc.profit + r.profit,
    }),
    { orders: 0, revenue: 0, profit: 0 }
  );

  return NextResponse.json({ rows, totals });
}
