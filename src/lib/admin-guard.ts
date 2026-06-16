import 'server-only'

import { cookies } from 'next/headers'

import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionCookieValue } from './admin-auth'

export async function requireAdminSession(): Promise<Response | null> {
  const configuredSecret = process.env.ADMIN_SECRET
  if (!configuredSecret) {
    return Response.json({ error: 'Admin secret not configured' }, { status: 500 })
  }

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value
  const isAuthenticated = await verifyAdminSessionCookieValue(configuredSecret, sessionCookie)

  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
