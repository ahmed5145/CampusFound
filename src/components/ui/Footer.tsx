import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Campus Found</p>

        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <Link href="/browse" className="hover:text-gray-900">
            Browse
          </Link>
          <Link href="/upload" className="hover:text-gray-900">
            Report Item
          </Link>
          <Link href="/terms" className="hover:text-gray-900">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-gray-900">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
