// Lightweight PostHog wrapper for client-side instrumentation
// Install `posthog-js` for client usage.

import posthog from 'posthog-js'

let initialized = false

export function initAnalytics(key?: string) {
  const apiKey = key ?? process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!apiKey) return
  if (initialized) return
  posthog.init(apiKey, { api_host: 'https://app.posthog.com' })
  initialized = true
}

export function captureEvent(eventName: string, properties?: Record<string, unknown>) {
  if (!initialized) initAnalytics()
  try {
    posthog.capture(eventName, properties)
  } catch (e) {
    // noop in case posthog isn't available in the environment
    // eslint-disable-next-line no-console
    console.warn('PostHog capture failed', e)
  }
}

export default { initAnalytics, captureEvent }
