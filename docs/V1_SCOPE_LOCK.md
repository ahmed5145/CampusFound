# CampusFound — V1 Scope Lock

This document captures the finalized V1 scope for CampusFound targeted at a Luther College launch (2-week timeline). It is intentionally minimal: only the features required to launch the core product are "Must Have." Everything else is "Nice to Have" or deferred to a future version.

## Must Have (launch blockers)
- Homepage with clear CTAs: Browse + Upload
- Browse (`/browse`) with building filter (`?building=...`) and list of `ItemCard`s (thumbnail, building, brief description, created_at)
- Upload (`/upload`) with camera/file picker, required fields: image, building_id, location_type; conditional `other_location_type` for Other; optional: location_details, description; client validation
- Item Details (`/items/[id]`) with large image, building, location_type, other_location_type, location_details, description, created_at, expires_at; removed-state messaging
- Admin ability to mark listings `removed` / `active` (protected `/admin` area)
- Supabase Storage for images and Supabase DB for `buildings` and `listings`
- PostHog instrumentation for core events (see Analytics section)
- Mobile-first upload UX (camera-first, minimal taps)
- Soft-deletes via `status='removed'` (no hard deletes)
- Preserve browse filters & scroll when navigating back from item details
- Basic accessibility (labels, contrast, tappable areas)

## Nice to Have (implement if quick; NOT blockers)
- Upload progress indicator
- Optimistic UI for listing creation
- Recent listings preview on Homepage
- Infinite scroll / load-more (pagination is acceptable for MVP)
- Photo-hash search in admin
- Local autosave draft for upload
- Image compression client-side
- Bulk admin actions, CSV export

## Future Version (explicitly deferred)
- Building-specific route pages like `/buildings/[building]`
- Full-text search (GIN/TSVECTOR)
- DB-level ENUMs requiring migrations for every change (prefer TEXT + optional CHECK later)
- Messaging, claims workflows, accounts, notifications
- Complex RLS policies and role-based admin users
- Advanced duplicate-detection automation that blocks uploads
- Full audit logs and moderation reasons UI
- Custom analytics DB (use PostHog instead)

## Admin Features (summary)
- Must: protected admin access, view listing details, mark removed/restore, basic counts (active/removed/expiring soon), search by ID
- Nice: bulk remove/restore, filters, export, manual expire action

## Analytics Events (to send to PostHog)
- Must:
  - `homepage_viewed`
  - `browse_viewed` (include filter/query props)
  - `building_filter_used` (property: building)
  - `upload_started`
  - `upload_image_selected`
  - `upload_completed` (properties: building, location_type)
  - `listing_viewed` (properties: id, status)
- Nice:
  - `upload_failed`
  - `duplicate_suspected`
  - `listing_shared`
  - `admin_action_removed` / `admin_action_restored`

## Launch Checklist (condensed)
- Infrastructure: Supabase DB + Storage, PostHog, Vercel, env vars
- Run DB migrations in order:
  - `db/migrations/001_create_buildings_and_listings.sql`
  - `db/migrations/002_add_other_location_type_to_listings.sql`
- Seed `buildings` for Luther College
- Implement Must-Have features (Homepage, Browse, Upload, Item Details, Admin remove/restore)
- Image upload pipeline + `photo_hash` optional support
- Custom Other label support via `other_location_type`
- PostHog instrumentation for Must events
- Basic QA across iOS/Android/desktop
- Admin moderation process and simple documentation
- Launch to small campus pilot, monitor for 72 hours


---

Keep `docs/PROJECT_CONTEXT.md`, `docs/USER_FLOW.md`, and this `docs/V1_SCOPE_LOCK.md` together as the canonical planning trio for development and future Copilot references.
