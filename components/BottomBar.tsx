'use client';

import { useCart } from '@/context/CartContext';
import { fmt } from '@/lib/format';

export function BottomBar({ onOpenCart }: { onOpenCart: () => void }) {
  const { totalItems, totalPrice } = useCart();
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] flex items-center gap-3 bg-charcoal px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3">
      <div className="flex-1">
        <div className="text-[11px] font-medium text-white/55">
          {totalItems} item{totalItems !== 1 ? 's' : ''} selected
        </div>
        <div className="text-lg font-extrabold text-white">{fmt(totalPrice)}</div>
      </div>
      <button
        onClick={onOpenCart}
        className="rounded-xl bg-accent px-5 py-3 text-sm font-bold text-charcoal"
      >
        Review Order →
      </button>
    </div>
  );
}
