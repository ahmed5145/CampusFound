// Supabase client initialization
// - Exports a browser-safe `supabase` client using the public anon key
// - Exports a helper `getServiceSupabase()` to create a server-side client using the service role key
// Notes: install `@supabase/supabase-js` and ensure environment variables are set.

import { createClient, SupabaseClient } from '@supabase/supabase-js'

let publicClient: SupabaseClient | null = null

export function getPublicSupabase(): SupabaseClient {
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!publicUrl || !publicAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables')
  }

  if (!publicClient) {
    publicClient = createClient(publicUrl, publicAnonKey, {
      auth: { persistSession: false }
    })
  }

  return publicClient
}

// Back-compat: some code may still import `supabase`.
// This will only throw when actually accessed, not at build-time module evaluation.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getPublicSupabase()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (client as any)[prop]
  }
})

// Factory for server-side service role client. Use only in server-side code.
export function getServiceSupabase(): SupabaseClient {
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!publicUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL not configured')
  }

  return createClient(publicUrl, serviceRoleKey)
}

export default supabase
