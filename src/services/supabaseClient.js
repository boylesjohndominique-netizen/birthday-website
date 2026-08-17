import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
// Supabase renamed the "anon key" to "publishable key" (sb_publishable_…).
// Accept both names so projects set up with either convention just work.
const anonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// IMPORTANT: only the public anon/publishable key belongs here. Never import a
// service role key into frontend code — see README.md "Security & privacy".
export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or ' +
    'VITE_SUPABASE_ANON_KEY) are not set. The app will run on local ' +
    'demo/fallback content until they are configured.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: false },
    })
  : null;

/**
 * Wrap a Supabase call so a missing/misconfigured client or a network error
 * never crashes the UI — callers get { data, error } either way.
 */
export async function safeQuery(queryFn) {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase is not configured yet.', code: 'NOT_CONFIGURED' } };
  }
  try {
    const { data, error } = await queryFn(supabase);
    if (error) return { data: null, error };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: err.message || 'Unexpected error', code: 'UNEXPECTED' } };
  }
}
