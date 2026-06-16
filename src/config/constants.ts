// App-wide constants
import type { LocationType, ReportReason } from '../types/db-schema'

export const LISTING_EXPIRY_DAYS = 60
export const LOCATION_TYPES = ['lost_and_found', 'campus_safety', 'other'] as const satisfies readonly LocationType[]

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
	lost_and_found: 'Lost & Found',
	campus_safety: 'Campus Safety',
	other: 'Other'
}

export const REPORT_REASONS = [
	'inappropriate_content',
	'personal_information',
	'spam',
	'not_a_found_item',
	'other'
] as const satisfies readonly ReportReason[]

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
	inappropriate_content: 'Inappropriate content',
	personal_information: 'Contains personal information',
	spam: 'Spam or misleading',
	not_a_found_item: 'Not a found item',
	other: 'Other'
}
