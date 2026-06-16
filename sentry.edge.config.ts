// Optional Sentry init.
// This repo can run without Sentry installed; Vercel/CI should not fail on missing SDK.
// If you want Sentry, install `@sentry/nextjs` and set DSN env vars.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Sentry = require('@sentry/nextjs') as { init: (options: Record<string, unknown>) => void }
  Sentry.init({
    dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1
  })
} catch {
  // Sentry not installed; ignore.
}

