import { createClient } from '@supabase/supabase-js'

import { E2E_TEST_LISTING_DESCRIPTION } from '../../src/config/e2e'

export default async function globalTeardown() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const bucket = (process.env.SUPABASE_STORAGE_BUCKET ?? 'listings').trim()

  if (!supabaseUrl || !serviceRoleKey) {
    return
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const { data: listings, error } = await supabase
    .from('listings')
    .select('id, image_path')
    .eq('description', E2E_TEST_LISTING_DESCRIPTION)

  if (error || !listings?.length) {
    return
  }

  const listingIds = listings.map((listing) => listing.id)

  await supabase.from('reports').delete().in('listing_id', listingIds)
  await supabase.from('moderation_events').delete().in('listing_id', listingIds)

  const storagePaths = listings
    .map((listing) => listing.image_path?.trim() || `${listing.id}/image.jpg`)
    .filter((path) => path.length > 0)

  if (storagePaths.length > 0) {
    await supabase.storage.from(bucket).remove(storagePaths)
  }

  await supabase.from('listings').delete().in('id', listingIds)
}
