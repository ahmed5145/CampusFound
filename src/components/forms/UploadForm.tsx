'use client'

import type { ChangeEvent } from 'react'

import type { UploadDraft, ValidationState } from '../../types/upload'

const LOCATION_TYPE_OPTIONS = [
  { value: 'lost_and_found', label: 'Lost & Found' },
  { value: 'campus_safety', label: 'Campus Safety' },
  { value: 'other', label: 'Other' }
] as const

interface UploadFormProps {
  draft: UploadDraft
  onBuildingFieldClick: () => void
  onLocationTypeChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onOtherLocationTypeChange: (event: ChangeEvent<HTMLInputElement>) => void
  onLocationDetailsChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  validation: ValidationState
  showBuildingErrors: boolean
  showLocationTypeErrors: boolean
  showOtherLocationErrors: boolean
  showLocationDetailsErrors: boolean
  showDescriptionErrors: boolean
}

function renderErrors(errors: string[]) {
  if (errors.length === 0) {
    return null
  }

  return (
    <ul className="space-y-1 text-sm text-red-600">
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  )
}

export default function UploadForm({
  draft,
  onBuildingFieldClick,
  onLocationTypeChange,
  onOtherLocationTypeChange,
  onLocationDetailsChange,
  onDescriptionChange,
  validation,
  showBuildingErrors,
  showLocationTypeErrors,
  showOtherLocationErrors,
  showLocationDetailsErrors,
  showDescriptionErrors
}: UploadFormProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">Listing details</h2>
        <p className="text-sm text-gray-600">
          Choose your building first, then add the location type and details below.
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
          {showBuildingErrors ? renderErrors(validation.fieldErrors.selectedBuilding) : null}
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-800">Location Type</span>
          <select
            value={draft.locationType}
            onChange={onLocationTypeChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none"
          >
            <option value="">Select location type</option>
            {LOCATION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {showLocationTypeErrors ? renderErrors(validation.fieldErrors.locationType) : null}
        </label>

        {draft.locationType === 'other' ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-gray-800">Custom location type</span>
            <input
              type="text"
              value={draft.otherLocationType}
              onChange={onOtherLocationTypeChange}
              placeholder="Enter a short custom type"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
            {showOtherLocationErrors ? renderErrors(validation.fieldErrors.otherLocationType) : null}
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-800">Location details</span>
          <textarea
            value={draft.locationDetails}
            onChange={onLocationDetailsChange}
            placeholder="Add the exact spot or a helpful landmark"
            rows={4}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
          {showLocationDetailsErrors ? renderErrors(validation.fieldErrors.locationDetails) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-800">Item details</span>
          <textarea
            value={draft.description}
            onChange={onDescriptionChange}
            placeholder="Add identifying details like color, brand, or stickers"
            rows={5}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
          {showDescriptionErrors ? renderErrors(validation.fieldErrors.description) : null}
        </label>
      </div>
    </section>
  )
}
