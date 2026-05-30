export type LocationType = 'Lost & Found' | 'Campus Safety' | 'Other'
export type ModerationStatus = 'active' | 'removed'

export interface Item {
  id: string
  title?: string
  description?: string
  imageUrl?: string
  building?: string
  locationType?: LocationType
  locationDetails?: string | null
  createdAt: string
  expiresAt: string
  status: ModerationStatus
}

export interface Building {
  id: string
  name: string
}
