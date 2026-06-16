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
  await page.locator('button[aria-haspopup="dialog"]').click()

  // BuildingPicker: click the first building button in the picker list.
  await page.getByRole('heading', { name: /select a building/i }).waitFor()
  const pickerRoot = page.locator('div.fixed.inset-0.z-50.bg-white')
  const buildingButtons = pickerRoot.locator('div.space-y-2 > button')
  await buildingButtons.first().click()

  // Picker should close after selection
  await expect(pickerRoot).toHaveCount(0)

  // Location type select
  await page.getByRole('combobox', { name: /location type/i }).selectOption('lost_and_found')

  // Optional details
  await page.getByRole('textbox', { name: /location details/i }).fill('Near the front desk.')
  await page.getByRole('textbox', { name: /item details/i }).fill('Test item for E2E.')

  await page.getByRole('button', { name: /submit listing/i }).click()

  await expect(page).toHaveURL(/\/items\/[0-9a-f-]{36}$/i)
  return page.url().split('/items/')[1]
}

function moderationSection(page: Page) {
  return page.locator('section').filter({
    has: page.getByRole('heading', { name: /moderation activity/i })
  })
}

function moderationEventForListing(page: Page, listingId: string, actionPattern: RegExp) {
  return moderationSection(page)
    .locator('article')
    .filter({ has: page.locator(`a[href="/items/${listingId}"]`) })
    .filter({ hasText: actionPattern })
    .first()
}

async function waitForModerationActivityRefresh(page: Page) {
  await page.waitForResponse(
    (response) => response.url().includes('/api/admin/moderation-events') && response.ok()
  )
}

function reportCardForListing(page: Page, listingId: string) {
  return page
    .locator('section')
    .filter({ has: page.getByRole('heading', { name: /^Reports$/i }) })
    .locator('article')
    .filter({ has: page.locator(`a[href="/items/${listingId}"]`) })
}

function listingQueueCard(page: Page, listingId: string) {
  return page.locator('article').filter({ has: page.locator(`img[alt="Listing ${listingId}"]`) })
}

async function adminLogin(page: Page) {
  const adminSecret = process.env.ADMIN_SECRET
  test.skip(!adminSecret, 'ADMIN_SECRET not set for e2e run')

  await page.goto('/admin/login')
  await page.getByRole('button', { name: /shared secret/i }).click()
  await page.getByLabel(/admin secret/i).fill(adminSecret!)
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/admin$/)
  await expect(page.getByRole('heading', { name: /^Reports$/i })).toBeVisible()
  await page.waitForResponse(
    (response) => response.url().includes('/api/admin/moderation-events') && response.ok()
  )
}

test('upload -> item detail -> report once', async ({ page }) => {
  const listingId = await uploadListing(page)

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  // Report listing
  await page.getByRole('button', { name: /report listing/i }).click()
  await page.getByRole('combobox', { name: /reason/i }).selectOption('spam')
  await page.getByRole('button', { name: /submit report/i }).click()

  // After submit, the form collapses and the component shows "Report submitted"
  await expect(page.getByText('Report submitted', { exact: true })).toBeVisible()

  // Reload should still show already reported state
  await page.reload()
  await expect(page.getByText('Report submitted', { exact: true })).toBeVisible()

  // Sanity: listing id returned
  expect(listingId).toMatch(/[0-9a-f-]{36}/i)
})

test('admin can resolve report and see moderation activity', async ({ page }) => {
  const listingId = await uploadListing(page)

  // Submit a report
  await page.getByRole('button', { name: /report listing/i }).click()
  await page.getByRole('combobox', { name: /reason/i }).selectOption('spam')
  await page.getByRole('button', { name: /submit report/i }).click()
  await expect(page.getByText('Report submitted', { exact: true })).toBeVisible()

  await adminLogin(page)

  const reportCard = reportCardForListing(page, listingId)
  await expect(reportCard).toBeVisible()

  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes('/api/admin/reports/') &&
        response.request().method() === 'PATCH' &&
        response.ok()
    ),
    reportCard.getByRole('button', { name: /^resolve$/i }).click()
  ])

  await waitForModerationActivityRefresh(page)
  await expect(page.getByRole('heading', { name: /moderation activity/i })).toBeVisible()
  await expect(moderationEventForListing(page, listingId, /report resolved/i)).toBeVisible()

  await page.goto(`/items/${listingId}`)
  await expect(page).toHaveURL(new RegExp(`/items/${listingId}$`))
})

test('admin can remove and restore listing with moderation activity', async ({ page }) => {
  const listingId = await uploadListing(page)

  await adminLogin(page)

  const listingCard = listingQueueCard(page, listingId)
  await expect(listingCard).toBeVisible()

  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes(`/api/admin/listings/${listingId}`) &&
        response.request().method() === 'PATCH' &&
        response.ok()
    ),
    listingCard.getByRole('button', { name: /^remove$/i }).click()
  ])

  await waitForModerationActivityRefresh(page)
  await expect(moderationEventForListing(page, listingId, /listing removed/i)).toBeVisible()

  await page.goto(`/items/${listingId}`)
  await expect(page.getByText(/listing not found/i)).toBeVisible()

  await page.goto('/admin')
  const removedListingCard = listingQueueCard(page, listingId)
  await expect(removedListingCard).toBeVisible()

  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes(`/api/admin/listings/${listingId}`) &&
        response.request().method() === 'PATCH' &&
        response.ok()
    ),
    removedListingCard.getByRole('button', { name: /^restore$/i }).click()
  ])

  await waitForModerationActivityRefresh(page)
  await expect(moderationEventForListing(page, listingId, /listing restored/i)).toBeVisible()

  await page.goto(`/items/${listingId}`)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('browse filters update URL and show matching listings', async ({ page }) => {
  const listingId = await uploadListing(page)

  await page.goto('/browse')
  await expect(page.getByRole('heading', { name: /recent listings/i })).toBeVisible()

  const buildingSelect = page.getByRole('combobox').nth(0)
  await expect(buildingSelect).toBeEnabled()

  const firstBuildingOption = buildingSelect.locator('option').nth(1)
  const buildingId = await firstBuildingOption.getAttribute('value')
  const buildingName = (await firstBuildingOption.textContent())?.trim()
  expect(buildingId).toBeTruthy()

  await buildingSelect.selectOption(buildingId!)
  await expect(page).toHaveURL(new RegExp(`building_id=${buildingId}`))

  await expect(page.getByRole('link').filter({ hasText: buildingName! }).first()).toBeVisible()

  const locationTypeSelect = page.getByRole('combobox').nth(1)
  await locationTypeSelect.selectOption('lost_and_found')
  await expect(page).toHaveURL(/location_type=lost_and_found/)

  await expect(page.locator(`a[href="/items/${listingId}"]`)).toBeVisible()
})

