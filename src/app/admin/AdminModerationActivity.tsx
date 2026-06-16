'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { ModerationAction } from '../../lib/moderation-events'

type ModerationEvent = {
  id: string
  action: ModerationAction
  listing_id: string | null
  report_id: string | null
  previous_status: string | null
  new_status: string | null
  note: string | null
  created_at: string
}

const ACTION_LABELS: Record<ModerationAction, string> = {
  listing_removed: 'Listing removed',
  listing_restored: 'Listing restored',
  report_resolved: 'Report resolved',
  report_dismissed: 'Report dismissed',
  report_reopened: 'Report reopened'
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

export default function AdminModerationActivity() {
  const [events, setEvents] = useState<ModerationEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadEvents() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await fetch('/api/admin/moderation-events')
        if (!response.ok) {
          throw new Error('Could not load moderation activity.')
        }

        const payload = (await response.json()) as { data?: ModerationEvent[] }
        if (!isActive) {
          return
        }

        setEvents(payload.data ?? [])
      } catch {
        if (!isActive) {
          return
        }

        setEvents([])
        setErrorMessage('Could not load moderation activity.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadEvents()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <section className="mt-8">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Moderation activity</h2>
        <p className="mt-1 text-sm text-gray-600">Recent listing and report actions.</p>
      </div>

      {isLoading ? <p className="mt-4 text-sm text-gray-600">Loading activity…</p> : null}
      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage && events.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-sm font-medium text-gray-900">No moderation activity yet.</p>
          <p className="mt-2 text-sm text-gray-600">Actions taken in the admin dashboard will appear here.</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3">
        {events.map((event) => (
          <article key={event.id} className="rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium text-gray-900">{ACTION_LABELS[event.action]}</p>
              <p className="text-xs text-gray-500">{formatCreatedAt(event.created_at)}</p>
            </div>

            {event.previous_status || event.new_status ? (
              <p className="mt-2 text-gray-600">
                {event.previous_status ?? '—'} → {event.new_status ?? '—'}
              </p>
            ) : null}

            {event.listing_id ? (
              <Link href={`/items/${event.listing_id}`} className="mt-2 inline-block text-gray-600 hover:text-gray-900 hover:underline">
                View listing
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
