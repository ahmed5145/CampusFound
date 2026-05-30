# CampusFound — Building Picker Contract

This document freezes the building-selection contract for the upload flow before implementation.

## Scope

This contract covers only building selection in `/upload`.

It does not cover image upload, validation, submission, browsing, or moderation.

## Ownership Model

### `src/app/upload/page.tsx` owns

- selected building
- picker open/closed state
- building list data
- loading state for building fetches
- error state for building fetches

### `src/components/ui/BuildingPicker.tsx` owns

- search query
- filtered rendering
- selection UI

## Types

### Selected building

```ts
export interface SelectedBuilding {
  id: string
  name: string
}
```

### Upload draft

```ts
export interface UploadDraft {
  selectedImage: File | null
  selectedBuilding: SelectedBuilding | null
  locationType: LocationType | ''
  locationDetails: string
  description: string
}
```

## Props

### UploadForm

```ts
export interface UploadFormProps {
  draft: UploadDraft
  onDraftChange: (patch: Partial<UploadDraft>) => void
  onBuildingFieldClick: () => void
}
```

### BuildingPicker

```ts
export interface BuildingPickerProps {
  isOpen: boolean
  buildings: SelectedBuilding[]
  selectedBuilding: SelectedBuilding | null
  isLoading: boolean
  error: string | null
  onSelectBuilding: (building: SelectedBuilding) => void
  onClose: () => void
  onRetryFetch: () => void
}
```

## User Interaction Flow

1. User taps the building field in `UploadForm`.
2. `page.tsx` opens the full-screen `BuildingPicker`.
3. `page.tsx` supplies the building list and fetch state.
4. User types in the picker search field.
5. `BuildingPicker` filters the visible list.
6. User selects a building.
7. `page.tsx` stores the selected building.
8. `page.tsx` closes the picker.
9. The selected building appears in the upload form.

## Minimal Files For First Pass

- `src/app/upload/page.tsx`
- `src/components/forms/UploadForm.tsx`
- `src/components/ui/BuildingPicker.tsx`
- `src/lib/buildings.ts`

## Notes

- The canonical display value is the building name.
- The selected building should remain a concrete object with both `id` and `name` so the upload flow can later map cleanly to `building_id`.
- The picker should stay reusable, but it should not own the fetched building list in this contract.