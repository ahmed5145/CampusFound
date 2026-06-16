import 'server-only'

import { getServiceSupabase } from './supabaseClient'

export interface AdminStats {
  active_listings: number
  removed_listings: number
  open_reports: number
  moderation_events_24h: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = getServiceSupabase()
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const [activeListings, removedListings, openReports, recentEvents] = await Promise.all([
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'removed'),
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('moderation_events').select('id', { count: 'exact', head: true }).gte('created_at', since)
  ])

  if (activeListings.error) throw activeListings.error
  if (removedListings.error) throw removedListings.error
  if (openReports.error) throw openReports.error
  if (recentEvents.error) throw recentEvents.error

  return {
    active_listings: activeListings.count ?? 0,
    removed_listings: removedListings.count ?? 0,
    open_reports: openReports.count ?? 0,
    moderation_events_24h: recentEvents.count ?? 0
  }
}
