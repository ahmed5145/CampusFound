import type { SelectedBuilding } from '../lib/buildings'
import type { LocationType } from './db-schema'

export interface UploadDraft {
  selectedImage: File | null
  selectedBuilding: SelectedBuilding | null
  locationType: LocationType | ''
  locationDetails: string
  description: string
}

export interface ValidationFieldErrors {
  selectedImage: string[]
  selectedBuilding: string[]
  locationType: string[]
  locationDetails: string[]
  description: string[]
}

export interface ValidationTouched {
  selectedImage: boolean
  selectedBuilding: boolean
  locationType: boolean
  locationDetails: boolean
  description: boolean
}

export interface ValidationState {
  touched: ValidationTouched
  fieldErrors: ValidationFieldErrors
  submitAttempted: boolean
}