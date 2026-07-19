import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client. Uses the public anon key only —
 * RLS policies (see supabase/policies.sql) restrict it to read-only
 * access on `products`, and no access at all to `orders` or writes
 * to `stock_levels`. Never import the service-role client here.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
