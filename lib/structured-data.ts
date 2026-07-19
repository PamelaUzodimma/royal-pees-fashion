import { ProductWithStock } from '@/types';
import {
  SITE_URL,
  STORE_CITY,
  STORE_COUNTRY,
  STORE_DESCRIPTION,
  STORE_NAME,
  STORE_REGION,
  WA_PHONE,
} from './format';

/** Site-wide LocalBusiness schema — rendered once in the root layout.
 *  Helps Google associate the site with local searches like
 *  "agbada tailor Owerri" rather than treating it as a generic page. */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: STORE_NAME,
    description: STORE_DESCRIPTION,
    url: SITE_URL,
    telephone: WA_PHONE ? `+${WA_PHONE}` : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: STORE_CITY,
      addressRegion: STORE_REGION,
      addressCountry: STORE_COUNTRY,
    },
    priceRange: '₦₦₦',
  };
}

/** Per-product schema — rendered on each /product/[id] page. Lets a
 *  product show up in Google with price/availability directly in the
 *  search result, not just a blue link. */
export function productJsonLd(product: ProductWithStock) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image ?? undefined,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: STORE_NAME,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'NGN',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/product/${product.id}`,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
