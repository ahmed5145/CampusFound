import { E2E_TEST_LISTING_DESCRIPTION } from '../../src/config/e2e'

type E2eListingRow = {
  id: string
  image_path: string | null
}

function getServiceConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const bucket = (process.env.SUPABASE_STORAGE_BUCKET ?? 'listings').trim()

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return { supabaseUrl, serviceRoleKey, bucket }
}

async function serviceFetch(
  supabaseUrl: string,
  serviceRoleKey: string,
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(init.headers ?? {})
    }
  })
}

function toInFilter(values: string[]): string {
  return `in.(${values.join(',')})`
}

export default async function globalTeardown() {
  const config = getServiceConfig()
  if (!config) {
    return
  }

  const { supabaseUrl, serviceRoleKey, bucket } = config
  const descriptionFilter = encodeURIComponent(E2E_TEST_LISTING_DESCRIPTION)

  const listingsResponse = await serviceFetch(
    supabaseUrl,
    serviceRoleKey,
    `/rest/v1/listings?description=eq.${descriptionFilter}&select=id,image_path`
  )

  if (!listingsResponse.ok) {
    throw new Error(`E2E cleanup: could not load test listings (${listingsResponse.status})`)
  }

  const listings = (await listingsResponse.json()) as E2eListingRow[]
  if (!listings.length) {
    return
  }

  const listingIds = listings.map((listing) => listing.id)
  const idFilter = toInFilter(listingIds)

  await serviceFetch(supabaseUrl, serviceRoleKey, `/rest/v1/reports?listing_id=${idFilter}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' }
  })

  await serviceFetch(supabaseUrl, serviceRoleKey, `/rest/v1/moderation_events?listing_id=${idFilter}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' }
  })

  const storagePaths = listings
    .map((listing) => listing.image_path?.trim() || `${listing.id}/image.jpg`)
    .filter((path) => path.length > 0)

  if (storagePaths.length > 0) {
    const storageResponse = await serviceFetch(supabaseUrl, serviceRoleKey, `/storage/v1/object/${bucket}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(storagePaths)
    })

    if (!storageResponse.ok) {
      throw new Error(`E2E cleanup: could not delete storage objects (${storageResponse.status})`)
    }
  }

  const deleteListingsResponse = await serviceFetch(
    supabaseUrl,
    serviceRoleKey,
    `/rest/v1/listings?id=${idFilter}`,
    {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' }
    }
  )

  if (!deleteListingsResponse.ok) {
    throw new Error(`E2E cleanup: could not delete listings (${deleteListingsResponse.status})`)
  }
}
