import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client. Prefers the service-role key (never expose it
// with a NEXT_PUBLIC_ prefix). Falls back to the anon key so the API keeps
// working until SUPABASE_SERVICE_ROLE_KEY is configured — but warns loudly,
// because the anon-key path depends on permissive RLS policies.
const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

if (!serviceKey) {
  console.warn(
    '[supabase-server] SUPABASE_SERVICE_ROLE_KEY is not set — falling back to the anon key. ' +
    'Set it in the environment and lock down RLS (see docs/SUPABASE-RLS.md) before launch.',
  )
}

export const supabaseServer = createClient(url, serviceKey ?? anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
