export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Privacy</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-gray-700">
        <p>
          Campus Found is a found-item board intended to help campus community members reunite with their belongings.
        </p>
        <p className="font-medium text-gray-900">What you should not post</p>
        <ul className="list-disc pl-5">
          <li>Government IDs, student IDs, credit cards, passports, or medical information</li>
          <li>Phone numbers, addresses, or other sensitive personal information</li>
          <li>Photos that include identifiable faces when not necessary</li>
        </ul>
        <p className="font-medium text-gray-900">Data we store</p>
        <ul className="list-disc pl-5">
          <li>Listing content you submit (image and optional text fields)</li>
          <li>Basic timestamps for when listings are created and when they expire</li>
        </ul>
        <p>
          If you believe a listing contains sensitive content, please contact the campus moderators to request removal.
        </p>
      </div>
    </main>
  )
}

