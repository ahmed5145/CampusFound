import 'server-only'

import { getServiceSupabase } from './supabaseClient'

let cachedCampusId: string | null | undefined

export function getConfiguredCampusSlug(): string | null {
  const slug = process.env.NEXT_PUBLIC_CAMPUS_SLUG?.trim()
  return slug ? slug.toLowerCase() : null
}

export function getConfiguredCampusName(): string {
  return process.env.NEXT_PUBLIC_CAMPUS_NAME?.trim() || 'Campus Found'
}

export async function getCampusIdForScope(): Promise<string | null> {
  const slug = getConfiguredCampusSlug()
  if (!slug) {
    return null
  }

  if (cachedCampusId !== undefined) {
    return cachedCampusId
  }

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('campuses')
    .select('id')
    .eq('slug', slug)
    .maybeSingle<{ id: string }>()

  if (error) {
    throw error
  }

  cachedCampusId = data?.id ?? null
  return cachedCampusId
}
