// App-wide constants
import type { LocationType } from '../types/db-schema'

export const LISTING_EXPIRY_DAYS = 60
export const LOCATION_TYPES = ['lost_and_found', 'campus_safety', 'other'] as const satisfies readonly LocationType[]

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
	lost_and_found: 'Lost & Found',
	campus_safety: 'Campus Safety',
	other: 'Other'
}
