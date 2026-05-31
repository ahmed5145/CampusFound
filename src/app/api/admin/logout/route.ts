import { NextResponse } from 'next/server'

import { ADMIN_SESSION_COOKIE_NAME } from '../../../../lib/admin-auth'

export async function POST() {
  const response = NextResponse.json({ data: { loggedOut: true } }, { status: 200 })

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
    expires: new Date(0)
  })

  return response
}