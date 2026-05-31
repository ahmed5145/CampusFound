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
  otherLocationType: '',
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
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    const value = event.target.value as UploadDraft['locationType']
    // clear otherLocationType when switching away from 'other'
    if (value !== 'other') {
      updateDraft({ locationType: value, otherLocationType: '' })
      // also clear any validation errors for otherLocationType by revalidating
      setValidation((current) => ({
        ...current,
        fieldErrors: validateDraft({ ...draft, locationType: value, otherLocationType: '' })
      }))
    } else {
      updateDraft({ locationType: value })
    }
  }

  function handleOtherLocationTypeChange(event: ChangeEvent<HTMLInputElement>) {
    markFieldTouched('otherLocationType')
    updateDraft({ otherLocationType: event.target.value })
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

    if (!draft.selectedImage || !draft.selectedBuilding || !draft.locationType) {
      return
    }

    const formData = new FormData()
    formData.append('image', draft.selectedImage)
    formData.append('building_id', draft.selectedBuilding.id)
    formData.append('location_type', draft.locationType)

    if (draft.locationType === 'other' && draft.otherLocationType.trim().length > 0) {
      formData.append('other_location_type', draft.otherLocationType)
    }

    if (draft.locationDetails.trim().length > 0) {
      formData.append('location_details', draft.locationDetails)
    }

    if (draft.description.trim().length > 0) {
      formData.append('description', draft.description)
    }

    setSubmitError(null)
    setIsSubmitting(true)

    void (async () => {
      try {
        const response = await fetch('/api/items', {
          method: 'POST',
          body: formData
        })

        if (response.status === 201) {
          const data = (await response.json()) as unknown
          console.log(data)
          return
        }

        if (response.status === 422) {
          const errorResponse = (await response.json()) as {
            error?: string
            fieldErrors?: Record<string, string[]>
          }

          setValidation((current) => ({
            ...current,
            submitAttempted: true,
            fieldErrors: mergeFieldErrors(current.fieldErrors, mapBackendFieldErrors(errorResponse.fieldErrors ?? {}))
          }))
          return
        }

        setSubmitError('Something went wrong. Please try again.')
      } catch {
        setSubmitError('Something went wrong. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    })()
  }

  function mapBackendFieldErrors(fieldErrors: Record<string, string[]>): ValidationState['fieldErrors'] {
    return {
      selectedImage: fieldErrors.image ?? [],
      selectedBuilding: fieldErrors.building_id ?? [],
      locationType: fieldErrors.location_type ?? [],
      otherLocationType: fieldErrors.other_location_type ?? [],
      locationDetails: fieldErrors.location_details ?? [],
      description: fieldErrors.description ?? []
    }
  }

  function mergeFieldErrors(currentErrors: ValidationState['fieldErrors'], nextErrors: ValidationState['fieldErrors']) {
    return {
      selectedImage: mergeErrorLists(currentErrors.selectedImage, nextErrors.selectedImage),
      selectedBuilding: mergeErrorLists(currentErrors.selectedBuilding, nextErrors.selectedBuilding),
      locationType: mergeErrorLists(currentErrors.locationType, nextErrors.locationType),
      otherLocationType: mergeErrorLists(currentErrors.otherLocationType, nextErrors.otherLocationType),
      locationDetails: mergeErrorLists(currentErrors.locationDetails, nextErrors.locationDetails),
      description: mergeErrorLists(currentErrors.description, nextErrors.description)
    }
  }

  function mergeErrorLists(currentErrors: string[], nextErrors: string[]) {
    return Array.from(new Set([...currentErrors, ...nextErrors]))
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
        onOtherLocationTypeChange={handleOtherLocationTypeChange}
        onLocationDetailsChange={handleLocationDetailsChange}
        onDescriptionChange={handleDescriptionChange}
        validation={validation}
        showBuildingErrors={showBuildingErrors}
        showLocationTypeErrors={showLocationTypeErrors}
        showOtherLocationErrors={validation.touched.otherLocationType || validation.submitAttempted}
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

      {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Listing'}
      </button>
    </main>
  )
}
