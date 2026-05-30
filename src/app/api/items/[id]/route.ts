import { getListingById } from '../../../../lib/db'
import { validateListingIdParam } from '../../../../lib/validators'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const validatedId = validateListingIdParam(id)
    const data = await getListingById(validatedId)

    if (!data) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    return Response.json({ data }, { status: 200 })
  } catch {
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}