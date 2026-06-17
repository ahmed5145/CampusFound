'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

const campusName = process.env.NEXT_PUBLIC_CAMPUS_NAME?.trim() || 'Campus Found'
const showCampusSubtitle = campusName.toLowerCase() !== 'campus found'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse' },
  { href: '/upload', label: 'Report Item' }
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-brand-cream-dark bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo variant="mark" className="h-8 w-8 shrink-0" priority />
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight text-brand-navy">CampusFound</span>
            {showCampusSubtitle ? (
              <span className="block text-xs font-medium text-brand-muted">{campusName}</span>
            ) : null}
          </span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-navy text-white' : 'text-brand-muted hover:bg-brand-cream-dark hover:text-brand-navy'
                ].join(' ')}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
