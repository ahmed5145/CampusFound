import Link from 'next/link'
import PageView from '../components/analytics/PageView'
import Logo from '../components/ui/Logo'

export default function Home() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center py-10">
      <PageView eventName="homepage_viewed" />
      <section className="w-full max-w-2xl rounded-3xl border border-brand-cream-dark bg-white p-8 shadow-sm sm:p-10">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo variant="full" className="h-10 w-auto sm:h-12" priority />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-brand-navy sm:text-5xl">
            Find and report items fast.
          </h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-brand-muted sm:text-lg">
            Browse recent listings or report a found item in a few quick steps.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/browse"
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand-navy px-5 text-sm font-medium text-white transition-colors hover:bg-brand-navy-hover"
          >
            Browse Listings
          </Link>
          <Link
            href="/upload"
            className="inline-flex h-12 items-center justify-center rounded-full border border-brand-cream-dark px-5 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-cream"
          >
            Report Item
          </Link>
        </div>
      </section>
    </main>
  );
}
