export interface SelectedBuilding {
  id: string
  name: string
}

type BuildingsResponse = {
  data: SelectedBuilding[]
}

export async function fetchBuildings(): Promise<SelectedBuilding[]> {
  const response = await fetch('/api/buildings')

  if (!response.ok) {
    throw new Error('Failed to load buildings.')
  }

  const payload = (await response.json()) as BuildingsResponse
  return payload.data
}