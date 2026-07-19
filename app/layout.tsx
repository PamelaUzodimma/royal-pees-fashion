import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import { SITE_URL, STORE_DESCRIPTION, STORE_NAME, STORE_TAGLINE } from '@/lib/format';
import { localBusinessJsonLd } from '@/lib/structured-data';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${STORE_NAME} | ${STORE_TAGLINE}`,
    // Product/category pages set their own title; this wraps them, e.g.
    // "Grand Sultan Silk Agbada Set | Royal Pees Fashion"
    template: `%s | ${STORE_NAME}`,
  },
  description: STORE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: STORE_NAME,
    title: `${STORE_NAME} | ${STORE_TAGLINE}`,
    description: STORE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_NG',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${STORE_NAME} | ${STORE_TAGLINE}`,
    description: STORE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Site-wide business identity for search engines — rendered once,
            separate from any per-page Product/Breadcrumb schema. */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
