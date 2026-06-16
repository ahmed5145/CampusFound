'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { ListingPublic, ListingsPage } from '../../lib/db'
import { timeAgo } from '../../lib/time'
import { fetchBuildings, type SelectedBuilding } from '../../lib/buildings'
import { LOCATION_TYPES, LOCATION_TYPE_LABELS } from '../../config/constants'
import PageView from '../../components/analytics/PageView'
import { captureEvent } from '../../lib/analytics'
import useDebounce from '../../hooks/useDebounce'

export default function Page() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<ListingPublic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // filters
  const [buildings, setBuildings] = useState<SelectedBuilding[]>([])
  const [isBuildingsLoading, setIsBuildingsLoading] = useState(true)
  const [buildingsError, setBuildingsError] = useState<string | null>(null)

  // pagination params (offset kept for future pagination)
  const [offset, setOffset] = useState(0)
  const limit = 20

  // Request coordination: ensure only the latest listings request can update state
  const listingsRequestIdRef = useRef(0)
  const listingsAbortControllerRef = useRef<AbortController | null>(null)
  // Guard to prevent duplicate pagination requests before React state updates
  const paginationInFlightRef = useRef(false)
  // separate request id for buildings so we can ignore stale building responses
  const buildingsRequestIdRef = useRef(0)

  const searchParamsString = searchParams.toString()
  const selectedBuildingId = searchParams.get('building_id')
  const selectedLocationType = searchParams.get('location_type') ?? ''
  const selectedSearchQuery = searchParams.get('q') ?? ''
  const [searchInput, setSearchInput] = useState(selectedSearchQuery)
  const debouncedSearchInput = useDebounce(searchInput, 300)
  const hasActiveFilters = Boolean(selectedBuildingId || selectedLocationType || selectedSearchQuery)

  const loadingCards = Array.from({ length: 4 }, (_, index) => index)

  function formatLocationType(item: ListingPublic) {
    const baseType = item.location_type.replaceAll('_', ' ')

    if (item.location_type === 'other' && item.other_location_type) {
      return `Other - ${item.other_location_type}`
    }

    return baseType
  }

  const filterKey = `${selectedBuildingId ?? ''}|${selectedLocationType}|${selectedSearchQuery}`
  const filterKeyRef = useRef<string>(filterKey)

  function updateUrl(nextBuildingId: string | null, nextLocationType: string, nextSearchQuery: string) {
    const params = new URLSearchParams(searchParamsString)

    if (nextBuildingId) {
      params.set('building_id', nextBuildingId)
    } else {
      params.delete('building_id')
    }

    if (nextLocationType) {
      params.set('location_type', nextLocationType)
    } else {
      params.delete('location_type')
    }

    if (nextSearchQuery.trim()) {
      params.set('q', nextSearchQuery.trim())
    } else {
      params.delete('q')
    }

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  useEffect(() => {
    setSearchInput(selectedSearchQuery)
  }, [selectedSearchQuery])

  useEffect(() => {
    if (debouncedSearchInput.trim() === selectedSearchQuery.trim()) {
      return
    }

    if (debouncedSearchInput.trim().length === 1) {
      return
    }

    if (debouncedSearchInput.trim()) {
      captureEvent('search_used', { query_length: debouncedSearchInput.trim().length })
    }

    updateUrl(selectedBuildingId, selectedLocationType, debouncedSearchInput)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchInput])

  useEffect(() => {
    let isActive = true
    const requestId = ++buildingsRequestIdRef.current

    async function loadBuildings() {
      setIsBuildingsLoading(true)
      setBuildingsError(null)
      try {
        const data = await fetchBuildings()
        if (!isActive) return
        // only accept if this request is still the latest
        if (requestId !== buildingsRequestIdRef.current) return
        setBuildings(data)
      } catch {
        if (!isActive) return
        setBuildings([])
        setBuildingsError('Could not load buildings.')
      } finally {
        if (isActive && requestId === buildingsRequestIdRef.current) setIsBuildingsLoading(false)
      }
    }

    void loadBuildings()

    return () => {
      isActive = false
    }
  }, [])

  // Fetch listings when filters or offset change
  useEffect(() => {
    // coordinate requests so only the latest may update state
    const requestId = ++listingsRequestIdRef.current

    // abort previous listings request
    if (listingsAbortControllerRef.current) {
      listingsAbortControllerRef.current.abort()
    }
    const controller = new AbortController()
    listingsAbortControllerRef.current = controller

    const loadingMore = offset > 0

    async function load() {
      try {
        // If filters changed (back/forward navigation), reset pagination/state here
        // (inside async) to satisfy react-hooks/set-state-in-effect.
        if (filterKeyRef.current !== filterKey) {
          filterKeyRef.current = filterKey
          paginationInFlightRef.current = false
          setError(null)
          setListings([])
          if (offset !== 0) {
            setOffset(0)
            return
          }
        }

        setError(null)
        if (loadingMore) {
          setIsLoadingMore(true)
        } else {
          setIsLoading(true)
        }

        if (loadingMore) {
          paginationInFlightRef.current = true
        }
        const params = new URLSearchParams()
        params.set('limit', String(limit))
        params.set('offset', String(offset))
        if (selectedBuildingId) params.set('building_id', selectedBuildingId)
        if (selectedLocationType) params.set('location_type', selectedLocationType)
        if (selectedSearchQuery) params.set('q', selectedSearchQuery)

        const url = `/api/items?${params.toString()}`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) {
          throw new Error('Failed to load')
        }

        const payload = (await res.json()) as ListingsPage

        // ignore if a newer request started
        if (requestId !== listingsRequestIdRef.current) return

        const items = payload.data ?? []
        if (offset === 0) {
          setListings(items)
        } else {
          setListings((prev) => [...prev, ...items])
        }

        setHasMore(Boolean(payload.pageInfo?.hasMore))
      } catch (err: unknown) {
        // if aborted, silently ignore
        if (err instanceof Error && err.name === 'AbortError') return
        // ignore if a newer request started
        if (requestId !== listingsRequestIdRef.current) return
        setError('Could not load listings.')
      } finally {
        // only toggle loading states if this is still the latest request
        if (requestId !== listingsRequestIdRef.current) return
        if (offset > 0) {
          paginationInFlightRef.current = false
          setIsLoadingMore(false)
        } else {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      // abort this request when effect cleans up
      controller.abort()
    }
  }, [filterKey, selectedBuildingId, selectedLocationType, selectedSearchQuery, offset])

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <PageView
        eventName="browse_viewed"
        properties={{
          building_id: selectedBuildingId,
          location_type: selectedLocationType || null,
          q: selectedSearchQuery || null
        }}
      />
      <div className="mb-6 flex flex-col gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Recent listings</h1>

        <label className="flex flex-col text-sm">
          <span className="mb-1 text-sm font-medium text-gray-700">Search</span>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search description or location details"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          />
        </label>

        <div className="flex gap-3">
          <label className="flex w-1/2 flex-col text-sm">
            <span className="mb-1 text-sm font-medium text-gray-700">Building</span>
            <select
              value={selectedBuildingId ?? ''}
              disabled={isBuildingsLoading}
              onChange={(e) => {
                const nextBuildingId = e.target.value || null
                if (nextBuildingId) {
                  captureEvent('building_filter_used', { building_id: nextBuildingId })
                }
                updateUrl(nextBuildingId, selectedLocationType, selectedSearchQuery)
              }}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <option value="">All buildings</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            {isBuildingsLoading ? <span className="mt-1 text-xs text-gray-500">Loading buildings…</span> : null}
            {buildingsError ? <span className="mt-1 text-xs text-red-600">{buildingsError}</span> : null}
          </label>

          <label className="flex w-1/2 flex-col text-sm">
            <span className="mb-1 text-sm font-medium text-gray-700">Location type</span>
            <select
              value={selectedLocationType}
              onChange={(e) => {
                const nextLocationType = e.target.value
                if (nextLocationType) {
                  captureEvent('location_type_filter_used', { location_type: nextLocationType })
                }
                updateUrl(selectedBuildingId, nextLocationType, selectedSearchQuery)
              }}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <option value="">All types</option>
              {LOCATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {LOCATION_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
        </div>
        {isLoading ? (
          <div className="grid gap-6">
            {loadingCards.map((index) => (
              <article key={index} className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="h-48 w-full rounded-lg bg-gray-200 sm:h-32 sm:w-36 sm:shrink-0" />
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-5/6 rounded bg-gray-200" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {error ? <p className="mb-4 text-sm text-red-600">Could not load listings.</p> : null}

        {!isLoading && !error && listings.length === 0 ? (
          <div className="mb-4 rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600">
            <p className="font-medium text-gray-900">No listings found.</p>
            <p className="mt-1 leading-6">
              {hasActiveFilters
                ? 'Try clearing the filters or choose a different building.'
                : 'Try again later or report a found item if you have one to share.'}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('')
                  updateUrl(null, '', '')
                }}
                className="mt-4 inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-6">
          {listings.map((item) => (
            <Link
              key={item.id}
              href={`/items/${item.id}`}
              className="block overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-36">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_thumbnail_url || item.image_url}
                      alt={`Listing ${item.id}`}
                      className="h-48 w-full object-cover sm:h-32"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gray-200 sm:h-32" />
                  )}
                  <div className="mt-2 px-1 text-xs text-gray-500">Posted {timeAgo(item.created_at)}</div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="truncate text-sm font-medium text-gray-900">{item.building?.name}</div>
                  </div>

                  <div className="mt-2 text-sm text-gray-700">
                    <div className="font-medium text-gray-800">{formatLocationType(item)}</div>
                    {item.location_details ? <div className="mt-1 text-gray-600">{item.location_details}</div> : null}
                    {item.description ? <div className="mt-2 text-gray-600">{item.description}</div> : null}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {hasMore ? (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                // prevent duplicate pagination clicks; set guard immediately
                if (isLoading || isLoadingMore || paginationInFlightRef.current) return
                paginationInFlightRef.current = true
                setIsLoadingMore(true)
                setOffset((prev) => prev + limit)
              }}
              disabled={isLoadingMore || isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {isLoadingMore ? (
                <>
                  <span
                    className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
                    aria-hidden="true"
                  />
                  <span>Loading…</span>
                </>
              ) : (
                'Load more'
              )}
            </button>
          </div>
        ) : null}
      </div>
    </main>
  )
}
