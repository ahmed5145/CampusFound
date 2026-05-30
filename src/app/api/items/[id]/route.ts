import { getListingById } from '../../../../lib/db'
import { validateListingIdParam } from '../../../../lib/validators'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = validateListingIdParam(params.id)
    const data = await getListingById(id)

    if (!data) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    return Response.json({ data }, { status: 200 })
  } catch {
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}