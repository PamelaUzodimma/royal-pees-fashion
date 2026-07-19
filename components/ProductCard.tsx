'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ProductWithStock } from '@/types';
import { fmt, placeholderIcon } from '@/lib/format';
import { useCart } from '@/context/CartContext';

export function ProductCard({
  product,
  onOpenDetail,
}: {
  product: ProductWithStock;
  onOpenDetail: (productId: string) => void;
}) {
  const { qtyFor, aggQtyForProduct, addToCart, changeQty } = useCart();
  const [imgFailed, setImgFailed] = useState(false);

  const hasSizes = !!product.sizes && product.sizes.length > 0;
  const qty = qtyFor(product.id);
  const aggQty = hasSizes ? aggQtyForProduct(product.id) : qty;
  const oos = !product.inStock;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border border-border bg-white p-3 ${
        oos ? 'opacity-55' : ''
      }`}
    >
      {oos && (
        <span className="absolute left-2 top-2 z-10 rounded-md bg-red-600/90 px-2 py-1 text-[10px] font-extrabold tracking-wide text-white">
          NOT AVAILABLE
        </span>
      )}

      <button
        onClick={() => onOpenDetail(product.id)}
        className="relative mb-2.5 aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#EAEAEA]"
      >
        {product.image && !imgFailed ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(min-width: 640px) 33vw, 50vw"
            className="object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#f0ede8] to-[#e5e0d8] text-3xl">
            {placeholderIcon(product.id)}
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col justify-between gap-2.5">
        <button
          onClick={() => onOpenDetail(product.id)}
          className="flex flex-col gap-1 text-left"
        >
          <span className="line-clamp-2 text-[13.5px] font-semibold leading-tight text-charcoal">
            {product.title}
          </span>
          <span className="text-sm font-bold text-accent-dark">{fmt(product.price)}</span>
          {!oos && (
            <span className="text-[10px] font-semibold text-green-600">In Stock</span>
          )}
        </button>

        <div className="mt-auto w-full">
          {oos ? (
            <div className="rounded-lg bg-red-50 py-2 text-center text-xs font-bold text-red-600">
              FULLY BOOKED
            </div>
          ) : hasSizes ? (
            <button
              onClick={() => onOpenDetail(product.id)}
              className="w-full rounded-lg bg-charcoal py-2 text-xs font-bold text-white active:bg-accent"
            >
              {aggQty > 0 ? `Edit Selection (${aggQty})` : 'Select Size'}
            </button>
          ) : qty > 0 ? (
            <div className="flex items-center justify-between overflow-hidden rounded-lg border border-border bg-surface">
              <button
                className="flex h-8 w-8 items-center justify-center font-semibold active:bg-border"
                onClick={() => changeQty(product.id, -1, product)}
              >
                −
              </button>
              <span className="text-[13.5px] font-bold">{qty}</span>
              <button
                className="flex h-8 w-8 items-center justify-center font-semibold active:bg-border"
                onClick={() => changeQty(product.id, 1, product)}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="w-full rounded-lg bg-charcoal py-2 text-xs font-bold text-white active:bg-accent"
            >
              {product.id.startsWith('con') ? 'Book Slot' : 'Add to Bag'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
