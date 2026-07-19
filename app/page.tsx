import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getActiveProducts } from '@/lib/products';
import { Storefront } from '@/components/Storefront';

// Stock changes on every order, so always fetch fresh rather than
// caching the storefront at build time.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = createServerSupabaseClient();
  const { products } = await getActiveProducts(supabase);

  return <Storefront initialProducts={products} />;
}
