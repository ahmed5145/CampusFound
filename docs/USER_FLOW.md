# CampusFound — Approved User Flow (V1)

This document captures the approved user flow for CampusFound's V1. It focuses on minimal friction for browsing and uploading found items and maps directly to the routes that will be shipped.

---

## Homepage
- URL: `/`
- Purpose: discovery entry; surface primary actions (Browse, Upload) and let users jump straight into the mobile-first upload flow.
- Components: Header (Browse / Upload), Hero with primary CTA, compact building filter, recent listings preview (optional), footer with brief policy/moderation contact.
- User actions: Tap Upload → `/upload`; Tap Browse or listing preview → `/browse` or `/items/[id]`; use building filter → `/browse?building=NAME`.
- Navigation paths: `/` → `/upload`, `/` → `/browse?building=...`, `/` → `/items/[id]`.
- Success states: CTA navigates as expected; previews load (skeleton while loading).
- Error states: Inline error if listings fail to load with a Retry button.
- Mobile UX: Primary Upload CTA thumb-reachable; single-column layout; building selector opens full-screen picker.

---

## Browse Listings
- URL: `/browse` (query params supported: `?building=...`, `?location_type=...`, `?q=...`)
- Purpose: discovery of current found items; filter by building and location type; navigate to item details.
- Components: Header, optional search bar, filter bar (building + location-type pills), sort (newest default), listing grid/list of `ItemCard`, empty-state with Upload CTA.
- User actions: Apply filters (updates URL), tap `ItemCard` → `/items/[id]`, tap Upload → `/upload`.
- Navigation paths: `/browse` → `/items/[id]` → back returns to `/browse` preserving filters and scroll position.
- Success states: Filtered results load quickly; back-button returns to same state.
- Error states: Network failure shows retry; no-results state prompts Upload CTA.
- Mobile UX: Filters collapse into bottom sheet; image-first `ItemCard`; pull-to-refresh; lazy-load thumbnails.

---

## Upload Item
- URL: `/upload`
- Purpose: create a new found-item listing with minimal friction (image + required fields only).
- Components: Header (back + help), camera/file image picker with preview, building selector (required), location type selector (required, options: Lost & Found / Campus Safety / Other), location details (optional; required only for some "Other" workflows), description (optional), submit button, small expiry/moderation copy.
- User actions: Take/select image → choose building → select location type → optionally fill details → Submit.
- Navigation paths: `/upload` → on success redirect to `/browse` (with a success toast and optionally focused filters) or `/items/[id]` (team choice; default: `/browse`).
- Success states: Confirmation message: "Your listing is live" with CTA to view listings or report another item.
- Error states: Image upload failure (retry and guidance), validation errors (inline messages), network/server error (Retry and option to save draft in localStorage).
- Mobile UX: Camera-first experience; quick retake; large bottom submit; compress image client-side where possible.

---

## Item Details
- URL: `/items/[id]`
- Purpose: show full details for a listing so claimants can identify items and locate retrieval points.
- Components: Header (back), large image (tap to fullscreen), meta (building, location_type, location_details), description, created_at and expires_at, removed-state messaging, moderator-only controls (hidden for public).
- User actions: Inspect image, share link, tap building → filter browse by building.
- Navigation paths: `/browse` → `/items/[id]` → back to `/browse` preserving state.
- Success states: Clear item details displayed; share works; back returns to browse.
- Error states: Item removed or not found → friendly message with CTA to browse or upload.
- Mobile UX: Fullscreen image gestures, vertical stacking of meta, easy tap targets for share and building filter.

---

## Admin Dashboard
- URL: `/admin` (protected; simple secret/auth for V1)
- Purpose: internal moderation (remove/restore listings) and light management.
- Components: Admin header, quick stats (active/removed/expiring soon), search by ID, listings table (thumbnail, id, building, location_type, created_at, expires_at, status), row actions: Remove/Restore, view public item.
- User actions: Search listing by id, mark removed/restore, view listing on public site, run manual expire (optional).
- Navigation paths: `/admin` → `/items/[id]` → back to `/admin`.
- Success states: Status changes reflected immediately; toasts confirm actions.
- Error states: Permission denied; network errors during actions prompt retry.
- Mobile UX: Desktop-first admin; mobile supports read-only checks and single-item actions with large buttons.

---

## Cross-route Rules
- No user accounts for public flows. Admin area is protected separately.
- Required upload fields: `image`, `building`, `location_type`.
- Listings expire after 60 days (displayed to users).
- Soft-delete moderation: `status = removed` (public shows removed message, not full delete).
- Preserve browse filters and scroll position across navigation.
- Instrument core events with PostHog: homepage_viewed, browse_viewed, building_filter_used, upload_started, upload_image_selected, upload_completed, listing_viewed.
- Keep the UI minimal and mobile-first; store drafts locally on network failure where feasible.

---

This file is the canonical `docs/USER_FLOW.md` for V1 and should be kept alongside `docs/PROJECT_CONTEXT.md` and `docs/V1_SCOPE_LOCK.md`.
