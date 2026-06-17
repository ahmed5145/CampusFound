import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-brand-cream-dark bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="font-medium text-brand-navy">CampusFound</p>

        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-brand-navy">
            Home
          </Link>
          <Link href="/about" className="hover:text-brand-navy">
            About
          </Link>
          <Link href="/browse" className="hover:text-brand-navy">
            Browse
          </Link>
          <Link href="/upload" className="hover:text-brand-navy">
            Report Item
          </Link>
          <Link href="/terms" className="hover:text-brand-navy">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-brand-navy">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
