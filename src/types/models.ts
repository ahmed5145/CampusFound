import type { ListingStatus, LocationType } from './db-schema'

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
  status: ListingStatus
}

export interface Building {
  id: string
  name: string
}
