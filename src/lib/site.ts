const defaultDescription = 'Found-item listings for your campus community'

export function getSiteDescription(): string {
  return defaultDescription
}

export function getMetadataBase(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) {
    return new URL(configured.endsWith('/') ? configured : `${configured}/`)
  }

  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (vercelUrl) {
    return new URL(`https://${vercelUrl}`)
  }

  return new URL('http://localhost:3000')
}
