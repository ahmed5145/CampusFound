import 'server-only'

type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number }

type WindowConfig = {
  limit: number
  windowMs: number
}

const DEFAULT_WINDOW: WindowConfig = {
  // Conservative pilot defaults; tune based on observed traffic.
  limit: 10,
  windowMs: 60_000
}

type Bucket = {
  resetAt: number
  count: number
}

// Best-effort in-memory limiter.
// Note: In serverless/multi-instance environments this is not globally consistent,
// but it meaningfully reduces accidental spam and basic abuse during early pilots.
const buckets = new Map<string, Bucket>()

function nowMs(): number {
  return Date.now()
}

function getBucket(key: string, windowMs: number, now: number): Bucket {
  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    const next: Bucket = { resetAt: now + windowMs, count: 0 }
    buckets.set(key, next)
    return next
  }
  return existing
}

export function rateLimit(key: string, config: Partial<WindowConfig> = {}): RateLimitResult {
  const { limit, windowMs } = { ...DEFAULT_WINDOW, ...config }
  const now = nowMs()
  const bucket = getBucket(key, windowMs, now)

  bucket.count += 1
  if (bucket.count <= limit) {
    return { allowed: true }
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
  return { allowed: false, retryAfterSeconds }
}

