import { SupabaseClient } from '@supabase/supabase-js';
import { ProductWithStock } from '@/types';

const PRODUCT_COLUMNS =
  'id, category, category_icon, sub_category, title, price, cost, image_url, description, fabric, sizing, turnaround, sizes, active, stock_levels(quantity)';

/** Supabase/PostgREST returns an embedded to-many relationship as an array,
 *  but since stock_levels.product_id is BOTH the foreign key and the
 *  primary key of stock_levels, it's a strict one-to-one relationship —
 *  PostgREST detects that and returns a single object instead. Handle
 *  both shapes so stock always resolves correctly either way. */
export function extractStockQuantity(stockLevels: unknown): number {
  if (!stockLevels) return 0;
  if (Array.isArray(stockLevels)) {
    return (stockLevels[0] as { quantity?: number } | undefined)?.quantity ?? 0;
  }
  return (stockLevels as { quantity?: number }).quantity ?? 0;
}

function mapRow(p: any): ProductWithStock {
  const currentStock = extractStockQuantity(p.stock_levels);
  return {
    id: p.id,
    category: p.category,
    subCategoryName: p.sub_category,
    title: p.title,
    price: Number(p.price),
    cost: Number(p.cost),
    image: p.image_url,
    description: p.description,
    fabric: p.fabric,
    sizing: p.sizing,
    turnaround: p.turnaround,
    sizes: p.sizes,
    active: p.active,
    currentStock,
    inStock: currentStock > 0,
  };
}

export async function getActiveProducts(
  supabase: SupabaseClient
): Promise<{ products: ProductWithStock[]; error: string | null }> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('active', true)
    .order('category');

  if (error) return { products: [], error: error.message };
  return { products: (data ?? []).map(mapRow), error: null };
}

/** Single-row fetch for /product/[id] and its generateMetadata — avoids
 *  pulling the whole catalog just to find one item. */
export async function getProductById(
  supabase: SupabaseClient,
  id: string
): Promise<ProductWithStock | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('id', id)
    .eq('active', true)
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data);
}
