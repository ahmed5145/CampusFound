import 'server-only'

import { getServiceSupabase } from './supabaseClient'
import type { ReportReason, ReportStatus } from '../types/db-schema'

export interface ReportRecord {
  id: string
  listing_id: string
  reason: ReportReason
  details: string | null
  status: ReportStatus
  created_at: string
  resolved_at: string | null
}

export interface CreateReportInput {
  listingId: string
  reason: ReportReason
  details: string | null
}

type ReportRow = ReportRecord

function getSupabase() {
  return getServiceSupabase()
}

function toReport(record: ReportRow): ReportRecord {
  return {
    id: record.id,
    listing_id: record.listing_id,
    reason: record.reason,
    details: record.details ?? null,
    status: record.status,
    created_at: record.created_at,
    resolved_at: record.resolved_at ?? null
  }
}

export async function listingExists(listingId: string): Promise<boolean> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('listings')
    .select('id')
    .eq('id', listingId)
    .maybeSingle<{ id: string }>()

  if (error) {
    throw error
  }

  return Boolean(data)
}

export async function createReport(input: CreateReportInput): Promise<ReportRecord> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('reports')
    .insert({
      listing_id: input.listingId,
      reason: input.reason,
      details: input.details
    })
    .select('id, listing_id, reason, details, status, created_at, resolved_at')
    .single<ReportRow>()

  if (error) {
    throw error
  }

  return toReport(data)
}

export async function getAdminReports(): Promise<ReportRecord[]> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('reports')
    .select('id, listing_id, reason, details, status, created_at, resolved_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => toReport(row as ReportRow))
}

export async function updateReportStatus(id: string, status: ReportStatus): Promise<ReportRecord | null> {
  const supabase = getSupabase()
  const resolvedAt = status === 'open' ? null : new Date().toISOString()

  const { data, error } = await supabase
    .from('reports')
    .update({
      status,
      resolved_at: resolvedAt
    })
    .eq('id', id)
    .select('id, listing_id, reason, details, status, created_at, resolved_at')
    .maybeSingle<ReportRow>()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  return toReport(data)
}
