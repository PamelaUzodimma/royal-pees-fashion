import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { getProductById } from '@/lib/products';
import { fmt, placeholderIcon, SITE_URL, STORE_NAME } from '@/lib/format';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/structured-data';
import { ProductPageActions } from '@/components/ProductPageActions';

export const revalidate = 3600;

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createPublicSupabaseClient();
  const product = await getProductById(supabase, params.id);

  if (!product) {
    return { title: 'Product not found' };
  }

  const description = product.description.slice(0, 155);

  return {
    title: product.title,
    description,
    alternates: {
      canonical: `/product/${product.id}`,
    },
    openGraph: {
      title: `${product.title} | ${STORE_NAME}`,
      description,
      url: `${SITE_URL}/product/${product.id}`,
      images: product.image ? [{ url: product.image }] : undefined,
      type: 'website',
    },
    twitter: {
      card: product.image ? 'summary_large_image' : 'summary',
      title: product.title,
      description,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const supabase = createPublicSupabaseClient();
  const product = await getProductById(supabase, params.id);

  if (!product) notFound();

  const breadcrumbs = [
    { name: 'Home', url: SITE_URL },
    { name: product.category, url: SITE_URL },
    { name: product.title, url: `${SITE_URL}/product/${product.id}` },
  ];

  return (
    <div className="min-h-screen bg-surface text-charcoal">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />

      <div className="mx-auto max-w-2xl px-4 py-4">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>{product.category}</li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-charcoal" aria-current="page">
              {product.title}
            </li>
          </ol>
        </nav>

        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-[#f0ede8] to-[#e5e0d8]">
            {product.image ? (
              <Image
                src={product.image}
                alt={`${product.title} — ${product.category}, ${STORE_NAME}`}
                fill
                priority
                sizes="(min-width: 768px) 640px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl">
                {placeholderIcon(product.id)}
              </div>
            )}
          </div>

          <div className="space-y-4 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-accent-dark">
              {product.category} · {product.subCategoryName}
            </p>
            <h1 className="text-2xl font-bold leading-tight">{product.title}</h1>
            <p className="text-xl font-extrabold text-accent-dark">{fmt(product.price)}</p>

            <ProductPageActions product={product} />

            <p className="pt-2 text-sm leading-relaxed text-charcoal/80">
              {product.description}
            </p>

            <dl className="space-y-1.5 pt-2 text-sm">
              <SpecRow label="Fabric" value={product.fabric} />
              <SpecRow label="Sizing" value={product.sizing} />
              <SpecRow label="Turnaround" value={product.turnaround} />
            </dl>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/" className="underline">
            ← Back to the full {STORE_NAME} catalog
          </Link>
        </p>
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-surface pb-1.5">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
