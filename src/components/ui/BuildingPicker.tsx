'use client'

import { useMemo, useState } from 'react'

import type { SelectedBuilding } from '../../lib/buildings'

interface BuildingPickerProps {
  isOpen: boolean
  buildings: SelectedBuilding[]
  selectedBuilding: SelectedBuilding | null
  onSelectBuilding: (building: SelectedBuilding) => void
  onClose: () => void
}

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase()
}

export default function BuildingPicker({
  isOpen,
  buildings,
  selectedBuilding,
  onSelectBuilding,
  onClose
}: BuildingPickerProps) {
  const [query, setQuery] = useState('')

  const filteredBuildings = useMemo(() => {
    const normalizedQuery = normalizeQuery(query)

    if (!normalizedQuery) {
      return buildings
    }

    return buildings.filter((building) => building.name.toLowerCase().includes(normalizedQuery))
  }, [buildings, query])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex h-full flex-col">
        <header className="border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Select a building</h2>
              <p className="text-sm text-gray-600">Search your campus building.</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Close
            </button>
          </div>

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by building name"
            className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white placeholder:text-gray-400"
          />
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-2">
            {filteredBuildings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
                <p className="text-sm font-medium text-gray-900">No buildings found.</p>
                <p className="mt-2 text-sm text-gray-600">Try a different building name or clear the search field.</p>
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="mt-4 inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    Clear search
                  </button>
                ) : null}
              </div>
            ) : (
              filteredBuildings.map((building) => {
                const isSelected = selectedBuilding?.id === building.id

                return (
                  <button
                    key={building.id}
                    type="button"
                    onClick={() => onSelectBuilding(building)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      isSelected ? 'border-gray-900 bg-gray-50 text-gray-900' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <span>{building.name}</span>
                    {isSelected ? <span className="text-xs font-medium uppercase tracking-wide">Selected</span> : null}
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}