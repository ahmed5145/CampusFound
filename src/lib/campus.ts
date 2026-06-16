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

export async function getBuildingIdsForCampusScope(): Promise<string[] | null> {
  const campusId = await getCampusIdForScope()
  if (!campusId) {
    return null
  }

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('buildings')
    .select('id')
    .or(`campus_id.eq.${campusId},campus_id.is.null`)

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => row.id as string)
}
