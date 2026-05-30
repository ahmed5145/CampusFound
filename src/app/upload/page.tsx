'use client'

import { useEffect, useState, type ChangeEvent } from 'react'

import BuildingPicker from '../../components/ui/BuildingPicker'
import ImageUpload from '../../components/ui/ImageUpload'
import UploadForm from '../../components/forms/UploadForm'
import { fetchBuildings, type SelectedBuilding } from '../../lib/buildings'
import type { UploadDraft, ValidationState, ValidationTouched } from '../../types/upload'
import { createValidationState, validateDraft } from '../../lib/upload-validation'

const initialDraft: UploadDraft = {
  selectedImage: null,
  selectedBuilding: null,
  locationType: '',
  locationDetails: '',
  description: ''
}

export default function Page() {
  const [draft, setDraft] = useState<UploadDraft>(initialDraft)
  const [validation, setValidation] = useState<ValidationState>(createValidationState(initialDraft))
  const [buildings, setBuildings] = useState<SelectedBuilding[]>([])
  const [isBuildingPickerOpen, setIsBuildingPickerOpen] = useState(false)
  const [isBuildingsLoading, setIsBuildingsLoading] = useState(true)
  const [buildingsError, setBuildingsError] = useState<string | null>(null)

  useEffect(() => {
    setValidation((current) => ({
      ...current,
      fieldErrors: validateDraft(draft)
    }))
  }, [draft])

  useEffect(() => {
    let isActive = true

    async function loadBuildings() {
      setIsBuildingsLoading(true)
      setBuildingsError(null)

      try {
        const data = await fetchBuildings()
        if (!isActive) {
          return
        }

        setBuildings(data)
      } catch {
        if (!isActive) {
          return
        }

        setBuildings([])
        setBuildingsError('Could not load buildings.')
      } finally {
        if (isActive) {
          setIsBuildingsLoading(false)
        }
      }
    }

    void loadBuildings()

    return () => {
      isActive = false
    }
  }, [])

  function updateDraft(patch: Partial<UploadDraft>) {
    setDraft((current) => ({
      ...current,
      ...patch
    }))
  }

  function markFieldTouched(field: keyof ValidationTouched) {
    setValidation((current) => ({
      ...current,
      touched: {
        ...current.touched,
        [field]: true
      }
    }))
  }

  function handleImageChange(file: File | null) {
    markFieldTouched('selectedImage')
    updateDraft({ selectedImage: file })
  }

  function handleLocationTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    markFieldTouched('locationType')
    updateDraft({ locationType: event.target.value as UploadDraft['locationType'] })
  }

  function handleLocationDetailsChange(event: ChangeEvent<HTMLTextAreaElement>) {
    markFieldTouched('locationDetails')
    updateDraft({ locationDetails: event.target.value })
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
    markFieldTouched('description')
    updateDraft({ description: event.target.value })
  }

  function openBuildingPicker() {
    markFieldTouched('selectedBuilding')

    if (isBuildingsLoading || buildingsError) {
      return
    }

    setIsBuildingPickerOpen(true)
  }

  function closeBuildingPicker() {
    setIsBuildingPickerOpen(false)
  }

  function handleBuildingSelect(building: SelectedBuilding) {
    markFieldTouched('selectedBuilding')
    updateDraft({ selectedBuilding: building })
    setIsBuildingPickerOpen(false)
  }

  function handleSubmit() {
    const fieldErrors = validateDraft(draft)
    const hasErrors = Object.values(fieldErrors).some((errors) => errors.length > 0)

    setValidation((current) => ({
      ...current,
      submitAttempted: true,
      fieldErrors
    }))

    if (hasErrors) {
      return
    }

    const payload = {
      image: draft.selectedImage,
      building_id: draft.selectedBuilding?.id ?? '',
      location_type: draft.locationType,
      location_details: draft.locationDetails || null,
      description: draft.description || null
    }

    console.log(payload)
  }

  const showImageErrors = validation.touched.selectedImage || validation.submitAttempted
  const showBuildingErrors = validation.touched.selectedBuilding || validation.submitAttempted
  const showLocationTypeErrors = validation.touched.locationType || validation.submitAttempted
  const showLocationDetailsErrors = validation.touched.locationDetails || validation.submitAttempted
  const showDescriptionErrors = validation.touched.description || validation.submitAttempted

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Upload</p>
        <h1 className="text-3xl font-semibold text-gray-900">Create a found-item listing</h1>
        <p className="text-sm leading-6 text-gray-600">
          This is the upload page shell. Image picking, validation, and submission come next.
        </p>
      </header>

      <ImageUpload
        file={draft.selectedImage}
        onFileChange={handleImageChange}
        errors={showImageErrors ? validation.fieldErrors.selectedImage : []}
      />

      <UploadForm
        draft={draft}
        onBuildingFieldClick={openBuildingPicker}
        onLocationTypeChange={handleLocationTypeChange}
        onLocationDetailsChange={handleLocationDetailsChange}
        onDescriptionChange={handleDescriptionChange}
        validation={validation}
        showBuildingErrors={showBuildingErrors}
        showLocationTypeErrors={showLocationTypeErrors}
        showLocationDetailsErrors={showLocationDetailsErrors}
        showDescriptionErrors={showDescriptionErrors}
      />

      <BuildingPicker
        isOpen={isBuildingPickerOpen}
        buildings={buildings}
        selectedBuilding={draft.selectedBuilding}
        onSelectBuilding={handleBuildingSelect}
        onClose={closeBuildingPicker}
      />

      {buildingsError ? (
        <p className="text-sm text-red-600">{buildingsError}</p>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900"
      >
        Submit Listing
      </button>
    </main>
  )
}
