// Marker description used by Playwright E2E uploads. Public APIs hide these listings.
export const E2E_TEST_LISTING_DESCRIPTION = 'Test item for E2E.'

export function isE2eTestListing(description: string | null | undefined): boolean {
  return description?.trim() === E2E_TEST_LISTING_DESCRIPTION
}
