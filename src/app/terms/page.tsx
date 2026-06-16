import Link from 'next/link'

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Terms</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-gray-700">
        <p>
          Campus Found is provided as a community tool. Listings may be moderated or removed to keep the service safe and
          useful.
        </p>
        <p className="font-medium text-gray-900">Acceptable use</p>
        <ul className="list-disc pl-5">
          <li>Only post content related to found items on campus</li>
          <li>Do not upload prohibited content or personal identifiers</li>
          <li>Do not use the service to harass, threaten, or impersonate others</li>
        </ul>
        <p className="font-medium text-gray-900">Moderation</p>
        <p>
          Moderators may remove listings that violate campus policy, appear unsafe, or are reported by users.
        </p>
        <p>
          For privacy details, see the <Link href="/privacy" className="underline">Privacy page</Link>.
        </p>
      </div>
    </main>
  )
}

