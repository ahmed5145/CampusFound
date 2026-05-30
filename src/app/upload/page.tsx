'use client'

import { useState } from 'react'

import ImageUpload from '../../components/ui/ImageUpload'
import UploadForm from '../../components/forms/UploadForm'
import type { LocationType } from '../../types/db-schema'

export interface UploadDraft {
  selectedImage: File | null
  building: string
  locationType: LocationType | ''
  locationDetails: string
  description: string
}

const initialDraft: UploadDraft = {
  selectedImage: null,
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

  function handleImageChange(file: File | null) {
    updateDraft({ selectedImage: file })
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
        file={draft.selectedImage}
        onFileChange={handleImageChange}
      />

      <UploadForm draft={draft} onDraftChange={updateDraft} />
    </main>
  )
}
