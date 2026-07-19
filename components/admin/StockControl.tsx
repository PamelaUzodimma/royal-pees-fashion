'use client';

import { useEffect, useState } from 'react';
import { fmt } from '@/lib/format';

interface StockRow {
  productId: string;
  title: string;
  category: string;
  price: number;
  quantity: number;
}

export function StockControl() {
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    fetch('/api/admin/stock')
      .then((res) => res.json())
      .then((data) => setRows(data.rows ?? []))
      .finally(() => setLoading(false));
  }

  async function adjust(productId: string, delta: number) {
    // Optimistic update for a snappy feel; reconciled by the response.
    setRows((prev) =>
      prev.map((r) =>
        r.productId === productId
          ? { ...r, quantity: Math.max(0, r.quantity + delta) }
          : r
      )
    );
    const res = await fetch('/api/admin/stock', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, delta }),
    });
    if (!res.ok) load(); // roll back to server truth on failure
  }

  if (loading) {
    return <div className="py-6 text-center text-xs text-gray-400">Loading stock data…</div>;
  }

  return (
    <div>
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-500">
        💡 Control fabric, slots, accessories or advisory availability. Setting a quantity to 0
        disables it dynamically in the customer storefront.
      </div>

      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.productId}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 text-xs shadow-sm"
          >
            <div className="min-w-0 flex-1 pr-3">
              <div className="truncate font-bold text-gray-800">{row.title}</div>
              <div className="mt-0.5 text-[10px] text-gray-400">
                {row.category} · Price: {fmt(row.price)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 font-black">{row.quantity} Left</span>
              <button
                onClick={() => adjust(row.productId, 5)}
                className="rounded bg-gray-100 px-2 py-1 font-bold"
              >
                +5
              </button>
              <button
                onClick={() => adjust(row.productId, -5)}
                className="rounded bg-gray-100 px-2 py-1 font-bold"
              >
                -5
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
