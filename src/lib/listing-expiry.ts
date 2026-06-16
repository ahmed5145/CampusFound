import 'server-only'

import { createModerationEvent } from './moderation-events'
import { getServiceSupabase } from './supabaseClient'

type ExpiredListingRow = {
  id: string
  status: 'active' | 'removed'
}

export async function expireStaleListings(): Promise<number> {
  const supabase = getServiceSupabase()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('listings')
    .select('id, status')
    .eq('status', 'active')
    .lte('expires_at', now)
    .limit(200)

  if (error) {
    throw error
  }

  const rows = (data ?? []) as ExpiredListingRow[]
  if (rows.length === 0) {
    return 0
  }

  let expiredCount = 0

  for (const row of rows) {
    const { error: updateError } = await supabase
      .from('listings')
      .update({ status: 'removed' })
      .eq('id', row.id)
      .eq('status', 'active')

    if (updateError) {
      throw updateError
    }

    await createModerationEvent({
      action: 'listing_removed',
      listingId: row.id,
      previousStatus: row.status,
      newStatus: 'removed',
      note: 'Expired automatically'
    })

    expiredCount += 1
  }

  return expiredCount
}
