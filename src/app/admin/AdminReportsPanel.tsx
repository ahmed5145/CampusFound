'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { REPORT_REASON_LABELS } from '../../config/constants'
import type { ReportReason, ReportStatus } from '../../types/db-schema'

type AdminReport = {
  id: string
  listing_id: string
  reason: ReportReason
  details: string | null
  status: ReportStatus
  created_at: string
  resolved_at: string | null
}

function formatCreatedAt(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

export default function AdminReportsPanel({ onModerationChange }: { onModerationChange?: () => void }) {
  const [reports, setReports] = useState<AdminReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({})

  const openCount = useMemo(() => reports.filter((report) => report.status === 'open').length, [reports])

  useEffect(() => {
    let isActive = true

    async function loadReports() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await fetch('/api/admin/reports')
        if (!response.ok) {
          throw new Error('Could not load reports.')
        }

        const payload = (await response.json()) as { data?: AdminReport[] }
        if (!isActive) {
          return
        }

        setReports(payload.data ?? [])
      } catch {
        if (!isActive) {
          return
        }

        setReports([])
        setErrorMessage('Could not load reports.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadReports()

    return () => {
      isActive = false
    }
  }, [])

  async function updateReportStatus(id: string, status: ReportStatus) {
    const currentReport = reports.find((report) => report.id === id)
    if (!currentReport) {
      return
    }

    setActionError(null)
    setUpdatingIds((current) => ({ ...current, [id]: true }))

    const optimisticReport = {
      ...currentReport,
      status,
      resolved_at: status === 'open' ? null : new Date().toISOString()
    }

    setReports((current) => current.map((report) => (report.id === id ? optimisticReport : report)))

    try {
      const response = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Could not update report.')
      }

      const payload = (await response.json().catch(() => null)) as { data?: AdminReport } | null
      if (payload?.data) {
        setReports((current) => current.map((report) => (report.id === id ? payload.data! : report)))
      }
      onModerationChange?.()
    } catch {
      setReports((current) => current.map((report) => (report.id === id ? currentReport : report)))
      setActionError('Could not update report status.')
    } finally {
      setUpdatingIds((current) => {
        const next = { ...current }
        delete next[id]
        return next
      })
    }
  }

  return (
    <section className="mt-8">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
        <p className="mt-1 text-sm text-gray-600">
          {openCount} open report{openCount === 1 ? '' : 's'} in the current queue.
        </p>
      </div>

      {isLoading ? <p className="mt-4 text-sm text-gray-600">Loading reports…</p> : null}
      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {errorMessage}
        </div>
      ) : null}
      {actionError ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {actionError}
        </div>
      ) : null}

      {!isLoading && !errorMessage && reports.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-sm font-medium text-gray-900">No reports yet.</p>
          <p className="mt-2 text-sm text-gray-600">User-submitted reports will appear here for review.</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4">
        {reports.map((report) => {
          const isUpdating = Boolean(updatingIds[report.id])
          const isOpen = report.status === 'open'

          return (
            <article key={report.id} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{REPORT_REASON_LABELS[report.reason]}</p>
                  <p className="mt-1 text-xs text-gray-500">{formatCreatedAt(report.created_at)}</p>
                </div>

                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ${
                    isOpen ? 'bg-amber-50 text-amber-800' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {report.status}
                </span>
              </div>

              {report.details ? <p className="mt-3 text-sm text-gray-700">{report.details}</p> : null}

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href={`/items/${report.listing_id}`}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
                >
                  View listing
                </Link>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void updateReportStatus(report.id, 'dismissed')}
                    disabled={isUpdating || report.status === 'dismissed'}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    onClick={() => void updateReportStatus(report.id, 'resolved')}
                    disabled={isUpdating || report.status === 'resolved'}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-brand-navy px-4 text-sm font-medium text-white transition-colors hover:bg-brand-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
