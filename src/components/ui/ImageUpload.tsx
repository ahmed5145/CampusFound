'use client'

interface ImageUploadProps {
  imageLabel: string
  onSelectPlaceholderImage: () => void
  onClearPlaceholderImage: () => void
}

export default function ImageUpload({
  imageLabel,
  onSelectPlaceholderImage,
  onClearPlaceholderImage
}: ImageUploadProps) {
  return (
    <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">Image</h2>
        <p className="text-sm text-gray-600">
          Image upload shell only. File picker and preview behavior will be added later.
        </p>
      </div>

      <div className="mt-4 flex min-h-40 flex-col items-center justify-center rounded-xl bg-gray-50 px-4 py-6 text-center">
        <p className="text-sm font-medium text-gray-900">{imageLabel}</p>
        <p className="mt-2 text-xs leading-5 text-gray-500">
          This placeholder section will eventually contain camera/file selection and preview.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onSelectPlaceholderImage}
            className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
          >
            Select image placeholder
          </button>
          <button
            type="button"
            onClick={onClearPlaceholderImage}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
          >
            Clear
          </button>
        </div>
      </div>
    </section>
  )
}
