const defaultDescription =
  'Browse and report found items on campus. Post photos with building and location details, search listings, and help reunite belongings with students and staff.'

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
