import { updateListingStatus } from '../../../../../lib/db'
import { validateListingIdParam } from '../../../../../lib/validators'

type ListingStatusBody = {
  status?: string
}

const ALLOWED_STATUSES = new Set(['active', 'removed'])

async function readStatusFromRequest(request: Request): Promise<string | null> {
  const body = (await request.json().catch(() => null)) as ListingStatusBody | null
  return body?.status ?? null
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const validatedId = validateListingIdParam(id)
    const status = await readStatusFromRequest(request)

    if (!status || !ALLOWED_STATUSES.has(status)) {
      return Response.json({ error: 'Validation failed' }, { status: 422 })
    }

    const updated = await updateListingStatus(validatedId, status === 'active' ? 'active' : 'removed')

    if (!updated) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    return Response.json({ data: updated }, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return Response.json(
        {
          error: 'Validation failed',
          fieldErrors: (error as Error & { fieldErrors?: Record<string, string[]> }).fieldErrors ?? {}
        },
        { status: 422 }
      )
    }

    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}