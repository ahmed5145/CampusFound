import { expireStaleListings } from '../../../../lib/listing-expiry'

function isAuthorized(request: Request): boolean {
  const configuredSecret = process.env.CRON_SECRET?.trim()
  if (!configuredSecret) {
    return false
  }

  const authorization = request.headers.get('authorization') ?? ''
  const bearerMatch = authorization.match(/^Bearer\s+(.+)$/i)
  const bearerSecret = bearerMatch?.[1]?.trim()
  if (bearerSecret && bearerSecret === configuredSecret) {
    return true
  }

  const headerSecret = request.headers.get('x-cron-secret')?.trim()
  return headerSecret === configuredSecret
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const expiredCount = await expireStaleListings()
    return Response.json({ data: { expired_count: expiredCount } }, { status: 200 })
  } catch {
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}
