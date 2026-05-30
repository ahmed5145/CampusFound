# CampusFound — Phase 2 Implementation Contract

This document freezes the approved Phase 2 backend scope after the YAGNI review. If a decision appears here, it is the required backend behavior for Phase 2.

---

## 1) Phase 2 Scope

### In scope
- Public building list endpoint.
- Public browse endpoint with offset pagination.
- Public item detail endpoint.
- Public create-listing endpoint with server-side image upload.
- Shared validation, storage, and database helpers.

### Out of scope
- Text search.
- Later moderation surfaces.
- Any hash-computation helper.

### Schema note
- `photo_hash` stays in the database schema.
- Phase 2 must not compute it, read it, filter by it, or expose it in API responses.
- It is dormant and reserved for a later phase.

### Storage policy
- Supabase Storage uses a public bucket in Phase 2.
- `image_url` stores the public URL.
- Signed URLs are out of scope for Phase 2.

### Canonical `location_type`
- `lost_and_found`
- `campus_safety`
- `other`
- Human-readable labels are presentation-only and must not be used as stored values.

---

## 2) Canonical API Contract

### `GET /api/buildings`
Purpose:
- Return the canonical building list for selectors and filters.

Request:
- No body.
- No query params.

Response:
- `200 OK`
- Shape: `{ data: Building[] }`

### `GET /api/items`
Purpose:
- Return a paginated list of public listings.

Request query params:
- `building_id` optional UUID string.
- `location_type` optional string.
- `limit` optional number, default `20`, max `50`.
- `offset` optional number, default `0`, min `0`.

Response:
- `200 OK`
- Shape:
  - `data`: `ListingSummary[]`
  - `pageInfo`: `{ limit, offset, hasMore, total?: number }`

Rules:
- Listings are sorted newest-first.
- Public browse returns active listings only.
- Filtering uses `building_id` as the canonical backend parameter.

### `POST /api/items`
Purpose:
- Create a listing and upload its image.

Request body:
- `multipart/form-data`
- Required fields:
  - `image`
  - `building_id`
  - `location_type`
- Optional fields:
  - `location_details`
  - `description`

Accepted MIME types:
- `image/jpeg`
- `image/png`
- `image/webp`

Maximum file size:
- `10 MB`

Validation must explicitly enforce those limits.

Response:
- `201 Created`
- Shape: `{ data: ListingDetail, message: string }`

Rules:
- `photo_hash` is not computed in Phase 2.
- Validation must reject missing required fields before upload or insert.

### `GET /api/items/[id]`
Purpose:
- Return one listing for the item detail page.

Request:
- `id` route param required.

Response:
- `200 OK` with `{ data: ListingDetail }`
- `404 Not Found` if missing.

Rules:
- The response may include removed listings so the UI can render state correctly.
- The response must not include `photo_hash`.

---

## 3) Payload Shapes

### `Building`
- `id`: UUID string.
- `name`: unique building name string.
- `created_at`: ISO timestamp string.

### `ListingSummary`
- `id`: UUID string.
- `image_url`: string.
- `building`: `{ id, name }`.
- `location_type`: `lost_and_found` | `campus_safety` | `other`.
- `location_details`: string or null.
- `description`: string or null.
- `status`: `active` | `removed`.
- `created_at`: ISO timestamp string.
- `expires_at`: ISO timestamp string.

### `ListingDetail`
- Same as `ListingSummary`.
- Must not expose `photo_hash` in Phase 2.

### `CreateListingInput`
- `image`: file.
- `building_id`: UUID string.
- `location_type`: allowed location type string.
- `location_details`: string or null.
- `description`: string or null.

### `ListingQuery`
- `building_id`: UUID string or null.
- `location_type`: allowed location type string or null.
- `limit`: number.
- `offset`: number.

---

## 4) Backend Helpers

### `src/lib/validators.ts`
Purpose:
- Normalize and validate request input for the public Phase 2 routes.

Server-only:
- Yes.

Exports:
- `validateListingCreateFormData`
- `validateListingQuery`
- `validateListingIdParam`

Responsibilities:
- Enforce required upload fields.
- Enforce allowed `location_type` values.
- Enforce numeric `limit` and `offset` bounds.
- Enforce UUID shape for `building_id` and item ids.
- Enforce image size and MIME type limits for uploads.

Notes:
- No moderation-only validation helpers belong in Phase 2.
- No hash-computation helpers belong in Phase 2.

### `src/lib/storage.ts`
Purpose:
- Upload and delete listing images in Supabase Storage.

Server-only:
- Yes.

Exports:
- `buildListingImagePath`
- `uploadListingImage`
- `deleteListingImage`

Responsibilities:
- Produce stable storage paths for new listings.
- Return the public image URL used by the database row.
- Keep bucket/path details out of route handlers.

Notes:
- Storage helpers do not compute hashes.
- Storage helpers do not inspect moderation state.

### `src/lib/db.ts`
Purpose:
- Encapsulate all database reads and writes for Phase 2.

Server-only:
- Yes.

Exports:
- `getBuildings`
- `createListing`
- `getListings`
- `getListingById`

Responsibilities:
- Join listings to buildings for response shaping.
- Filter browse results by `building_id` and `location_type`.
- Apply newest-first ordering.
- Apply offset pagination.
- Omit `photo_hash` from returned payloads.

Notes:
- No moderation write helpers belong here.
- No stats helper belongs here.
- No hash-related helper belongs here.

---

## 5) Route Boundaries

### `src/app/api/buildings/route.ts`
- Exports `GET` only.
- Returns the canonical building list.

### `src/app/api/items/route.ts`
- Exports `GET` and `POST`.
- `GET` serves browse data with `building_id`, `location_type`, `limit`, and `offset`.
- `POST` creates a listing from multipart form data.

### `src/app/api/items/[id]/route.ts`
- Exports `GET` only.
- Returns a single listing by id.

---

## 6) Validation Rules

- `building_id` is the canonical backend filter parameter.
- `limit` defaults to `20` and must be capped at `50`.
- `offset` defaults to `0` and must never be negative.
- `location_type` must match the allowed schema values.
- The canonical `LocationType` values are `lost_and_found`, `campus_safety`, and `other`.
- `photo_hash` must not appear in request validation, storage flow, or API responses.
- Moderation-only validation is deferred to a later phase.

---

## 7) Phase 2 Deliverables Checklist

- `src/lib/validators.ts`
- `src/lib/storage.ts`
- `src/lib/db.ts`
- `src/app/api/buildings/route.ts`
- `src/app/api/items/route.ts`
- `src/app/api/items/[id]/route.ts`

All Phase 2 backend decisions are now frozen by this contract.

---

READY FOR IMPLEMENTATION
