import { getAdminReports } from '../../../../lib/reports'
import { requireAdminSession } from '../../../../lib/admin-guard'

export async function GET() {
  const authError = await requireAdminSession()
  if (authError) {
    return authError
  }

  try {
    const data = await getAdminReports()
    return Response.json({ data }, { status: 200 })
  } catch {
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}
