import { expect, test, type Page } from '@playwright/test'

function tinyPngBuffer(): Buffer {
  // 1x1 transparent PNG
  const base64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO6q3mQAAAAASUVORK5CYII='
  return Buffer.from(base64, 'base64')
}

async function uploadListing(page: Page) {
  await page.goto('/upload')

  // ImageUpload input (best-effort: pick first file input)
  const fileInput = page.locator('input[type="file"]').first()
  await fileInput.setInputFiles({
    name: 'test.png',
    mimeType: 'image/png',
    buffer: tinyPngBuffer()
  })

  // Pick building via the building picker button
  await page.getByRole('button', { name: /choose a building|select/i }).click()
  // Building picker should show a list; pick first option button if present.
  // (BuildingPicker implementation may render buttons/links; use a broad strategy.)
  const firstBuilding = page
    .locator('button', { hasText: /.+/ })
    .filter({ hasNotText: /cancel|close/i })
    .nth(0)
  await firstBuilding.click()

  // Location type select
  await page.getByRole('combobox', { name: /location type/i }).selectOption('lost_and_found')

  // Optional details
  await page.getByRole('textbox', { name: /location details/i }).fill('Near the front desk.')
  await page.getByRole('textbox', { name: /item details/i }).fill('Test item for E2E.')

  await page.getByRole('button', { name: /submit listing/i }).click()

  await expect(page).toHaveURL(/\/items\/[0-9a-f-]{36}$/i)
  return page.url().split('/items/')[1]
}

test('upload -> item detail -> report once', async ({ page }) => {
  const listingId = await uploadListing(page)

  await expect(page.getByRole('heading', { name: /listing/i })).toBeVisible()

  // Report listing
  await page.getByRole('button', { name: /report listing/i }).click()
  await page.getByRole('combobox', { name: /reason/i }).selectOption('spam')
  await page.getByRole('button', { name: /submit report/i }).click()

  // After submit, the form collapses and the component shows "Report submitted"
  await expect(page.getByText(/report submitted|thank you/i)).toBeVisible()

  // Reload should still show already reported state
  await page.reload()
  await expect(page.getByText(/report submitted|already reported/i)).toBeVisible()

  // Sanity: listing id returned
  expect(listingId).toMatch(/[0-9a-f-]{36}/i)
})

test('admin can resolve report and see moderation activity', async ({ page }) => {
  const listingId = await uploadListing(page)

  // Submit a report
  await page.getByRole('button', { name: /report listing/i }).click()
  await page.getByRole('combobox', { name: /reason/i }).selectOption('spam')
  await page.getByRole('button', { name: /submit report/i }).click()
  await expect(page.getByText(/report submitted|thank you/i)).toBeVisible()

  // Admin login
  const adminSecret = process.env.ADMIN_SECRET
  test.skip(!adminSecret, 'ADMIN_SECRET not set for e2e run')

  await page.goto('/admin/login')
  await page.getByLabel(/admin secret/i).fill(adminSecret!)
  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(page).toHaveURL(/\/admin$/)

  // Reports panel should include the report; resolve it.
  await expect(page.getByRole('heading', { name: /reports/i })).toBeVisible()
  await page.getByRole('button', { name: /resolve/i }).first().click()

  // Moderation activity should include "Report resolved"
  await expect(page.getByRole('heading', { name: /moderation activity/i })).toBeVisible()
  await expect(page.getByText(/report resolved/i)).toBeVisible()

  // Verify we can still view the listing
  await page.goto(`/items/${listingId}`)
  await expect(page).toHaveURL(new RegExp(`/items/${listingId}$`))
})

