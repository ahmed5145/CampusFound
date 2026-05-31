'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type AdminListingStatus = 'active' | 'removed'

type AdminBuilding = {
  id: string
  name: string
}

type AdminListing = {
  id: string
  image_url: string
  building: AdminBuilding
  location_type: string
  other_location_type: string | null
  location_details: string | null
  description: string | null
  status: AdminListingStatus
  created_at: string
  expires_at: string
}

type ListingsResponse = {
  data?: AdminListing[]
  pageInfo?: {
    total?: number
  }
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

function formatLocationType(item: AdminListing): string {
  if (item.location_type === 'other' && item.other_location_type) {
    return `Other - ${item.other_location_type}`
  }

  return item.location_type.replaceAll('_', ' ')
}

function previewDescription(value: string | null): string {
  if (!value) {
    return 'No description provided.'
  }

  return value.length > 120 ? `${value.slice(0, 117)}...` : value
}

export default function AdminDashboard() {
  const router = useRouter()
  const [listings, setListings] = useState<AdminListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isActionPending, setIsActionPending] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({})

  const totalCount = useMemo(() => listings.length, [listings.length])

  useEffect(() => {
    let isActive = true

    async function loadListings() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await fetch('/api/admin/listings')

        if (!response.ok) {
          throw new Error('Could not load listings.')
        }

        const payload = (await response.json()) as ListingsResponse

        if (!isActive) {
          return
        }

        setListings(payload.data ?? [])
      } catch {
        if (!isActive) {
          return
        }

        setListings([])
        setErrorMessage('Could not load listings.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadListings()

    return () => {
      isActive = false
    }
  }, [])

  async function updateListingStatus(id: string, status: AdminListingStatus) {
    const currentListing = listings.find((item) => item.id === id)
    if (!currentListing) {
      return
    }

    setActionError(null)
    setIsActionPending(true)
    setUpdatingIds((current) => ({ ...current, [id]: true }))

    const optimisticListing = {
      ...currentListing,
      status
    }

    setListings((current) => current.map((item) => (item.id === id ? optimisticListing : item)))

    try {
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Could not update listing status.')
      }

      const payload = (await response.json().catch(() => null)) as { data?: AdminListing } | null
      if (payload?.data) {
        setListings((current) => current.map((item) => (item.id === id ? payload.data! : item)))
      }
    } catch {
      setListings((current) => current.map((item) => (item.id === id ? currentListing : item)))
      setActionError('Could not update listing status.')
    } finally {
      setUpdatingIds((current) => {
        const next = { ...current }
        delete next[id]
        return next
      })
      setIsActionPending(false)
    }
  }

  async function handleLogout() {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)
    setActionError(null)

    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' })

      if (!response.ok) {
        throw new Error('Could not log out.')
      }

      router.replace('/admin/login')
      router.refresh()
    } catch {
      setActionError('Could not log out.')
      setIsLoggingOut(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Admin dashboard</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">Recent listings</h1>
          <p className="mt-2 text-sm text-gray-600">Showing {totalCount} listings from the moderation queue.</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex h-11 items-center justify-center rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? 'Logging out…' : 'Logout'}
        </button>
      </div>

      <div className="mt-6">
        {isLoading ? <p className="text-sm text-gray-600">Loading listings…</p> : null}
        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            {errorMessage}
          </div>
        ) : null}
        {actionError ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            {actionError}
          </div>
        ) : null}

        {!isLoading && !errorMessage && listings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-sm font-medium text-gray-900">No listings found.</p>
            <p className="mt-2 text-sm text-gray-600">New uploads will appear here for moderation.</p>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4">
          {listings.map((item) => {
            const isUpdating = Boolean(updatingIds[item.id])
            const isActive = item.status === 'active'

            return (
              <article key={item.id} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                  <div className="w-full overflow-hidden rounded-2xl bg-gray-100 sm:w-32 sm:flex-shrink-0">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image_url} alt={`Listing ${item.id}`} className="h-40 w-full object-cover sm:h-32" />
                    ) : (
                      <div className="h-40 w-full bg-gray-200 sm:h-32" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{item.building.name}</p>
                        <p className="mt-1 text-xs text-gray-500">{formatCreatedAt(item.created_at)}</p>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ${
                          isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                      <div>
                        <span className="font-medium text-gray-900">Location type:</span> {formatLocationType(item)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Status:</span> {item.status}
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium text-gray-900">Description:</span> {previewDescription(item.description)}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <a
                        href={`/items/${item.id}`}
                        className="text-sm font-medium text-gray-600 hover:underline"
                      >
                        View public item
                      </a>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void updateListingStatus(item.id, 'removed')}
                          disabled={isUpdating || item.status === 'removed'}
                          className="inline-flex h-10 items-center justify-center rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isUpdating && item.status === 'active' ? 'Saving…' : 'Remove'}
                        </button>
                        <button
                          type="button"
                          onClick={() => void updateListingStatus(item.id, 'active')}
                          disabled={isUpdating || item.status === 'active'}
                          className="inline-flex h-10 items-center justify-center rounded-full bg-gray-900 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isUpdating && item.status === 'removed' ? 'Saving…' : 'Restore'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {isActionPending ? <p className="mt-4 text-xs text-gray-500">Updating listing status…</p> : null}
      </div>
    </main>
  )
}