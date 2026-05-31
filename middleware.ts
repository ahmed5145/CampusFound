import { NextRequest, NextResponse } from 'next/server'

import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionCookieValue
} from './src/lib/admin-auth'

const ADMIN_LOGIN_PATH = '/admin/login'
const ADMIN_LOGIN_API_PATH = '/api/admin/login'
const ADMIN_LOGOUT_API_PATH = '/api/admin/logout'

function isAdminApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/admin/')
}

function isProtectedAdminPagePath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === ADMIN_LOGIN_API_PATH || pathname === ADMIN_LOGOUT_API_PATH || pathname === ADMIN_LOGIN_PATH) {
    return NextResponse.next()
  }

  if (!isProtectedAdminPagePath(pathname) && !isAdminApiPath(pathname)) {
    return NextResponse.next()
  }

  const configuredSecret = process.env.ADMIN_SECRET
  if (!configuredSecret) {
    return isAdminApiPath(pathname)
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url))
  }

  const cookieValue = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  const isAuthorized = await verifyAdminSessionCookieValue(configuredSecret, cookieValue)

  if (isAuthorized) {
    return NextResponse.next()
  }

  if (isAdminApiPath(pathname)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url))
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}