import 'server-only'

import { getServiceSupabase } from './supabaseClient'
import type { ListingStatus, LocationType } from '../types/db-schema'
import { getListingImageDisplayUrl } from './storage'

export interface BuildingRecord {
  id: string
  name: string
}

export interface ListingPublic {
  id: string
  image_url: string
  building: BuildingRecord
  location_type: LocationType
  other_location_type: string | null
  location_details: string | null
  description: string | null
  status: ListingStatus
  created_at: string
  expires_at: string
}

export type ListingSummary = ListingPublic
export type ListingDetail = ListingPublic

export interface CreateListingInput {
  imageUrl: string
  imagePath: string
  buildingId: string
  locationType: LocationType
  otherLocationType: string | null
  locationDetails: string | null
  description: string | null
}

export interface GetListingsInput {
  buildingId: string | null
  locationType: LocationType | null
  limit: number
  offset: number
}

export interface GetAdminListingsInput {
  limit: number
  offset: number
}

export interface ListingsPage {
  data: ListingSummary[]
  pageInfo: {
    limit: number
    offset: number
    hasMore: boolean
    total?: number
  }
}

type BuildingRow = {
  id: string
  name: string
  created_at: string
}

type ListingRow = {
  id: string
  image_url: string
  image_path: string | null
  building_id: string
  location_type: LocationType
  other_location_type: string | null
  location_details: string | null
  description: string | null
  status: ListingStatus
  created_at: string
  expires_at: string
}

type ListingInsertRow = ListingRow & {
  building?: BuildingRow | null
}

function getSupabase() {
  return getServiceSupabase()
}

function toBuilding(record: BuildingRow): BuildingRecord {
  return {
    id: record.id,
    name: record.name
  }
}

async function toListing(record: ListingInsertRow, building: BuildingRow): Promise<ListingPublic> {
  const resolvedImageUrl = await getListingImageDisplayUrl({
    imageUrl: record.image_url ?? null,
    imagePath: record.image_path ?? null
  })

  return {
    id: record.id,
    image_url: resolvedImageUrl ?? '',
    building: toBuilding(building),
    location_type: record.location_type,
    other_location_type: record.other_location_type ?? null,
    location_details: record.location_details ?? null,
    description: record.description ?? null,
    status: record.status,
    created_at: record.created_at,
    expires_at: record.expires_at
  }
}

async function getBuildingById(buildingId: string): Promise<BuildingRow> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('buildings')
    .select('id, name, created_at')
    .eq('id', buildingId)
    .single<BuildingRow>()

  if (error) {
    throw error
  }

  return data
}

export async function getBuildings(): Promise<BuildingRecord[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('buildings')
    .select('id, name, created_at')
    .order('name', { ascending: true })

  if (error) {
    console.error("SUPABASE ERROR:", error)
    throw error
  }

  return (data ?? []).map(toBuilding)
}

export async function createListing(input: CreateListingInput): Promise<ListingDetail> {
  const supabase = getSupabase()

  const { data: insertedRow, error: insertError } = await supabase
    .from('listings')
    .insert({
      image_url: input.imageUrl,
      image_path: input.imagePath,
      building_id: input.buildingId,
      location_type: input.locationType,
      other_location_type: input.otherLocationType,
      location_details: input.locationDetails,
      description: input.description
    })
    .select('id, image_url, image_path, building_id, location_type, other_location_type, location_details, description, status, created_at, expires_at')
    .single<ListingRow>()

  if (insertError) {
    throw insertError
  }

  const building = await getBuildingById(insertedRow.building_id)
  return await toListing(insertedRow as ListingInsertRow, building)
}

export async function getListings(input: GetListingsInput): Promise<ListingsPage> {
  const supabase = getSupabase()

  let query = supabase
    .from('listings')
    .select('id, image_url, image_path, building_id, location_type, other_location_type, location_details, description, status, created_at, expires_at', {
      count: 'exact'
    })
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .range(input.offset, input.offset + input.limit - 1)

  if (input.buildingId) {
    query = query.eq('building_id', input.buildingId)
  }

  if (input.locationType) {
    query = query.eq('location_type', input.locationType)
  }

  const { data, error, count } = await query

  if (error) {
    throw error
  }

  const rows = (data ?? []) as ListingRow[]
  const buildingIds = [...new Set(rows.map((row) => row.building_id))]
  if (buildingIds.length === 0) {
    return {
      data: [],
      pageInfo: {
        limit: input.limit,
        offset: input.offset,
        hasMore: typeof count === 'number' ? input.offset < count : false,
        ...(typeof count === 'number' ? { total: count } : {})
      }
    }
  }

  const { data: buildings, error: buildingError } = await supabase
    .from('buildings')
    .select('id, name, created_at')
    .in('id', buildingIds)

  if (buildingError) {
    throw buildingError
  }

  const buildingMap = new Map<string, BuildingRow>((buildings ?? []).map((row) => [row.id, row as BuildingRow]))

  const listings = rows.map((row) => {
    const building = buildingMap.get(row.building_id)
    if (!building) {
      throw new Error(`Missing building for listing ${row.id}`)
    }

    return { row, building }
  })

  const resolvedListings = await Promise.all(
    listings.map(async ({ row, building }) => await toListing(row as ListingInsertRow, building))
  )

  return {
    data: resolvedListings,
    pageInfo: {
      limit: input.limit,
      offset: input.offset,
      hasMore: typeof count === 'number' ? input.offset + resolvedListings.length < count : resolvedListings.length === input.limit,
      ...(typeof count === 'number' ? { total: count } : {})
    }
  }
}

export async function getAdminListings(input: GetAdminListingsInput): Promise<ListingsPage> {
  const supabase = getSupabase()

  const query = supabase
    .from('listings')
    .select('id, image_url, image_path, building_id, location_type, other_location_type, location_details, description, status, created_at, expires_at', {
      count: 'exact'
    })
    .order('created_at', { ascending: false })
    .range(input.offset, input.offset + input.limit - 1)

  const { data, error, count } = await query

  if (error) {
    throw error
  }

  const rows = (data ?? []) as ListingRow[]
  const buildingIds = [...new Set(rows.map((row) => row.building_id))]
  if (buildingIds.length === 0) {
    return {
      data: [],
      pageInfo: {
        limit: input.limit,
        offset: input.offset,
        hasMore: typeof count === 'number' ? input.offset < count : false,
        ...(typeof count === 'number' ? { total: count } : {})
      }
    }
  }

  const { data: buildings, error: buildingError } = await supabase
    .from('buildings')
    .select('id, name, created_at')
    .in('id', buildingIds)

  if (buildingError) {
    throw buildingError
  }

  const buildingMap = new Map<string, BuildingRow>((buildings ?? []).map((row) => [row.id, row as BuildingRow]))

  const listings = rows.map((row) => {
    const building = buildingMap.get(row.building_id)
    if (!building) {
      throw new Error(`Missing building for listing ${row.id}`)
    }

    return { row, building }
  })

  const resolvedListings = await Promise.all(
    listings.map(async ({ row, building }) => await toListing(row as ListingInsertRow, building))
  )

  return {
    data: resolvedListings,
    pageInfo: {
      limit: input.limit,
      offset: input.offset,
      hasMore: typeof count === 'number' ? input.offset + resolvedListings.length < count : resolvedListings.length === input.limit,
      ...(typeof count === 'number' ? { total: count } : {})
    }
  }
}

export async function getListingById(id: string): Promise<ListingDetail | null> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('listings')
    .select('id, image_url, image_path, building_id, location_type, other_location_type, location_details, description, status, created_at, expires_at')
    .eq('id', id)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle<ListingRow>()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  const building = await getBuildingById(data.building_id)
  return await toListing(data as ListingInsertRow, building)
}

export async function updateListingStatus(id: string, status: ListingStatus): Promise<ListingDetail | null> {
  const supabase = getSupabase()

  const { data: updatedRow, error } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', id)
    .select('id, image_url, image_path, building_id, location_type, other_location_type, location_details, description, status, created_at, expires_at')
    .maybeSingle<ListingRow>()

  if (error) {
    throw error
  }

  if (!updatedRow) {
    return null
  }

  const building = await getBuildingById(updatedRow.building_id)
  return await toListing(updatedRow as ListingInsertRow, building)
}