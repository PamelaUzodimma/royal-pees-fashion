'use client';

import { useCart } from '@/context/CartContext';
import { fmt, placeholderIcon } from '@/lib/format';
import { ProductWithStock } from '@/types';

export function CartDrawer({
  open,
  onClose,
  productsById,
  onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  productsById: Map<string, ProductWithStock>;
  onCheckout: () => void;
}) {
  const { cart, totalPrice, changeQty, clearCart } = useCart();
  const items = Object.values(cart);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[300] bg-black/50 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-[400] flex max-h-[85vh] flex-col rounded-t-2xl bg-white transition-transform duration-200 ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto mt-3 h-1 w-9 rounded-full bg-border" />
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="text-[17px] font-bold">Selected Items</div>
          <button
            onClick={() => {
              if (items.length && confirm('Clear selections?')) clearCart();
            }}
            className="rounded-md border border-border px-2.5 py-1.5 text-xs text-muted"
          >
            Clear all
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-10 text-center text-muted">🛒 Selection bag is empty.</div>
          ) : (
            items.map((item) => {
              const product = productsById.get(item.productId);
              return (
                <div key={item.cartKey} className="flex items-center gap-3 border-b border-surface px-5 py-3">
                  <div className="flex h-[58px] w-11 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-xl">
                    {placeholderIcon(item.productId)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-semibold">{item.title}</div>
                    <div className="mt-0.5 text-[11px] text-muted">
                      {item.category} · {item.subCategoryName}
                      {item.size ? ` · Size: ${item.size}` : ''}
                    </div>
                    <div className="mt-0.5 text-[13px] font-bold text-accent-dark">
                      {fmt(item.price * item.qty)}
                    </div>
                  </div>
                  {product && (
                    <div className="flex flex-shrink-0 items-center overflow-hidden rounded-lg border border-border bg-surface">
                      <button
                        className="flex h-8 w-8 items-center justify-center font-semibold"
                        onClick={() => changeQty(item.cartKey, -1, product)}
                      >
                        -
                      </button>
                      <span className="px-2 text-[13.5px] font-bold">{item.qty}</span>
                      <button
                        className="flex h-8 w-8 items-center justify-center font-semibold"
                        onClick={() => changeQty(item.cartKey, 1, product)}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
            <div className="mb-3.5 flex justify-between">
              <span className="text-muted">Total Due</span>
              <span className="text-[22px] font-extrabold">{fmt(totalPrice)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 text-[15px] font-bold text-white"
            >
              Submit to Tailor via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
