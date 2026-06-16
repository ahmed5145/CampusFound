export const ADMIN_SESSION_COOKIE_NAME = 'campusfound_admin_session'
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8

type AdminSessionPayload = {
  v: 1
  iat: number
  exp: number
  email?: string
  role?: 'moderator' | 'admin'
  method?: 'secret' | 'email'
}

function encodeText(value: string): Uint8Array {
  return new TextEncoder().encode(value)
}

function decodeText(value: Uint8Array): string {
  return new TextDecoder().decode(value)
}

// Copy into a fresh ArrayBuffer-backed view for WebCrypto + strict TS BufferSource typing.
function toCryptoBytes(value: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(value.byteLength)
  copy.set(value)
  return copy
}

function base64UrlEncode(value: Uint8Array): string {
  let binary = ''

  for (let index = 0; index < value.length; index += 0x8000) {
    binary += String.fromCharCode(...value.subarray(index, index + 0x8000))
  }

  return globalThis
    .btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const padded = `${normalized}${'='.repeat((4 - (normalized.length % 4)) % 4)}`
  const binary = globalThis.atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey(
    'raw',
    toCryptoBytes(encodeText(secret)),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function createSessionPayload(
  now: number = Date.now(),
  identity?: Pick<AdminSessionPayload, 'email' | 'role' | 'method'>
): AdminSessionPayload {
  const issuedAt = Math.floor(now / 1000)

  return {
    v: 1,
    iat: issuedAt,
    exp: issuedAt + ADMIN_SESSION_TTL_SECONDS,
    ...(identity?.email ? { email: identity.email } : {}),
    ...(identity?.role ? { role: identity.role } : {}),
    ...(identity?.method ? { method: identity.method } : {})
  }
}

export async function createAdminSessionCookieValue(
  secret: string,
  identity?: Pick<AdminSessionPayload, 'email' | 'role' | 'method'>,
  now: number = Date.now()
): Promise<string> {
  const payload = createSessionPayload(now, identity)
  const payloadBytes = encodeText(JSON.stringify(payload))
  const key = await importHmacKey(secret)
  const signature = new Uint8Array(
    await globalThis.crypto.subtle.sign('HMAC', key, toCryptoBytes(payloadBytes))
  )

  return `v1.${base64UrlEncode(payloadBytes)}.${base64UrlEncode(signature)}`
}

export async function verifyAdminSessionCookieValue(
  secret: string,
  cookieValue: string | undefined,
  now: number = Date.now()
): Promise<boolean> {
  if (!cookieValue) {
    return false
  }

  const parts = cookieValue.split('.')
  if (parts.length !== 3 || parts[0] !== 'v1') {
    return false
  }

  try {
    const payloadBytes = base64UrlDecode(parts[1])
    const payload = JSON.parse(decodeText(payloadBytes)) as Partial<AdminSessionPayload>

    if (payload.v !== 1 || typeof payload.iat !== 'number' || typeof payload.exp !== 'number') {
      return false
    }

    if (Math.floor(now / 1000) >= payload.exp) {
      return false
    }

    const signatureBytes = base64UrlDecode(parts[2])
    const key = await importHmacKey(secret)

    return globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      toCryptoBytes(signatureBytes),
      toCryptoBytes(payloadBytes)
    )
  } catch {
    return false
  }
}