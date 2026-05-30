'use client'

import { useState } from 'react'

import ImageUpload from '../../components/ui/ImageUpload'
import UploadForm from '../../components/forms/UploadForm'

export interface UploadDraft {
  imageLabel: string
  building: string
  locationType: string
  locationDetails: string
  description: string
}

const initialDraft: UploadDraft = {
  imageLabel: 'No image selected yet',
  building: '',
  locationType: '',
  locationDetails: '',
  description: ''
}

export default function Page() {
  const [draft, setDraft] = useState<UploadDraft>(initialDraft)

  function updateDraft(patch: Partial<UploadDraft>) {
    setDraft((current) => ({
      ...current,
      ...patch
    }))
  }

  function setPlaceholderImage() {
    updateDraft({ imageLabel: 'Image placeholder selected' })
  }

  function clearPlaceholderImage() {
    updateDraft({ imageLabel: 'No image selected yet' })
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Upload</p>
        <h1 className="text-3xl font-semibold text-gray-900">Create a found-item listing</h1>
        <p className="text-sm leading-6 text-gray-600">
          This is the upload page shell. Image picking, validation, and submission come next.
        </p>
      </header>

      <ImageUpload
        imageLabel={draft.imageLabel}
        onSelectPlaceholderImage={setPlaceholderImage}
        onClearPlaceholderImage={clearPlaceholderImage}
      />

      <UploadForm draft={draft} onDraftChange={updateDraft} />
    </main>
  )
}
