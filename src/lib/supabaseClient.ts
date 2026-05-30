// Supabase client initialization
// - Exports a browser-safe `supabase` client using the public anon key
// - Exports a helper `getServiceSupabase()` to create a server-side client using the service role key
// Notes: install `@supabase/supabase-js` and ensure environment variables are set.

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Fail fast: these public vars are required for the client to operate correctly.
if (!publicUrl || !publicAnonKey) {
	throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables')
}

export const supabase: SupabaseClient = createClient(publicUrl, publicAnonKey, {
	auth: { persistSession: false }
})

// Factory for server-side service role client. Use only in server-side code.
export function getServiceSupabase(): SupabaseClient {
	if (!publicUrl || !serviceRoleKey) {
		throw new Error('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL not configured')
	}
	return createClient(publicUrl, serviceRoleKey)
}

export default supabase
