'use client';

import { useMemo, useState } from 'react';
import { ProductWithStock } from '@/types';
import { Header } from './Header';
import { ProductGrid } from './ProductGrid';
import { BottomBar } from './BottomBar';
import { CartDrawer } from './CartDrawer';
import { ProductDetailDrawer } from './ProductDetailDrawer';
import { ConfirmOrderModal, ConfirmationScreen } from './CheckoutFlow';
import { useCart } from '@/context/CartContext';
import { buildOrderMessage, buildWhatsAppUrl, generateOrderId } from '@/lib/order';

const CATEGORY_ICONS: Record<string, string> = {
  'Agbada Suite': '👑',
  'Senator Outfits': '👔',
  'Sultan Kaftans': '🕌',
  Consultations: '🤝',
  Accessories: '⚙️',
};

export function Storefront({ initialProducts }: { initialProducts: ProductWithStock[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirmation, setConfirmation] = useState<{ orderId: string; url: string } | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const { cart, clearCart } = useCart();

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).map((name) => ({
      name,
      icon: CATEGORY_ICONS[name] ?? '👔',
    })),
    [products]
  );

  const productsById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const visibleProducts = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return products.filter(
        (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    const activeCatName = categories[activeCategory]?.name;
    return products.filter((p) => p.category === activeCatName);
  }, [products, searchQuery, activeCategory, categories]);

  const detailProduct = detailProductId ? productsById.get(detailProductId) ?? null : null;
  const previewOrderId = useMemo(() => generateOrderId(cart), [cart]);
  const previewMessage = useMemo(
    () => buildOrderMessage(cart, previewOrderId),
    [cart, previewOrderId]
  );

  async function refreshProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch {
      // stock refresh is best-effort; stale UI will self-correct on next load
    }
  }

  async function handleSendToWhatsApp() {
    setSending(true);
    setCheckoutError(null);
    try {
      const items = Object.values(cart).map((item) => ({
        productId: item.productId,
        size: item.size,
        qty: item.qty,
      }));
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCheckoutError(data.error ?? 'Something went wrong. Please try again.');
        setSending(false);
        return;
      }

      const url = buildWhatsAppUrl(data.message);
      window.open(url, '_blank');
      clearCart();
      setCheckoutOpen(false);
      setCartOpen(false);
      setConfirmation({ orderId: data.orderId, url });
      refreshProducts();
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface pb-36 text-charcoal">
      <Header
        categories={categories}
        activeCategory={activeCategory}
        onSwitchTab={(idx) => {
          setActiveCategory(idx);
          setSearchQuery('');
        }}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="px-4 py-4">
        <h1 className="mb-3 text-sm font-semibold text-muted">
          Bespoke Agbada, Senator Wear & Sultan Kaftan Tailoring — Book via WhatsApp
        </h1>
        <ProductGrid
          products={visibleProducts}
          emptyLabel={
            searchQuery.trim()
              ? `No matching records found for "${searchQuery}".`
              : undefined
          }
          onOpenDetail={setDetailProductId}
        />
      </main>

      <BottomBar onOpenCart={() => setCartOpen(true)} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        productsById={productsById}
        onCheckout={() => setCheckoutOpen(true)}
      />

      <ProductDetailDrawer product={detailProduct} onClose={() => setDetailProductId(null)} />

      <ConfirmOrderModal
        open={checkoutOpen}
        message={previewMessage}
        sending={sending}
        onCancel={() => setCheckoutOpen(false)}
        onConfirm={handleSendToWhatsApp}
      />

      {checkoutError && (
        <div className="fixed bottom-24 left-4 right-4 z-[600] rounded-lg bg-red-600 p-3 text-center text-sm font-semibold text-white">
          {checkoutError}
        </div>
      )}

      {confirmation && (
        <ConfirmationScreen
          open={!!confirmation}
          orderId={confirmation.orderId}
          whatsappUrl={confirmation.url}
          onReopenWhatsApp={() => window.open(confirmation.url, '_blank')}
          onContinue={() => setConfirmation(null)}
        />
      )}
    </div>
  );
}
