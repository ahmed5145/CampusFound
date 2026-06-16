import { NextResponse } from 'next/server'

import { ADMIN_SESSION_COOKIE_NAME } from '../../../../lib/admin-auth'

export async function POST(request: Request) {
  const response = NextResponse.json({ data: { loggedOut: true } }, { status: 200 })

  const forwardedProto = request.headers.get('x-forwarded-proto')
  const isSecureRequest = forwardedProto === 'https' || new URL(request.url).protocol === 'https:'
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isSecureRequest,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
    expires: new Date(0)
  })

  return response
}