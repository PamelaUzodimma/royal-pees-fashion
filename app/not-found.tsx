import Link from 'next/link';
import { STORE_NAME } from '@/lib/format';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface p-8 text-center">
      <div className="text-5xl">🧵</div>
      <h1 className="text-xl font-bold text-charcoal">This page isn't available anymore</h1>
      <p className="max-w-[300px] text-sm text-muted">
        The item or page you're looking for may have been removed or the link is out of date.
        Browse the current {STORE_NAME} catalog instead.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-charcoal px-5 py-3 text-sm font-bold text-white"
      >
        View Full Catalog
      </Link>
    </div>
  );
}
