'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { STORE_NAME, STORE_TAGLINE } from '@/lib/format';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  categories: { name: string; icon: string }[];
  activeCategory: number;
  onSwitchTab: (idx: number) => void;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Header({
  categories,
  activeCategory,
  onSwitchTab,
  onOpenCart,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const { totalItems } = useCart();
  const router = useRouter();
  const lastTapRef = useRef(0);

  // Preserves the original prototype's "double tap the brand name to
  // reach the admin panel" easter egg — now routes to a real login page
  // instead of an in-page PIN modal.
  function handleTitleClick() {
    const now = Date.now();
    if (now - lastTapRef.current < 400) router.push('/admin/login');
    lastTapRef.current = now;
  }

  return (
    <header className="sticky top-0 z-40 bg-charcoal px-4 pt-4 text-white">
      <div className="mb-3.5 flex items-center justify-between">
        <div>
          <div
            onClick={handleTitleClick}
            className="cursor-pointer select-none text-xl font-bold tracking-tight"
          >
            {STORE_NAME}
          </div>
          <div className="text-[11px] text-white/45">{STORE_TAGLINE}</div>
        </div>
        <button
          onClick={onOpenCart}
          className="flex items-center gap-1.5 rounded-full bg-charcoal-3 px-3.5 py-2 text-[13px] font-semibold active:bg-accent"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          Bag
          <span className="rounded-full bg-accent px-1.5 py-px text-[11px] font-bold text-charcoal">
            {totalItems}
          </span>
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => onSwitchTab(i)}
            className={`flex-shrink-0 whitespace-nowrap border-b-[3px] pb-2 pt-1.5 text-sm font-semibold ${
              i === activeCategory
                ? 'border-accent text-white'
                : 'border-transparent text-white/60'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <div className="-mx-4 flex items-center gap-2 border-b border-white/10 bg-white px-4 py-2.5">
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search designs, accessories, or services..."
          className="flex-1 rounded-lg border border-gray-300 p-2.5 text-[15px] text-charcoal outline-none focus:border-accent"
        />
        <span className="rounded-lg bg-accent px-4 py-2.5 text-base text-charcoal">🔍</span>
      </div>
    </header>
  );
}
