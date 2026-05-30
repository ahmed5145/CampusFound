import { getBuildings } from '../../../lib/db'

export async function GET() {
  try {
    const data = await getBuildings()
    return Response.json({ data }, { status: 200 })
  } catch {
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}