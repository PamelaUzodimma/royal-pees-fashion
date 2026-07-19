import { MetadataRoute } from 'next';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { getActiveProducts } from '@/lib/products';
import { SITE_URL } from '@/lib/format';

// Regenerate at most once per hour — stock/catalog changes shouldn't need
// a rebuild, but we don't want to hit Supabase on every crawler request.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicSupabaseClient();
  const { products } = await getActiveProducts(supabase);

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...productEntries,
  ];
}
