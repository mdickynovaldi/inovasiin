import "server-only";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

/**
 * Server-only Supabase client for the portfolio API routes.
 *
 * Prefers SUPABASE_SERVICE_ROLE_KEY (server-only, bypasses RLS) when set;
 * otherwise falls back to the anon key, which already has full read/write
 * access here because the project's RLS policies are permissive. Either way
 * this module must never be imported into client components — `server-only`
 * makes that a build error.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseAdmin = createClient<Database>(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
