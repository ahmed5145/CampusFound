import Link from 'next/link'
import PageView from '../components/analytics/PageView'

export default function Home() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center py-10">
      <PageView eventName="homepage_viewed" />
      <section className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="space-y-4 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Campus Found</p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Find and report items fast.
          </h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
            Browse recent listings or report a found item in a few quick steps.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/browse"
            className="inline-flex h-12 items-center justify-center rounded-full bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Browse Listings
          </Link>
          <Link
            href="/upload"
            className="inline-flex h-12 items-center justify-center rounded-full border border-gray-300 px-5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
          >
            Report Item
          </Link>
        </div>
      </section>
    </main>
  );
}
