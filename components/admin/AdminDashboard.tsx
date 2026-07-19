'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SalesLog } from './SalesLog';
import { StockControl } from './StockControl';

export function AdminDashboard() {
  const [tab, setTab] = useState<'sales' | 'stock'>('sales');
  const router = useRouter();

  async function handleExit() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between bg-charcoal p-4 text-white">
        <div>
          <h2 className="text-lg font-bold">👑 Fashion House Management</h2>
          <p className="text-xs text-neutral-400">Track monthly apparel metrics & slots</p>
        </div>
        <button
          onClick={handleExit}
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-bold text-charcoal"
        >
          Exit Panel
        </button>
      </div>

      <div className="flex gap-2 border-b border-gray-200 bg-white p-3">
        <button
          onClick={() => setTab('sales')}
          className={`rounded-lg border px-4 py-2 text-[13px] font-semibold ${
            tab === 'sales' ? 'border-accent bg-accent text-charcoal' : 'border-border bg-white'
          }`}
        >
          📅 Revenue Logs
        </button>
        <button
          onClick={() => setTab('stock')}
          className={`rounded-lg border px-4 py-2 text-[13px] font-semibold ${
            tab === 'stock' ? 'border-accent bg-accent text-charcoal' : 'border-border bg-white'
          }`}
        >
          📦 Materials & Slots
        </button>
      </div>

      <div className="flex-1 bg-[#F8F9FA] p-4">
        {tab === 'sales' ? <SalesLog /> : <StockControl />}
      </div>
    </div>
  );
}
