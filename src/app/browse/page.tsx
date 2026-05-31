'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { ListingPublic, ListingsPage } from '../../lib/db'

export default function Page() {
  const [listings, setListings] = useState<ListingPublic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/items')
        if (!res.ok) {
          throw new Error('Failed to load')
        }

        const payload = (await res.json()) as ListingsPage
        if (!isActive) return

        setListings(payload.data ?? [])
      } catch (err) {
        if (!isActive) return
        setError('Could not load listings.')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void load()

    return () => {
      isActive = false
    }
  }, [])

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <p className="text-center text-sm text-gray-600">Loading listings…</p>
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

  if (listings.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <p className="text-center text-sm text-gray-600">No listings yet.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Recent listings</h1>
      <div className="grid gap-6">
        {listings.map((item) => (
          <Link key={item.id} href={`/items/${item.id}`} className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow">
            <div className="flex gap-4">
              <div className="w-36 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={`Listing ${item.id}`} className="h-24 w-full object-cover" />
                ) : (
                  <div className="h-24 w-full bg-gray-200" />
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">{item.building?.name}</div>
                  <div className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</div>
                </div>

                <div className="mt-2 text-sm text-gray-700">
                  <div className="font-medium text-gray-800">{item.location_type.replaceAll('_', ' ')}</div>
                  {item.location_details ? <div className="mt-1 text-gray-600">{item.location_details}</div> : null}
                  {item.description ? <div className="mt-2 text-gray-600">{item.description}</div> : null}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
