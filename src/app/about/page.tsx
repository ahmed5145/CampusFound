export default function Page() {
  const contact = process.env.NEXT_PUBLIC_MODERATION_CONTACT

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">About</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-gray-700">
        <p>
          Campus Found is a lightweight found-item board for campus communities. It’s designed to make it fast to post a
          found item and easy for others to browse recent listings.
        </p>

        <p className="font-medium text-gray-900">Safety and privacy</p>
        <p>
          Please do not upload sensitive personal information (IDs, card numbers, addresses). Listings may be moderated
          or removed.
        </p>

        <p className="font-medium text-gray-900">Contact / takedown</p>
        <p>
          {contact
            ? (
              <>
                To request removal of a listing or report an urgent issue, contact: <span className="font-medium">{contact}</span>.
              </>
            )
            : (
              <>
                To request removal of a listing or report an urgent issue, contact your campus lost-and-found or campus
                safety office.
              </>
            )}
        </p>
      </div>
    </main>
  )
}
