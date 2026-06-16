import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import LoginForm from './LoginForm'
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionCookieValue
} from '../../../lib/admin-auth'

export default async function Page() {
  const configuredSecret = process.env.ADMIN_SECRET

  if (configuredSecret) {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value
    const isAuthenticated = await verifyAdminSessionCookieValue(configuredSecret, sessionCookie)

    if (isAuthenticated) {
      redirect('/admin')
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center py-10">
      <section className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="space-y-3 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Admin access</p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Sign in to moderate listings
          </h1>
          <p className="mx-auto max-w-md text-sm leading-6 text-gray-600 sm:text-base">
            Sign in with your staff email or the shared admin secret to moderate listings and reports.
          </p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>
      </section>
    </main>
  )
}