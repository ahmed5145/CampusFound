import { randomUUID } from 'node:crypto'

import { createListing, getListings } from '../../../lib/db'
import { deleteListingImage, uploadListingImage } from '../../../lib/storage'
import { validateListingCreateFormData, validateListingQuery } from '../../../lib/validators'

export async function GET(request: Request) {
  try {
    const query = validateListingQuery(new URL(request.url).searchParams)
    const data = await getListings({
      buildingId: query.buildingId,
      locationType: query.locationType,
      limit: query.limit,
      offset: query.offset
    })

    return Response.json(data, { status: 200 })
  } catch {
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const listingId = randomUUID()

  try {
    const formData = await request.formData()
    const input = validateListingCreateFormData(formData)
    const uploadResult = await uploadListingImage(listingId, input.image)

    const data = await createListing({
      imageUrl: uploadResult.publicUrl,
      buildingId: input.buildingId,
      locationType: input.locationType,
      locationDetails: input.locationDetails,
      description: input.description
    })

    return Response.json({ data, message: 'Listing created' }, { status: 201 })
  } catch {
    await deleteListingImage(listingId)
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}
