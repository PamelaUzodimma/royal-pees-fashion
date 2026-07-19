'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleUnlock() {
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        router.push('/admin');
      } else {
        setError(true);
        setPin('');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-charcoal p-8">
      <div className="text-center text-[22px] font-bold text-white">
        🔐 Designer Dashboard Unlock
      </div>
      <div className="max-w-[260px] text-center text-[13.5px] text-white/45">
        Enter your security PIN code to access backend operations and order financial logs.
      </div>

      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="••••"
        className="w-full max-w-[240px] rounded-xl border border-charcoal-3 bg-charcoal-2 p-3.5 text-center text-2xl font-bold tracking-[6px] text-white outline-none focus:border-accent"
      />

      {error && (
        <div className="text-[13px] font-medium text-[#FF6B6B]">
          ❌ Incorrect Authorization Code
        </div>
      )}

      <button
        onClick={handleUnlock}
        disabled={submitting || pin.length === 0}
        className="w-full max-w-[240px] rounded-xl bg-accent p-3.5 text-[15px] font-bold text-charcoal disabled:opacity-60"
      >
        {submitting ? 'Checking…' : 'Unlock Terminal'}
      </button>

      <a href="/" className="mt-1 text-xs text-gray-400 underline">
        Return to Gallery
      </a>
    </div>
  );
}
