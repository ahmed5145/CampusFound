import { requireAdminSession } from '../../../../lib/admin-guard'
import { getAdminStats } from '../../../../lib/admin-stats'

export async function GET() {
  const authError = await requireAdminSession()
  if (authError) {
    return authError
  }

  try {
    const data = await getAdminStats()
    return Response.json({ data }, { status: 200 })
  } catch {
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}
