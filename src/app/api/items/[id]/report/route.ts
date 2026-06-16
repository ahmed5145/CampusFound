import { createReport, listingExists } from '../../../../../lib/reports'
import { rateLimit } from '../../../../../lib/rate-limit'
import { validateListingIdParam, validateReportCreateBody } from '../../../../../lib/validators'

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

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const listingId = validateListingIdParam(id)

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const limitResult = rateLimit(`reports:create:ip:${ip}`, { limit: 5, windowMs: 60_000 })
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

    const body = (await request.json().catch(() => null)) as unknown
    const input = validateReportCreateBody(body)

    const exists = await listingExists(listingId)
    if (!exists) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    const data = await createReport({
      listingId,
      reason: input.reason,
      details: input.details
    })

    return Response.json({ data, message: 'Report submitted' }, { status: 201 })
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
