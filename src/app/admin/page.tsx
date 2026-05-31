import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import AdminDashboard from './AdminDashboard'
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionCookieValue
} from '../../lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const configuredSecret = process.env.ADMIN_SECRET

  if (!configuredSecret) {
    redirect('/admin/login')
  }

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value
  const isAuthenticated = await verifyAdminSessionCookieValue(configuredSecret, sessionCookie)

  if (!isAuthenticated) {
    redirect('/admin/login')
  }

  return <AdminDashboard />
}
