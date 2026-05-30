'use client'

import { useEffect, useState } from 'react'

import BuildingPicker from '../../components/ui/BuildingPicker'
import ImageUpload from '../../components/ui/ImageUpload'
import UploadForm from '../../components/forms/UploadForm'
import { fetchBuildings, type SelectedBuilding } from '../../lib/buildings'
import type { LocationType } from '../../types/db-schema'

export interface UploadDraft {
  selectedImage: File | null
  selectedBuilding: SelectedBuilding | null
  locationType: LocationType | ''
  locationDetails: string
  description: string
}

const initialDraft: UploadDraft = {
  selectedImage: null,
  selectedBuilding: null,
  locationType: '',
  locationDetails: '',
  description: ''
}

export default function Page() {
  const [draft, setDraft] = useState<UploadDraft>(initialDraft)
  const [buildings, setBuildings] = useState<SelectedBuilding[]>([])
  const [isBuildingPickerOpen, setIsBuildingPickerOpen] = useState(false)
  const [isBuildingsLoading, setIsBuildingsLoading] = useState(true)
  const [buildingsError, setBuildingsError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadBuildings() {
      setIsBuildingsLoading(true)
      setBuildingsError(null)

      try {
        const data = await fetchBuildings()
        if (!isActive) {
          return
        }

        setBuildings(data)
      } catch {
        if (!isActive) {
          return
        }

        setBuildings([])
        setBuildingsError('Could not load buildings.')
      } finally {
        if (isActive) {
          setIsBuildingsLoading(false)
        }
      }
    }

    void loadBuildings()

    return () => {
      isActive = false
    }
  }, [])

  function updateDraft(patch: Partial<UploadDraft>) {
    setDraft((current) => ({
      ...current,
      ...patch
    }))
  }

  function handleImageChange(file: File | null) {
    updateDraft({ selectedImage: file })
  }

  function openBuildingPicker() {
    if (isBuildingsLoading || buildingsError) {
      return
    }

    setIsBuildingPickerOpen(true)
  }

  function closeBuildingPicker() {
    setIsBuildingPickerOpen(false)
  }

  function handleBuildingSelect(building: SelectedBuilding) {
    updateDraft({ selectedBuilding: building })
    setIsBuildingPickerOpen(false)
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

      <UploadForm
        draft={draft}
        onDraftChange={updateDraft}
        onBuildingFieldClick={openBuildingPicker}
      />

      <BuildingPicker
        isOpen={isBuildingPickerOpen}
        buildings={buildings}
        selectedBuilding={draft.selectedBuilding}
        onSelectBuilding={handleBuildingSelect}
        onClose={closeBuildingPicker}
      />

      {buildingsError ? (
        <p className="text-sm text-red-600">{buildingsError}</p>
      ) : null}
    </main>
  )
}
