import { createOgImageResponse } from '../../lib/og-image'

export const runtime = 'edge'

export async function GET() {
  return createOgImageResponse()
}
