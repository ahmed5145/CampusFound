'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type LoginMode = 'email' | 'secret'

export default function LoginForm() {
  const router = useRouter()
  const [mode, setMode] = useState<LoginMode>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secret, setSecret] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const body =
        mode === 'email'
          ? { email, password }
          : { secret }

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        setErrorMessage(payload?.error ?? 'Could not sign in.')
        return
      }

      router.replace('/admin')
      router.refresh()
    } catch {
      setErrorMessage('Could not sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex gap-2 rounded-full border border-gray-200 bg-gray-50 p-1">
        <button
          type="button"
          onClick={() => setMode('email')}
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
            mode === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
          }`}
        >
          Staff email
        </button>
        <button
          type="button"
          onClick={() => setMode('secret')}
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
            mode === 'secret' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
          }`}
        >
          Shared secret
        </button>
      </div>

      {mode === 'email' ? (
        <>
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              suppressHydrationWarning
              data-1p-ignore="true"
              data-lpignore="true"
              data-bwignore="true"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <label htmlFor="admin-secret" className="text-sm font-medium text-gray-700">
            Admin secret
          </label>
          <input
            id="admin-secret"
            name="secret"
            type="password"
            autoComplete="current-password"
            suppressHydrationWarning
            data-1p-ignore="true"
            data-lpignore="true"
            data-bwignore="true"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            placeholder="Enter the shared secret"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />
        </div>
      )}

      {errorMessage ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
