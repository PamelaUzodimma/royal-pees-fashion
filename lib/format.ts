export function fmt(amount: number): string {
  return `₦${Math.round(amount).toLocaleString('en-NG')}`;
}

export const STORE_NAME =
  process.env.NEXT_PUBLIC_STORE_NAME ?? 'Royal Pees Fashion';

export const STORE_TAGLINE =
  process.env.NEXT_PUBLIC_STORE_TAGLINE ??
  'Bespoke Sultan, Agbada, Senator Attires & Supplies';

export const WA_PHONE = process.env.NEXT_PUBLIC_WA_PHONE ?? '';

/** Canonical site URL — used for metadataBase, sitemap, canonical tags,
 *  and JSON-LD. Set NEXT_PUBLIC_SITE_URL once you have a real domain;
 *  falls back to localhost during development. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** Longer description used for meta description / LocalBusiness schema.
 *  Distinct from STORE_TAGLINE (short, shown in the header UI) —
 *  search engines reward a fuller, keyword-relevant sentence here. */
export const STORE_DESCRIPTION =
  process.env.NEXT_PUBLIC_STORE_DESCRIPTION ??
  'Royal Pees Fashion House designs and tailors bespoke Agbada, Senator wear, and Sultan Kaftans for weddings, chieftaincy events, and formal occasions across Nigeria. Book a custom fitting via WhatsApp.';

export const STORE_CITY = process.env.NEXT_PUBLIC_STORE_CITY ?? 'Owerri';
export const STORE_REGION = process.env.NEXT_PUBLIC_STORE_REGION ?? 'Imo State';
export const STORE_COUNTRY = 'NG';

/** Small context-aware emoji fallback for products missing an image. */
export function placeholderIcon(productId: string): string {
  if (productId.startsWith('con')) return '🤝';
  if (productId.startsWith('acc')) return '✂️';
  return '👔';
}
