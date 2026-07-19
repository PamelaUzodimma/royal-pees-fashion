import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { extractStockQuantity } from '@/lib/products';

export async function GET() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, title, category, price, stock_levels(quantity)')
    .order('category');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []).map((p: any) => ({
    productId: p.id,
    title: p.title,
    category: p.category,
    price: Number(p.price),
    quantity: extractStockQuantity(p.stock_levels),
  }));

  return NextResponse.json({ rows });
}

export async function PATCH(request: NextRequest) {
  const { productId, delta } = (await request.json()) as {
    productId: string;
    delta: number;
  };

  if (!productId || typeof delta !== 'number') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();

  const { data: current, error: readError } = await supabase
    .from('stock_levels')
    .select('quantity')
    .eq('product_id', productId)
    .single();

  if (readError || !current) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const nextQuantity = Math.max(0, current.quantity + delta);

  const { error: updateError } = await supabase
    .from('stock_levels')
    .update({ quantity: nextQuantity, updated_at: new Date().toISOString() })
    .eq('product_id', productId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ productId, quantity: nextQuantity });
}
