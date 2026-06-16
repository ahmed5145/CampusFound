import { randomUUID } from 'node:crypto'

import { createListing, getListings } from '../../../lib/db'
import { deleteListingImage, uploadListingImage } from '../../../lib/storage'
import { rateLimit } from '../../../lib/rate-limit'
import { validateListingCreateFormData, validateListingQuery } from '../../../lib/validators'

type ValidationErrorWithFields = Error & {
  fieldErrors?: Record<string, string[]>
}

function isValidationError(error: unknown): error is ValidationErrorWithFields {
  return (
    error instanceof Error &&
    error.name === 'ValidationError' &&
    typeof (error as ValidationErrorWithFields).fieldErrors === 'object' &&
    (error as ValidationErrorWithFields).fieldErrors !== null
  )
}

export async function GET(request: Request) {
  try {
    const query = validateListingQuery(new URL(request.url).searchParams)
    const data = await getListings({
      buildingId: query.buildingId,
      locationType: query.locationType,
      searchQuery: query.searchQuery,
      limit: query.limit,
      offset: query.offset
    })

    return Response.json(data, { status: 200 })
  } catch (error) {
    if (isValidationError(error)) {
      return Response.json(
        {
          error: 'Validation failed',
          fieldErrors: error.fieldErrors ?? {}
        },
        { status: 422 }
      )
    }

    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const listingId = randomUUID()

  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const limiterKey = `items:create:ip:${ip}`
    const limitResult = rateLimit(limiterKey, { limit: 6, windowMs: 60_000 })
    if (!limitResult.allowed) {
      return Response.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': String(limitResult.retryAfterSeconds)
          }
        }
      )
    }

    const formData = await request.formData()
    const input = validateListingCreateFormData(formData)
    const uploadResult = await uploadListingImage(listingId, input.image)

    const data = await createListing({
      id: listingId,
      imageUrl: uploadResult.publicUrl ?? uploadResult.path,
      imagePath: uploadResult.path,
      buildingId: input.buildingId,
      locationType: input.locationType,
      otherLocationType: input.otherLocationType,
      locationDetails: input.locationDetails,
      description: input.description
    })

    return Response.json({ data, message: 'Listing created' }, { status: 201 })
  } catch (error) {
    if (isValidationError(error)) {
      return Response.json(
        {
          error: 'Validation failed',
          fieldErrors: error.fieldErrors ?? {}
        },
        { status: 422 }
      )
    }

    await deleteListingImage(listingId)
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}
