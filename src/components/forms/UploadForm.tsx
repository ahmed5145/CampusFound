'use client'

import type { UploadDraft } from '../../app/upload/page'

const LOCATION_TYPE_OPTIONS = [
  { value: 'lost_and_found', label: 'Lost & Found' },
  { value: 'campus_safety', label: 'Campus Safety' },
  { value: 'other', label: 'Other' }
] as const

interface UploadFormProps {
  draft: UploadDraft
  onDraftChange: (patch: Partial<UploadDraft>) => void
  onBuildingFieldClick: () => void
}

export default function UploadForm({ draft, onDraftChange, onBuildingFieldClick }: UploadFormProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">Listing details</h2>
        <p className="text-sm text-gray-600">
          Building selection is now handled by the picker. The other fields remain unchanged.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <div className="block space-y-2">
          <span className="text-sm font-medium text-gray-800">Building</span>
          <button
            type="button"
            onClick={onBuildingFieldClick}
            aria-haspopup="dialog"
            className="flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-3 text-left text-sm text-gray-900"
          >
            <span>{draft.selectedBuilding?.name ?? 'Choose a building'}</span>
            <span className="text-gray-500">Select</span>
          </button>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-800">Location Type</span>
          <select
            value={draft.locationType}
            onChange={(event) => onDraftChange({ locationType: event.target.value as UploadDraft['locationType'] })}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none"
          >
            <option value="">Select location type</option>
            {LOCATION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-800">Location Details</span>
          <textarea
            value={draft.locationDetails}
            onChange={(event) => onDraftChange({ locationDetails: event.target.value })}
            placeholder="Where was the item found?"
            rows={4}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-800">Description</span>
          <textarea
            value={draft.description}
            onChange={(event) => onDraftChange({ description: event.target.value })}
            placeholder="Add a short description"
            rows={5}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </label>
      </div>
    </section>
  )
}
