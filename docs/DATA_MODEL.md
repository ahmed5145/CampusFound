# CampusFound — Data Model

This document is the canonical data reference for CampusFound V1. It is based on the current database migration, TypeScript types, user flow, and V1 scope lock. It describes the two core entities, their fields, required vs optional values, allowed value sets, storage conventions, and intentionally deferred fields.

## 1) Entities

### Building
Represents a campus location that can be selected when uploading or filtering listings.

Purpose:
- Provide the canonical filter set for browse and upload flows.
- Keep the user-facing building list small, stable, and campus-specific.

### Listing
Represents a found-item post.

Purpose:
- Store the item image and the minimal metadata needed for discovery and retrieval.
- Support public browsing, item details, moderation, and automatic expiration.

## 2) Building Entity

Table: `buildings`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | UUID | Yes | Primary key. Generated with `gen_random_uuid()`. |
| `name` | TEXT | Yes | Human-readable building name used in filters and upload forms. Must be unique. |
| `created_at` | TIMESTAMPTZ | Yes | Row creation timestamp. Defaults to `now()`. |

### Building rules
- Building names are intended to match the campus filter vocabulary shown to users.
- Building names must be unique; the schema enforces this with a unique constraint.
- The seed file is idempotent and should only contain the approved campus locations used in the MVP.
- The app should treat building names as the display value and filtering value for V1.

## 3) Listing Entity

Table: `listings`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | UUID | Yes | Primary key. Generated with `gen_random_uuid()`. |
| `image_url` | TEXT | Yes | Public or retrievable storage URL for the uploaded image. |
| `photo_hash` | TEXT | No | Optional hash used for future duplicate detection. |
| `building_id` | UUID | Yes | Foreign key to `buildings.id`. |
| `location_type` | TEXT | Yes | Must match one of the allowed location type values. |
| `other_location_type` | TEXT | No | Custom label shown when `location_type = other`. |
| `location_details` | TEXT | No | Optional free-text detail about where the item was found. |
| `description` | TEXT | No | Optional descriptive text from the uploader. |
| `status` | TEXT | Yes | Moderation state. Defaults to `active`. |
| `created_at` | TIMESTAMPTZ | Yes | Row creation timestamp. Defaults to `now()`. |
| `expires_at` | TIMESTAMPTZ | Yes | Expiration timestamp. Defaults to `now() + 60 days`. |

## 4) Required vs Optional Fields

### Building
Required:
- `id`
- `name`
- `created_at`

Optional:
- None

### Listing
Required:
- `id`
- `image_url`
- `building_id`
- `location_type`
- `status`
- `created_at`
- `expires_at`

Optional:
- `photo_hash`
- `other_location_type`
- `location_details`
- `description`

## 5) Allowed Values

### `status`
Allowed values:
- `active`
- `removed`

Meaning:
- `active`: visible in public browse and details flows.
- `removed`: hidden from normal public browsing and shown as no longer available on the details page.

### `location_type`
Allowed values:
- `lost_and_found`
- `campus_safety`
- `other`

Meaning:
- `lost_and_found`: item was turned in at a campus lost-and-found location.
- `campus_safety`: item was turned in to campus safety.
- `other`: item was found somewhere else and the uploader will provide a detail if needed.

### `other_location_type`
Meaning:
- When `location_type = other`, this field stores the user's custom specification.
- Browse and detail views render it as `Other - <value>` when present.

## 6) Expiration Rules

- Every listing gets an `expires_at` timestamp when it is created.
- Default rule: `expires_at = created_at + 60 days`.
- The expiration duration is stored as a constant in application code and should remain 60 days for V1.
- Listings should remain in the database after expiration so the app can decide whether to display them as expired, removed, or hidden.
- Expiry handling should be implemented as a later operational behavior, not as a hard delete in the schema.

## 7) Soft-Delete Behavior

- Listings are soft-deleted with `status = removed`.
- Soft-deleted listings must not be physically deleted in normal moderation flows.
- Public browse views should exclude removed listings.
- Item detail pages should show a removed-state message instead of presenting the item as active.
- Soft-delete preserves auditability and prevents accidental data loss.

## 8) Image Storage Conventions

- `image_url` stores the image location used by the frontend.
- The current architecture expects Supabase Storage to host uploaded listing images.
- The storage bucket name is treated as an app configuration value, not a database field.
- Uploaded images should be stored as durable references, not embedded binary data in the database.
- The image URL should be sufficient for browse cards and item detail pages.
- `photo_hash` is intentionally separate from `image_url` so duplicate detection can be added later without changing the storage model.

## 9) Future Fields Intentionally Deferred

The following fields are intentionally excluded from V1 to keep the model minimal:

- `title`
  - Deferred because the upload flow does not require a title and it would add friction.
- `category` or `tags`
  - Deferred because filtering by building is the primary discovery mechanism for V1.
- `claimed_by`
  - Deferred because the app does not handle claims.
- `claimed_at`
  - Deferred because there is no claims workflow.
- `owner_id` or user account linkage
  - Deferred because the app does not require accounts.
- `message_thread_id`
  - Deferred because messaging is out of scope.
- `notification_state`
  - Deferred because notifications are out of scope.
- `moderation_reason`
  - Deferred because the V1 admin flow only needs remove/restore, not full moderation history.
- `full_text_search_vector`
  - Deferred because the MVP does not require search infrastructure.
- `deleted_at`
  - Deferred because soft delete is represented by `status = removed`.
- `archived_at`
  - Deferred because expiry behavior is not a separate archival state in V1.
- `building_slug`
  - Deferred because the selected building name is sufficient for the MVP filter flow.
- `storage_path`
  - Deferred because `image_url` is sufficient for V1 and storage details can stay in application code.

## 10) Canonical References

This document should be kept in sync with:
- `db/migrations/001_create_buildings_and_listings.sql`
- `db/migrations/002_add_other_location_type_to_listings.sql`
- `src/types/db-schema.ts`
- `docs/USER_FLOW.md`
- `docs/V1_SCOPE_LOCK.md`

If any of those files change the data model, update this document in the same change set.
