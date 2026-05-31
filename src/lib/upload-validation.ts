import type { UploadDraft, ValidationFieldErrors, ValidationState, ValidationTouched } from '../types/upload'

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export function createEmptyFieldErrors(): ValidationFieldErrors {
  return {
    selectedImage: [],
    selectedBuilding: [],
    locationType: [],
    otherLocationType: [],
    locationDetails: [],
    description: []
  }
}

export function createEmptyTouched(): ValidationTouched {
  return {
    selectedImage: false,
    selectedBuilding: false,
    locationType: false,
    otherLocationType: false,
    locationDetails: false,
    description: false
  }
}

export function createValidationState(draft: UploadDraft): ValidationState {
  return {
    touched: createEmptyTouched(),
    fieldErrors: validateDraft(draft),
    submitAttempted: false
  }
}

export function validateDraft(draft: UploadDraft): ValidationFieldErrors {
  const fieldErrors = createEmptyFieldErrors()

  if (!draft.selectedImage) {
    fieldErrors.selectedImage.push('An image file is required.')
  } else {
    if (!ACCEPTED_IMAGE_MIME_TYPES.includes(draft.selectedImage.type as (typeof ACCEPTED_IMAGE_MIME_TYPES)[number])) {
      fieldErrors.selectedImage.push('Image must be a JPEG, PNG, or WebP file.')
    }

    if (draft.selectedImage.size > MAX_IMAGE_SIZE_BYTES) {
      fieldErrors.selectedImage.push('Image must be 10 MB or smaller.')
    }
  }

  if (!draft.selectedBuilding) {
    fieldErrors.selectedBuilding.push('Please select a building.')
  }

  if (!draft.locationType) {
    fieldErrors.locationType.push('Please select a location type.')
  }

  if (draft.locationType === 'other') {
    if (!draft.otherLocationType || draft.otherLocationType.trim().length === 0) {
      fieldErrors.otherLocationType.push('Please specify the location type.')
    }
  }

  if (draft.locationDetails.length > 300) {
    fieldErrors.locationDetails.push('Location details must be 300 characters or fewer.')
  }

  if (draft.description.length > 1000) {
    fieldErrors.description.push('Description must be 1000 characters or fewer.')
  }

  return fieldErrors
}