'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { ListingPublic, ListingsPage } from '../../lib/db'
import { timeAgo } from '../../lib/time'
import { fetchBuildings, type SelectedBuilding } from '../../lib/buildings'
import { LOCATION_TYPES, LOCATION_TYPE_LABELS } from '../../config/constants'

export default function Page() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<ListingPublic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // filters
  const [buildings, setBuildings] = useState<SelectedBuilding[]>([])
  const [isBuildingsLoading, setIsBuildingsLoading] = useState(true)
  const [buildingsError, setBuildingsError] = useState<string | null>(null)
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(() => searchParams.get('building_id'))
  const [selectedLocationType, setSelectedLocationType] = useState<string>(() => searchParams.get('location_type') ?? '')

  // pagination params (offset kept for future pagination)
  const [offset, setOffset] = useState(0)
  const limit = 20

  const searchParamsString = searchParams.toString()

  const currentFilterState = useMemo(
    () => ({
      buildingId: searchParams.get('building_id'),
      locationType: searchParams.get('location_type') ?? ''
    }),
    [searchParamsString]
  )

  useEffect(() => {
    setSelectedBuildingId(currentFilterState.buildingId)
    setSelectedLocationType(currentFilterState.locationType)
  }, [currentFilterState.buildingId, currentFilterState.locationType])

  function updateUrl(nextBuildingId: string | null, nextLocationType: string) {
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

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  useEffect(() => {
    let isActive = true

    async function loadBuildings() {
      setIsBuildingsLoading(true)
      setBuildingsError(null)
      try {
        const data = await fetchBuildings()
        if (!isActive) return
        setBuildings(data)
      } catch {
        if (!isActive) return
        setBuildings([])
        setBuildingsError('Could not load buildings.')
      } finally {
        if (isActive) setIsBuildingsLoading(false)
      }
    }

    void loadBuildings()

    return () => {
      isActive = false
    }
  }, [])

  // Fetch listings when filters or offset change
  useEffect(() => {
    let isActive = true

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.set('limit', String(limit))
        params.set('offset', String(offset))
        if (selectedBuildingId) params.set('building_id', selectedBuildingId)
        if (selectedLocationType) params.set('location_type', selectedLocationType)

        const url = `/api/items?${params.toString()}`
        const res = await fetch(url)
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
  }, [selectedBuildingId, selectedLocationType, offset])

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Recent listings</h1>

        <div className="flex gap-3">
          <label className="flex w-1/2 flex-col text-sm">
            <span className="mb-1 text-sm font-medium text-gray-700">Building</span>
            <select
              value={selectedBuildingId ?? ''}
              disabled={isBuildingsLoading}
              onChange={(e) => {
                const nextBuildingId = e.target.value || null
                setSelectedBuildingId(nextBuildingId)
                setOffset(0)
                updateUrl(nextBuildingId, selectedLocationType)
              }}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none"
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
                setSelectedLocationType(nextLocationType)
                setOffset(0)
                updateUrl(selectedBuildingId, nextLocationType)
              }}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none"
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
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={() => {
              setSelectedBuildingId(null)
              setSelectedLocationType('')
              setOffset(0)
              updateUrl(null, '')
            }}
            className="text-sm text-gray-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      </div>

      {isLoading ? <p className="mb-4 text-sm text-gray-600">Loading listings…</p> : null}
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {!isLoading && !error && listings.length === 0 ? (
        <p className="mb-4 text-sm text-gray-600">No listings match the current filters.</p>
      ) : null}

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
                <div className="mt-2 px-1 text-xs text-gray-500">Posted {timeAgo(item.created_at)}</div>
              </div>

              <div className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">{item.building?.name}</div>
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
