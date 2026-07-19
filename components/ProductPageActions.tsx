'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductWithStock } from '@/types';
import { useCart } from '@/context/CartContext';

export function ProductPageActions({ product }: { product: ProductWithStock }) {
  const { qtyFor, addToCart, changeQty } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const hasSizes = !!product.sizes && product.sizes.length > 0;
  const cartKey = selectedSize ? `${product.id}__${selectedSize}` : product.id;

  if (!product.inStock) {
    return (
      <div className="rounded-lg bg-red-50 py-3 text-center text-sm font-bold text-red-600">
        FULLY BOOKED
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {hasSizes && (
        <div className="flex flex-wrap gap-2">
          {product.sizes!.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                selectedSize === size
                  ? 'border-charcoal bg-charcoal text-white'
                  : 'border-border bg-white text-charcoal'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}

      {hasSizes && !selectedSize ? (
        <button
          disabled
          className="w-full rounded-xl bg-charcoal py-3.5 text-sm font-bold text-white opacity-40"
        >
          Choose a size
        </button>
      ) : qtyFor(cartKey) > 0 ? (
        <div className="flex items-center justify-between overflow-hidden rounded-xl border border-border">
          <button
            className="flex h-12 flex-1 items-center justify-center text-lg font-semibold"
            onClick={() => changeQty(cartKey, -1, product)}
          >
            −
          </button>
          <span className="px-4 text-base font-bold">{qtyFor(cartKey)}</span>
          <button
            className="flex h-12 flex-1 items-center justify-center text-lg font-semibold"
            onClick={() => changeQty(cartKey, 1, product)}
          >
            +
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            addToCart(product, selectedSize);
            setJustAdded(true);
          }}
          className="w-full rounded-xl bg-charcoal py-3.5 text-sm font-bold text-white"
        >
          {product.id.startsWith('con') ? 'Book Slot' : 'Add to Bag'}
        </button>
      )}

      {justAdded && (
        <div className="rounded-lg bg-green-50 py-2 text-center text-xs font-semibold text-green-700">
          Added to bag —{' '}
          <Link href="/" className="underline">
            continue browsing the full catalog
          </Link>
        </div>
      )}
    </div>
  );
}
