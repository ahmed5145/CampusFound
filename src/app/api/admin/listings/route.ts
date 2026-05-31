import { getAdminListings } from '../../../../lib/db'

function parseInteger(value: string | null, fallback: number, minimum: number, maximum: number): number {
  if (value === null || value === '') {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error('Invalid pagination value')
  }

  return parsed
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = parseInteger(url.searchParams.get('limit'), 50, 1, 100)
    const offset = parseInteger(url.searchParams.get('offset'), 0, 0, 100000)
    const data = await getAdminListings({ limit, offset })

    return Response.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid pagination value') {
      return Response.json({ error: 'Validation failed' }, { status: 422 })
    }

    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}