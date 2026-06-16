"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { ListingPublic } from '../../lib/db'
import { timeAgo } from '../../lib/time'
import ReportListingForm from './ReportListingForm'
import { captureEvent } from '../../lib/analytics'
import ListingImage from '../ui/ListingImage'

function LoadingState() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <article className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-64 rounded-lg bg-gray-200" />
        <div className="mt-4 h-4 w-24 rounded bg-gray-200" />
        <div className="mt-6 space-y-3">
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-4/6 rounded bg-gray-200" />
        </div>
      </article>
    </main>
  )
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="mt-2 text-sm leading-6 text-gray-600">{message}</p>
        <Link
          href="/browse"
          className="mt-5 inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Browse listings
        </Link>
      </section>
    </main>
  )
}

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
        if (payload.data?.id) {
          captureEvent('listing_viewed', {
            listing_id: payload.data.id,
            building_id: payload.data.building?.id ?? null
          })
        }
      } catch {
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
    return <LoadingState />
  }

  if (notFound) {
    return <EmptyState title="Listing not found." message="This listing may have been removed or expired." />
  }

  if (error) {
    return <EmptyState title="Could not load listing." message="Try again in a moment or browse recent listings instead." />
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
            <ListingImage
              imageUrl={item.image_url}
              thumbnailUrl={item.image_thumbnail_url}
              alt={`Listing ${item.id}`}
              className="w-full rounded-lg object-cover"
            />
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

      <ReportListingForm listingId={item.id} />
    </main>
  )
}
