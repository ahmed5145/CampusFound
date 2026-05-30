'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'

interface ImageUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ImageUpload({ file, onFileChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null
    onFileChange(selectedFile)
  }

  function handleRemoveImage() {
    if (inputRef.current) {
      inputRef.current.value = ''
    }

    onFileChange(null)
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">Image</h2>
        <p className="text-sm text-gray-600">Choose a photo from your device storage.</p>
      </div>

      <div className="mt-4 space-y-4">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white">
          Select image
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            className="sr-only"
            aria-label="Select an image file"
          />
        </label>

        <div className="rounded-xl bg-gray-50 p-4">
          {file ? (
            <div className="space-y-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="h-56 w-full rounded-lg object-cover"
                />
              ) : null}

              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p>{formatFileSize(file.size)}</p>
                <p className="text-xs text-gray-500">Accepted: JPEG, PNG, or WebP</p>
              </div>

              <button
                type="button"
                onClick={handleRemoveImage}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
              >
                Remove image
              </button>
            </div>
          ) : (
            <div className="flex min-h-44 items-center justify-center text-center">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">No image selected</p>
                <p className="text-xs leading-5 text-gray-500">
                  Select a JPEG, PNG, or WebP file from your device to continue.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
