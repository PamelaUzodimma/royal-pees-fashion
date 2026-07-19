import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getActiveProducts } from '@/lib/products';

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { products, error } = await getActiveProducts(supabase);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ products });
}
