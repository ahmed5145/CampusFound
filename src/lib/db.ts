import 'server-only'

import { E2E_TEST_LISTING_DESCRIPTION } from '../config/e2e'
import { createModerationEvent } from './moderation-events'
import { getBuildingIdsForCampusScope, getCampusIdForScope } from './campus'
import { getServiceSupabase } from './supabaseClient'
import type { ListingStatus, LocationType } from '../types/db-schema'
import { getListingImageDisplayUrl, getListingImageThumbnailUrl } from './storage'
import { toIlikePattern } from './validators'

export interface BuildingRecord {
  id: string
  name: string
}

export interface ListingPublic {
  id: string
  image_url: string
  image_thumbnail_url: string
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
  id?: string
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
  searchQuery: string | null
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

type ListingRowWithBuilding = ListingRow & {
  buildings?: BuildingRow | BuildingRow[] | null
}

const LISTING_FIELDS =
  'id, image_url, image_path, building_id, location_type, other_location_type, location_details, description, status, created_at, expires_at'

const LISTING_SELECT_WITH_BUILDING = `${LISTING_FIELDS}, buildings ( id, name, created_at )`

function extractEmbeddedBuilding(row: ListingRowWithBuilding): BuildingRow {
  const embedded = row.buildings
  if (Array.isArray(embedded)) {
    if (embedded[0]) {
      return embedded[0]
    }
  } else if (embedded) {
    return embedded
  }

  throw new Error(`Missing building for listing ${row.id}`)
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
  const thumbnailUrl = getListingImageThumbnailUrl(resolvedImageUrl)

  return {
    id: record.id,
    image_url: resolvedImageUrl ?? '',
    image_thumbnail_url: thumbnailUrl ?? resolvedImageUrl ?? '',
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
  const campusId = await getCampusIdForScope()

  let query = supabase.from('buildings').select('id, name, created_at').order('name', { ascending: true })

  if (campusId) {
    query = query.or(`campus_id.eq.${campusId},campus_id.is.null`)
  }

  const { data, error } = await query

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
      ...(input.id ? { id: input.id } : {}),
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
  const scopedBuildingIds = await getBuildingIdsForCampusScope()

  let query = supabase
    .from('listings')
    .select(LISTING_SELECT_WITH_BUILDING, {
      count: 'exact'
    })
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .or(`description.is.null,description.neq."${E2E_TEST_LISTING_DESCRIPTION}"`)
    .order('created_at', { ascending: false })
    .range(input.offset, input.offset + input.limit - 1)

  if (scopedBuildingIds) {
    if (scopedBuildingIds.length === 0) {
      return {
        data: [],
        pageInfo: {
          limit: input.limit,
          offset: input.offset,
          hasMore: false,
          total: 0
        }
      }
    }

    query = query.in('building_id', scopedBuildingIds)
  }

  if (input.buildingId) {
    query = query.eq('building_id', input.buildingId)
  }

  if (input.locationType) {
    query = query.eq('location_type', input.locationType)
  }

  if (input.searchQuery) {
    const pattern = toIlikePattern(input.searchQuery)
    query = query.or(
      `description.ilike.${pattern},location_details.ilike.${pattern},other_location_type.ilike.${pattern}`
    )
  }

  const { data, error, count } = await query

  if (error) {
    throw error
  }

  const rows = (data ?? []) as ListingRowWithBuilding[]
  if (rows.length === 0) {
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

  const resolvedListings = await Promise.all(
    rows.map(async (row) => await toListing(row as ListingInsertRow, extractEmbeddedBuilding(row)))
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
    .select(LISTING_SELECT_WITH_BUILDING, {
      count: 'exact'
    })
    .order('created_at', { ascending: false })
    .range(input.offset, input.offset + input.limit - 1)

  const { data, error, count } = await query

  if (error) {
    throw error
  }

  const rows = (data ?? []) as ListingRowWithBuilding[]
  if (rows.length === 0) {
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

  const resolvedListings = await Promise.all(
    rows.map(async (row) => await toListing(row as ListingInsertRow, extractEmbeddedBuilding(row)))
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
    .select(LISTING_SELECT_WITH_BUILDING)
    .eq('id', id)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle<ListingRowWithBuilding>()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  return await toListing(data as ListingInsertRow, extractEmbeddedBuilding(data))
}

export async function updateListingStatus(id: string, status: ListingStatus): Promise<ListingDetail | null> {
  const supabase = getSupabase()

  const { data: existing, error: existingError } = await supabase
    .from('listings')
    .select('status')
    .eq('id', id)
    .maybeSingle<{ status: ListingStatus }>()

  if (existingError) {
    throw existingError
  }

  if (!existing) {
    return null
  }

  const { data: updatedRow, error } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', id)
    .select(LISTING_SELECT_WITH_BUILDING)
    .maybeSingle<ListingRowWithBuilding>()

  if (error) {
    throw error
  }

  if (!updatedRow) {
    return null
  }

  if (existing.status !== status) {
    await createModerationEvent({
      action: status === 'removed' ? 'listing_removed' : 'listing_restored',
      listingId: id,
      previousStatus: existing.status,
      newStatus: status
    })
  }

  return await toListing(updatedRow as ListingInsertRow, extractEmbeddedBuilding(updatedRow))
}