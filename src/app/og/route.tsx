import { createOgImageResponse } from '../../lib/og-image'

export const runtime = 'edge'

export async function GET() {
  const response = await createOgImageResponse()
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  return response
}
