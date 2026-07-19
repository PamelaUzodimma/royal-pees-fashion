'use client';

import { useEffect, useMemo, useState } from 'react';
import { fmt } from '@/lib/format';
import { SalesLogRow } from '@/types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function SalesLog() {
  const [rows, setRows] = useState<SalesLogRow[]>([]);
  const [totals, setTotals] = useState({ orders: 0, revenue: 0, profit: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/sales')
      .then((res) => res.json())
      .then((data) => {
        setRows(data.rows ?? []);
        setTotals(data.totals ?? { orders: 0, revenue: 0, profit: 0 });
      })
      .finally(() => setLoading(false));
  }, []);

  const monthlyGroups = useMemo(() => {
    const groups = new Map<string, { label: string; units: number; rows: SalesLogRow[] }>();
    for (const row of rows) {
      const d = new Date(row.createdAt);
      const key = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
      const g = groups.get(key) ?? { label: key, units: 0, rows: [] };
      g.units += row.totalItemsSold;
      g.rows.push(row);
      groups.set(key, g);
    }
    return Array.from(groups.values());
  }, [rows]);

  if (loading) {
    return <div className="py-6 text-center text-xs text-gray-400">Loading sales data…</div>;
  }

  return (
    <div>
      <div className="mb-5 grid grid-cols-3 gap-3">
        <StatCard label="Items Booked" value={String(totals.orders)} color="text-gray-800" />
        <StatCard label="Gross Inflow" value={fmt(totals.revenue)} color="text-green-600" />
        <StatCard label="Net Margin" value={fmt(totals.profit)} color="text-orange-600" />
      </div>

      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
        Monthly Fashion Orders History
      </h3>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
          No client records found.
        </div>
      ) : (
        <div className="space-y-4">
          {monthlyGroups.map((group) => (
            <div key={group.label} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between bg-neutral-800 p-3 text-xs font-bold text-white">
                <div>📅 {group.label} Metrics</div>
                <div>{group.units} Items</div>
              </div>
              <div className="max-h-64 space-y-2 overflow-y-auto p-2">
                {group.rows.map((row) => (
                  <div key={row.orderId} className="rounded border border-gray-100 bg-gray-50 p-2 text-[11px]">
                    <div className="font-semibold text-gray-800">{row.itemsText}</div>
                    <div className="mt-1 text-gray-500">
                      Value: {fmt(row.revenue)} · ID: {row.orderId}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className={`mt-1 text-lg font-black ${color}`}>{value}</p>
    </div>
  );
}
