import 'server-only'

import { getServiceSupabase } from './supabaseClient'

export type ModerationAction =
  | 'listing_removed'
  | 'listing_restored'
  | 'report_resolved'
  | 'report_dismissed'
  | 'report_reopened'

export interface ModerationEventRecord {
  id: string
  action: ModerationAction
  listing_id: string | null
  report_id: string | null
  previous_status: string | null
  new_status: string | null
  note: string | null
  created_at: string
}

export interface CreateModerationEventInput {
  action: ModerationAction
  listingId?: string | null
  reportId?: string | null
  previousStatus?: string | null
  newStatus?: string | null
  note?: string | null
}

type ModerationEventRow = ModerationEventRecord

function getSupabase() {
  return getServiceSupabase()
}

function toEvent(record: ModerationEventRow): ModerationEventRecord {
  return {
    id: record.id,
    action: record.action,
    listing_id: record.listing_id ?? null,
    report_id: record.report_id ?? null,
    previous_status: record.previous_status ?? null,
    new_status: record.new_status ?? null,
    note: record.note ?? null,
    created_at: record.created_at
  }
}

export async function createModerationEvent(input: CreateModerationEventInput): Promise<void> {
  const supabase = getSupabase()

  const { error } = await supabase.from('moderation_events').insert({
    action: input.action,
    listing_id: input.listingId ?? null,
    report_id: input.reportId ?? null,
    previous_status: input.previousStatus ?? null,
    new_status: input.newStatus ?? null,
    note: input.note ?? null
  })

  if (error) {
    throw error
  }
}

export async function getRecentModerationEvents(limit: number = 20): Promise<ModerationEventRecord[]> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('moderation_events')
    .select('id, action, listing_id, report_id, previous_status, new_status, note, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => toEvent(row as ModerationEventRow))
}
