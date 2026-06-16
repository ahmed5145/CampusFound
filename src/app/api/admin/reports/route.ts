import { getAdminReports } from '../../../../lib/reports'

export async function GET() {
  try {
    const data = await getAdminReports()
    return Response.json({ data }, { status: 200 })
  } catch {
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}
