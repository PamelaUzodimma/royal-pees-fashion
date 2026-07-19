import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createRawClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Plain anon-key client for contexts with no request cookies to read —
 * e.g. app/sitemap.ts, which Next.js doesn't run inside a normal request
 * lifecycle. Still respects RLS (read-only on active products).
 */
export function createPublicSupabaseClient() {
  return createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Server component / API route client, scoped to the request's cookies.
 * Still uses the anon key + RLS — safe for reading public catalog data.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render — safe to ignore
            // when middleware also refreshes the session.
          }
        },
      },
    }
  );
}

/**
 * Privileged client using the service-role key. This BYPASSES Row Level
 * Security entirely. It must only ever be imported from server-only code
 * (API routes under app/api/**) that has already verified the caller is
 * an authenticated admin (see lib/admin-auth.ts). Never import this from
 * a Client Component or expose it to the browser bundle.
 */
export function createAdminSupabaseClient() {
  return createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
