import 'server-only'

import type { LocationType, ReportReason } from '../types/db-schema'
import { LOCATION_TYPES, REPORT_REASONS } from '../config/constants'

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

type ValidationFieldErrors = Record<string, string[]>
type QueryInput = URLSearchParams | Record<string, unknown> | string

interface ValidationErrorWithFields extends Error {
  fieldErrors: ValidationFieldErrors
}

export interface ListingCreateValidationResult {
  image: File
  buildingId: string
  locationType: LocationType
  otherLocationType: string | null
  locationDetails: string | null
  description: string | null
}

export interface ListingQueryValidationResult {
  buildingId: string | null
  locationType: LocationType | null
  limit: number
  offset: number
}

function createValidationError(fieldErrors: ValidationFieldErrors, message = 'Validation failed'): Error {
  const error = new Error(message) as ValidationErrorWithFields
  error.name = 'ValidationError'
  error.fieldErrors = fieldErrors
  return error
}

function addFieldError(fieldErrors: ValidationFieldErrors, field: string, message: string): void {
  if (!fieldErrors[field]) {
    fieldErrors[field] = []
  }

  fieldErrors[field].push(message)
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function normalizeString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeQueryString(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  if (typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return normalizeQueryString(value[0])
  }

  return null
}

function readQueryValue(input: QueryInput, key: string): string | null {
  if (typeof input === 'string') {
    return new URLSearchParams(input).get(key)
  }

  if (input instanceof URLSearchParams) {
    return input.get(key)
  }

  return normalizeQueryString((input as Record<string, unknown>)[key])
}

function parseRequiredInteger(rawValue: string | null, field: string, fieldErrors: ValidationFieldErrors): number | null {
  if (rawValue == null) {
    return null
  }

  const parsed = Number(rawValue)
  if (!Number.isInteger(parsed)) {
    addFieldError(fieldErrors, field, 'Must be an integer.')
    return null
  }

  return parsed
}

function normalizeLocationType(rawValue: string | null, fieldErrors: ValidationFieldErrors, field: string): LocationType | null {
  if (rawValue == null) {
    return null
  }

  if ((LOCATION_TYPES as readonly string[]).includes(rawValue)) {
    return rawValue as LocationType
  }

  addFieldError(fieldErrors, field, 'Must be one of lost_and_found, campus_safety, or other.')
  return null
}

function normalizeUuid(rawValue: string | null, fieldErrors: ValidationFieldErrors, field: string): string | null {
  if (rawValue == null) {
    return null
  }

  const normalized = rawValue.toLowerCase()
  if (!isUuid(normalized)) {
    addFieldError(fieldErrors, field, 'Must be a valid UUID.')
    return null
  }

  return normalized
}

function validateImageFile(imageValue: FormDataEntryValue | null, fieldErrors: ValidationFieldErrors): imageValue is File {
  if (!(imageValue instanceof File)) {
    addFieldError(fieldErrors, 'image', 'An image file is required.')
    return false
  }

  if (imageValue.size > MAX_IMAGE_SIZE_BYTES) {
    addFieldError(fieldErrors, 'image', 'Image must be 10 MB or smaller.')
  }

  if (!ACCEPTED_IMAGE_MIME_TYPES.includes(imageValue.type as (typeof ACCEPTED_IMAGE_MIME_TYPES)[number])) {
    addFieldError(fieldErrors, 'image', 'Image must be a JPEG, PNG, or WebP file.')
  }

  return true
}

function assertNoValidationErrors(fieldErrors: ValidationFieldErrors): void {
  if (Object.keys(fieldErrors).length > 0) {
    throw createValidationError(fieldErrors)
  }
}

export function validateListingCreateFormData(formData: FormData): ListingCreateValidationResult {
  const fieldErrors: ValidationFieldErrors = {}

  const image = formData.get('image')
  const hasValidImage = validateImageFile(image, fieldErrors)

  // building_id is required
  const rawBuilding = normalizeString(formData.get('building_id'))
  let buildingId: string | null = null
  if (rawBuilding == null) {
    addFieldError(fieldErrors, 'building_id', 'Building id is required.')
  } else {
    buildingId = normalizeUuid(rawBuilding, fieldErrors, 'building_id')
  }

  // location_type is required
  const rawLocation = normalizeString(formData.get('location_type'))
  let locationType: LocationType | null = null
  if (rawLocation == null) {
    addFieldError(fieldErrors, 'location_type', 'Location type is required.')
  } else {
    locationType = normalizeLocationType(rawLocation, fieldErrors, 'location_type')
  }

  const otherLocationType = normalizeString(formData.get('other_location_type'))
  const locationDetails = normalizeString(formData.get('location_details'))
  const description = normalizeString(formData.get('description'))

  // length limits
  if (otherLocationType && otherLocationType.length > 100) {
    addFieldError(fieldErrors, 'other_location_type', 'Must be 100 characters or fewer.')
  }
  if (locationDetails && locationDetails.length > 300) {
    addFieldError(fieldErrors, 'location_details', 'Must be 300 characters or fewer.')
  }
  if (description && description.length > 1000) {
    addFieldError(fieldErrors, 'description', 'Must be 1000 characters or fewer.')
  }

  assertNoValidationErrors(fieldErrors)

  return {
    image: hasValidImage ? (image as File) : (() => {
      throw new Error('Unreachable image validation state.')
    })(),
    buildingId: buildingId as string,
    locationType: locationType as LocationType,
    otherLocationType,
    locationDetails,
    description
  }
}

export function validateListingQuery(input: QueryInput): ListingQueryValidationResult {
  const fieldErrors: ValidationFieldErrors = {}

  const buildingId = normalizeUuid(readQueryValue(input, 'building_id'), fieldErrors, 'building_id')
  const locationType = normalizeLocationType(readQueryValue(input, 'location_type'), fieldErrors, 'location_type')

  const rawLimit = readQueryValue(input, 'limit')
  let limit = 20
  if (rawLimit != null) {
    const parsedLimit = parseRequiredInteger(rawLimit, 'limit', fieldErrors)
    if (parsedLimit != null) {
      if (parsedLimit < 1) {
        addFieldError(fieldErrors, 'limit', 'Must be at least 1.')
      } else if (parsedLimit > 50) {
        addFieldError(fieldErrors, 'limit', 'Must be 50 or less.')
      } else {
        limit = parsedLimit
      }
    }
  }

  const rawOffset = readQueryValue(input, 'offset')
  let offset = 0
  if (rawOffset != null) {
    const parsedOffset = parseRequiredInteger(rawOffset, 'offset', fieldErrors)
    if (parsedOffset != null) {
      if (parsedOffset < 0) {
        addFieldError(fieldErrors, 'offset', 'Must be 0 or greater.')
      } else {
        offset = parsedOffset
      }
    }
  }

  assertNoValidationErrors(fieldErrors)

  return {
    buildingId,
    locationType,
    limit,
    offset
  }
}

export function validateListingIdParam(rawId: string): string {
  const fieldErrors: ValidationFieldErrors = {}
  const normalized = normalizeUuid(typeof rawId === 'string' ? rawId.trim() : null, fieldErrors, 'id')

  assertNoValidationErrors(fieldErrors)

  return normalized as string
}

export interface ReportCreateValidationResult {
  reason: ReportReason
  details: string | null
}

export function validateReportCreateBody(body: unknown): ReportCreateValidationResult {
  const fieldErrors: ValidationFieldErrors = {}
  const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}

  const rawReason = normalizeQueryString(record.reason)
  let reason: ReportReason | null = null
  if (rawReason == null) {
    addFieldError(fieldErrors, 'reason', 'Reason is required.')
  } else if ((REPORT_REASONS as readonly string[]).includes(rawReason)) {
    reason = rawReason as ReportReason
  } else {
    addFieldError(fieldErrors, 'reason', 'Reason is invalid.')
  }

  const details = normalizeQueryString(record.details)
  if (details && details.length > 500) {
    addFieldError(fieldErrors, 'details', 'Details must be 500 characters or fewer.')
  }

  if (reason === 'other' && !details) {
    addFieldError(fieldErrors, 'details', 'Please provide details when selecting Other.')
  }

  assertNoValidationErrors(fieldErrors)

  return {
    reason: reason as ReportReason,
    details
  }
}

export function validateReportIdParam(rawId: string): string {
  const fieldErrors: ValidationFieldErrors = {}
  const normalized = normalizeUuid(typeof rawId === 'string' ? rawId.trim() : null, fieldErrors, 'id')

  assertNoValidationErrors(fieldErrors)

  return normalized as string
}
