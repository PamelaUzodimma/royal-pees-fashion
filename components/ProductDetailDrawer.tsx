'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ProductWithStock } from '@/types';
import { fmt, placeholderIcon } from '@/lib/format';
import { useCart } from '@/context/CartContext';

export function ProductDetailDrawer({
  product,
  onClose,
}: {
  product: ProductWithStock | null;
  onClose: () => void;
}) {
  const { qtyFor, addToCart, changeQty } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const open = !!product;
  const hasSizes = !!product?.sizes && product.sizes.length > 0;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[440] bg-black/50 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-[450] flex max-h-[90vh] flex-col rounded-t-2xl bg-white transition-transform duration-200 ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {product && (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#f0ede8] to-[#e5e0d8]">
                {product.image ? (
                  <Image src={product.image} alt={`${product.title} — ${product.category}`} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-6xl">
                    {placeholderIcon(product.id)}
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 p-5">
                <div className="text-xs font-bold uppercase tracking-wide text-accent-dark">
                  {product.category}
                </div>
                <h2 className="text-xl font-bold">{product.title}</h2>
                <div className="text-lg font-extrabold text-accent-dark">{fmt(product.price)}</div>
                <Link
                  href={`/product/${product.id}`}
                  className="inline-block text-xs text-muted underline"
                >
                  View full details & permalink →
                </Link>

                {hasSizes && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {product.sizes!.map((size) => {
                      const cartKey = `${product.id}__${size}`;
                      const selected = selectedSize === size;
                      const inCart = qtyFor(cartKey) > 0;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                            selected || inCart
                              ? 'border-charcoal bg-charcoal text-white'
                              : 'border-border bg-white text-charcoal'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                )}

                <p className="pt-1 text-sm leading-relaxed text-charcoal/80">
                  {product.description}
                </p>

                <div className="space-y-1.5 pt-2 text-sm">
                  <SpecRow label="Fabric" value={product.fabric} />
                  <SpecRow label="Sizing" value={product.sizing} />
                  <SpecRow label="Turnaround" value={product.turnaround} />
                </div>
              </div>
            </div>

            <div className="border-t border-border p-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
              {!product.inStock ? (
                <div className="rounded-lg bg-red-50 py-3 text-center text-sm font-bold text-red-600">
                  FULLY BOOKED
                </div>
              ) : hasSizes ? (
                <button
                  disabled={!selectedSize}
                  onClick={() => {
                    if (selectedSize) {
                      addToCart(product, selectedSize);
                      onClose();
                    }
                  }}
                  className="w-full rounded-xl bg-charcoal py-3.5 text-sm font-bold text-white disabled:opacity-40"
                >
                  {selectedSize ? `Add Size ${selectedSize} to Bag` : 'Choose a size'}
                </button>
              ) : qtyFor(product.id) > 0 ? (
                <div className="flex items-center justify-between overflow-hidden rounded-xl border border-border">
                  <button
                    className="flex h-12 flex-1 items-center justify-center text-lg font-semibold"
                    onClick={() => changeQty(product.id, -1, product)}
                  >
                    −
                  </button>
                  <span className="px-4 text-base font-bold">{qtyFor(product.id)}</span>
                  <button
                    className="flex h-12 flex-1 items-center justify-center text-lg font-semibold"
                    onClick={() => changeQty(product.id, 1, product)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product)}
                  className="w-full rounded-xl bg-charcoal py-3.5 text-sm font-bold text-white"
                >
                  {product.id.startsWith('con') ? 'Book Slot' : 'Add to Bag'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-surface pb-1.5">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
