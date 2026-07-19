import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { generateOrderId, buildOrderMessage } from '@/lib/order';
import { Cart, CartItem } from '@/types';

interface CheckoutLine {
  productId: string;
  size: string | null;
  qty: number;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { items: CheckoutLine[] };
  const lines = body.items ?? [];

  if (!lines.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();

  // Re-price every line from the database — never trust price/cost sent
  // from the browser. This also confirms the products still exist/are active.
  const productIds = [...new Set(lines.map((l) => l.productId))];
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, category, sub_category, title, price, cost')
    .in('id', productIds)
    .eq('active', true);

  if (productsError || !products) {
    return NextResponse.json({ error: 'Could not load products' }, { status: 500 });
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const cart: Cart = {};

  for (const line of lines) {
    const product = productMap.get(line.productId);
    if (!product || line.qty <= 0) {
      return NextResponse.json(
        { error: `Invalid item: ${line.productId}` },
        { status: 400 }
      );
    }
    const cartKey = line.size ? `${line.productId}__${line.size}` : line.productId;
    const item: CartItem = {
      cartKey,
      productId: product.id,
      title: product.title,
      category: product.category,
      subCategoryName: product.sub_category,
      price: Number(product.price),
      size: line.size,
      qty: line.qty,
    };
    cart[cartKey] = item;
  }

  const orderId = generateOrderId(cart);

  const rpcItems = Object.values(cart).map((item) => {
    const product = productMap.get(item.productId)!;
    return {
      product_id: item.productId,
      title: item.title,
      size: item.size,
      qty: item.qty,
      unit_price: item.price,
      unit_cost: Number(product.cost),
    };
  });

  const { error: rpcError } = await supabase.rpc('place_order', {
    p_order_id: orderId,
    p_items: rpcItems,
  });

  if (rpcError) {
    // Most commonly: insufficient stock, caught by the RPC's row lock.
    return NextResponse.json({ error: rpcError.message }, { status: 409 });
  }

  const message = buildOrderMessage(cart, orderId);
  return NextResponse.json({ orderId, message });
}
