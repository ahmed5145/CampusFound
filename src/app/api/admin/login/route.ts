import { NextResponse } from 'next/server'

import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionCookieValue
} from '../../../../lib/admin-auth'

type LoginBody = {
  secret?: string
}

async function readSecretFromRequest(request: Request): Promise<string | null> {
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const body = (await request.json().catch(() => null)) as LoginBody | null
    return body?.secret ?? null
  }

  const formData = await request.formData().catch(() => null)
  if (!formData) {
    return null
  }

  const value = formData.get('secret')
  return typeof value === 'string' ? value : null
}

export async function POST(request: Request) {
  const configuredSecret = process.env.ADMIN_SECRET
  if (!configuredSecret) {
    return NextResponse.json({ error: 'Admin secret not configured' }, { status: 500 })
  }

  const providedSecret = await readSecretFromRequest(request)
  if (!providedSecret || providedSecret !== configuredSecret) {
    return NextResponse.json({ error: 'Invalid admin secret' }, { status: 401 })
  }

  const cookieValue = await createAdminSessionCookieValue(configuredSecret)
  const response = NextResponse.json({ data: { authenticated: true } }, { status: 200 })

  const isProduction = process.env.NODE_ENV === 'production'
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: cookieValue,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
    expires: new Date(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000)
  })

  return response
}