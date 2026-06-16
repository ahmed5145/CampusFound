import 'server-only'

import { createHash } from 'node:crypto'

export function hashReporterIp(ip: string): string {
  const pepper = process.env.ADMIN_SECRET ?? 'campusfound'
  return createHash('sha256').update(`${ip}:${pepper}`).digest('hex')
}
