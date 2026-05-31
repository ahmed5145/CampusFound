"use client"

import { useEffect, useState } from 'react'
import type { ListingPublic } from '../../lib/db'
import { timeAgo } from '../../lib/time'

export default function ItemDetail({ id }: { id: string }) {
  const [item, setItem] = useState<ListingPublic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function load() {
      setIsLoading(true)
      setError(null)
      setNotFound(false)

      try {
        const res = await fetch(`/api/items/${id}`)
        if (res.status === 404) {
          if (!isActive) return
          setNotFound(true)
          return
        }

        if (!res.ok) {
          throw new Error('Request failed')
        }

        const payload = await res.json()
        if (!isActive) return
        setItem(payload.data ?? null)
      } catch (err) {
        if (!isActive) return
        setError('Could not load listing.')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void load()
    return () => {
      isActive = false
    }
  }, [id])

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <p className="text-center text-sm text-gray-600">Loading listing…</p>
      </main>
    )
  }

  if (notFound) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <p className="text-center text-sm text-gray-600">Listing not found.</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <p className="text-center text-sm text-red-600">{error}</p>
      </main>
    )
  }

  if (!item) {
    return null
  }

  const locationTypeLabel =
    item.location_type === 'other' && item.other_location_type
      ? `Other - ${item.other_location_type}`
      : item.location_type.replaceAll('_', ' ')

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image_url} alt={`Listing ${item.id}`} className="w-full rounded-lg object-cover" />
          ) : (
            <div className="h-48 w-full rounded-lg bg-gray-100" />
          )}
          <div className="mt-2 text-sm text-gray-500">Posted {timeAgo(item.created_at)}</div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">{item.building?.name ?? 'Listing'}</h1>

        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <div>
            <strong className="mr-2">Location type:</strong>
            <span>{locationTypeLabel}</span>
          </div>

          <div>
            <strong className="mr-2">Location details:</strong>
            <span>{item.location_details ?? '—'}</span>
          </div>

          <div>
            <strong className="mr-2">Description:</strong>
            <span>{item.description ?? '—'}</span>
          </div>

          <div>
            <strong className="mr-2">Posted:</strong>
            <span>{timeAgo(item.created_at)}</span>
          </div>
        </div>
      </article>
    </main>
  )
}
