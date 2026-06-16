import { getRecentModerationEvents } from '../../../../lib/moderation-events'

export async function GET() {
  try {
    const data = await getRecentModerationEvents(20)
    return Response.json({ data }, { status: 200 })
  } catch {
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}
