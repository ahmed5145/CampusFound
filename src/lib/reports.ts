import 'server-only'

import { createModerationEvent } from './moderation-events'
import { getServiceSupabase } from './supabaseClient'
import type { ReportReason, ReportStatus } from '../types/db-schema'

export class DuplicateReportError extends Error {
  constructor() {
    super('You have already reported this listing.')
    this.name = 'DuplicateReportError'
  }
}

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
  reporterIpHash: string
}

type ReportRow = ReportRecord & {
  reporter_ip_hash?: string | null
}

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

export async function hasExistingReport(listingId: string, reporterIpHash: string): Promise<boolean> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reports')
    .select('id')
    .eq('listing_id', listingId)
    .eq('reporter_ip_hash', reporterIpHash)
    .maybeSingle<{ id: string }>()

  if (error) {
    throw error
  }

  return Boolean(data)
}

export async function createReport(input: CreateReportInput): Promise<ReportRecord> {
  const alreadyReported = await hasExistingReport(input.listingId, input.reporterIpHash)
  if (alreadyReported) {
    throw new DuplicateReportError()
  }

  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('reports')
    .insert({
      listing_id: input.listingId,
      reason: input.reason,
      details: input.details,
      reporter_ip_hash: input.reporterIpHash
    })
    .select('id, listing_id, reason, details, status, created_at, resolved_at')
    .single<ReportRow>()

  if (error) {
    if (error.code === '23505') {
      throw new DuplicateReportError()
    }
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

function moderationActionForReportStatus(status: ReportStatus): 'report_resolved' | 'report_dismissed' | 'report_reopened' {
  if (status === 'resolved') {
    return 'report_resolved'
  }
  if (status === 'dismissed') {
    return 'report_dismissed'
  }
  return 'report_reopened'
}

export async function updateReportStatus(id: string, status: ReportStatus): Promise<ReportRecord | null> {
  const supabase = getSupabase()

  const { data: existing, error: existingError } = await supabase
    .from('reports')
    .select('status, listing_id')
    .eq('id', id)
    .maybeSingle<{ status: ReportStatus; listing_id: string }>()

  if (existingError) {
    throw existingError
  }

  if (!existing) {
    return null
  }

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

  if (existing.status !== status) {
    await createModerationEvent({
      action: moderationActionForReportStatus(status),
      listingId: data.listing_id,
      reportId: data.id,
      previousStatus: existing.status,
      newStatus: status
    })
  }

  return toReport(data)
}
