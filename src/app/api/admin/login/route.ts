import { NextResponse } from 'next/server'

import { getAdminUserByEmail } from '../../../../lib/admin-users'
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionCookieValue
} from '../../../../lib/admin-auth'
import { getPublicSupabase } from '../../../../lib/supabaseClient'

type LoginBody = {
  secret?: string
  email?: string
  password?: string
}

async function readLoginBody(request: Request): Promise<LoginBody> {
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const body = (await request.json().catch(() => null)) as LoginBody | null
    return body ?? {}
  }

  const formData = await request.formData().catch(() => null)
  if (!formData) {
    return {}
  }

  return {
    secret: typeof formData.get('secret') === 'string' ? formData.get('secret') as string : undefined,
    email: typeof formData.get('email') === 'string' ? formData.get('email') as string : undefined,
    password: typeof formData.get('password') === 'string' ? formData.get('password') as string : undefined
  }
}

function setSessionCookie(response: NextResponse, request: Request, cookieValue: string) {
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const isSecureRequest = forwardedProto === 'https' || new URL(request.url).protocol === 'https:'

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: cookieValue,
    httpOnly: true,
    secure: isSecureRequest,
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
    expires: new Date(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000)
  })
}

export async function POST(request: Request) {
  const configuredSecret = process.env.ADMIN_SECRET
  if (!configuredSecret) {
    return NextResponse.json({ error: 'Admin secret not configured' }, { status: 500 })
  }

  const body = await readLoginBody(request)
  const email = body.email?.trim().toLowerCase()
  const password = body.password ?? ''

  if (email && password) {
    try {
      const supabase = getPublicSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error || !data.user?.email) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
      }

      const adminUser = await getAdminUserByEmail(data.user.email)
      if (!adminUser) {
        return NextResponse.json({ error: 'This account is not authorized for admin access' }, { status: 403 })
      }

      const cookieValue = await createAdminSessionCookieValue(configuredSecret, {
        email: adminUser.email,
        role: adminUser.role,
        method: 'email'
      })
      const response = NextResponse.json(
        { data: { authenticated: true, method: 'email', role: adminUser.role } },
        { status: 200 }
      )
      setSessionCookie(response, request, cookieValue)
      return response
    } catch {
      return NextResponse.json({ error: 'Could not sign in' }, { status: 500 })
    }
  }

  const providedSecret = body.secret ?? null
  if (!providedSecret || providedSecret !== configuredSecret) {
    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
  }

  const cookieValue = await createAdminSessionCookieValue(configuredSecret, {
    role: 'admin',
    method: 'secret'
  })
  const response = NextResponse.json({ data: { authenticated: true, method: 'secret', role: 'admin' } }, { status: 200 })
  setSessionCookie(response, request, cookieValue)
  return response
}
