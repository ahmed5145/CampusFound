export type LocationType = 'lost_and_found' | 'campus_safety' | 'other'
export type ListingStatus = 'active' | 'removed'
export type ReportReason =
  | 'inappropriate_content'
  | 'personal_information'
  | 'spam'
  | 'not_a_found_item'
  | 'other'
export type ReportStatus = 'open' | 'resolved' | 'dismissed'

export interface Building {
  id: string
  name: string
  created_at: string
}

export interface Listing {
  id: string
  image_url: string
  image_path?: string | null
  photo_hash?: string | null
  building_id: string
  location_type: LocationType
  other_location_type?: string | null
  location_details?: string | null
  description?: string | null
  status: ListingStatus
  created_at: string
  expires_at: string
}

export interface Report {
  id: string
  listing_id: string
  reason: ReportReason
  details: string | null
  status: ReportStatus
  created_at: string
  resolved_at: string | null
}

export interface DbSchema {
  buildings: Building
  listings: Listing
  reports: Report
}
