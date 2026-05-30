# CampusFound — Implementation Plan (V1)

This document translates the product scope and roadmap into concrete, dependency-ordered development tasks. Tasks are grouped into sequential phases. Each task lists exact files to create or modify. This plan focuses on implementation details (files and order), not on product rationale.

Guidelines
- Follow phases in order; do not skip a phase's critical infra tasks.
- Keep changes minimal in each file; prefer small, testable commits per task.
- Do not introduce features outside `docs/V1_SCOPE_LOCK.md`.

---

PHASE 0 — Infra & Repo Setup (non-code plus small code fixtures)
Goal: Provision infra and make repository ready for development and deployment.

Tasks (order matters):
0.1. Provision services (manual / DevOps):
  - Supabase project + Storage bucket
  - PostHog project and API key
  - Vercel project + environment variables
  - Create an admin secret for `/admin`

0.2. Add environment config reference file (dev-only example):
  - Create: `.env.example` (list SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, POSTHOG_KEY, ADMIN_SECRET)

0.3. Run DB migration (local/staging):
  - Run: `db/migrations/001_create_buildings_and_listings.sql`
  - Create seed file to populate buildings:
    - Create: `db/seeds/001_seed_buildings.sql`

0.4. Verify placeholder app builds locally (no code changes required yet).

---

PHASE 1 — Supabase wiring & basic data APIs
Goal: Connect app to Supabase, implement storage upload and core API endpoints.

Tasks (order matters):
1.1. Implement Supabase client and config
  - Modify: `src/lib/supabaseClient.ts` (initialize and export Supabase client using env vars)
  - Create: `src/lib/config.ts` (export constants: LISTING_EXPIRY_DAYS, BUCKET_NAME)

1.2. Create server helpers for storage & DB operations
  - Create: `src/lib/storage.ts` (functions: uploadImage(file, path) → returns public URL)
  - Create: `src/lib/db.ts` (functions: createListing(data), getListingById(id), listListings(filters, pagination), markListingStatus(id, status))

1.3. Implement API routes for listings
  - Modify / Implement: `src/app/api/items/route.ts`
    - Support: POST (create listing with image_url and returns new id), GET (listings with optional query filters), GET /items/:id via dynamic route if necessary (or rely on frontend API path)

1.4. Add simple server-side photo hash generation (optional but recommended)
  - Modify: `src/lib/db.ts` (compute `photo_hash` server-side if image uploaded) — use a hash helper
  - Create: `src/lib/hash.ts` (export function hashBuffer(buffer) → hex)

1.5. Create minimal server error handling and validation utilities
  - Create / Modify: `src/lib/validators.ts` (validate required fields: image_url/building_id/location_type)

Deliverable: front-to-back API that can accept a listing create request, store image in Supabase Storage, insert listing row, and return listing id.

---

PHASE 2 — Upload Flow (UI + client integration)
Goal: Implement the mobile-first upload page, image selection, preview, client validation, and submission flow.

Tasks (order matters):
2.1. Implement upload page UI and client logic
  - Modify: `src/app/upload/page.tsx` (build the upload page per `docs/USER_FLOW.md`)
  - Modify/Create components used by upload page:
    - `src/components/ui/ImageUpload.tsx` (camera/file UI, preview, retake)
    - `src/components/forms/UploadForm.tsx` (form fields: building, location_type, location_details, description)
    - `src/components/ui/Container.tsx` (layout wrapper)

2.2. Implement building selector UI and seed usage
  - Create: `src/lib/buildings.ts` (client helper to fetch `buildings` list)
  - Modify: `src/components/ui/BuildingPicker.tsx` (full-screen picker with typeahead) — create if missing
  - Modify: `src/app/upload/page.tsx` to use BuildingPicker

2.3. Wire client-side submission to API and storage flow
  - Modify: `src/app/upload/page.tsx` and `src/components/forms/UploadForm.tsx` to call `POST /api/items` and handle responses
  - Use `src/lib/supabaseClient.ts` storage helper if direct browser upload is used (or let server accept file uploads via presigned flow implemented in `src/app/api/items/route.ts`)

2.4. Client validation and UX
  - Modify: `src/components/forms/UploadForm.tsx` to run immediate validation (image, building, location_type), show inline errors, and disable submit until valid
  - Implement local temporary draft save on submit failure (localStorage) in `src/app/upload/page.tsx` (Nice-to-have if time permits)

Deliverable: `/upload` accepts a photo, required metadata, posts to API, and shows success confirmation.

---

PHASE 3 — Browse & Item Details (UI + state preservation)
Goal: Implement listing discovery with building filter and detail view; preserve filter + scroll state.

Tasks (order matters):
3.1. Implement listing UI components
  - Modify/Create:
    - `src/components/ui/ItemCard.tsx` (thumbnail, building, short description, created_at)
    - `src/components/ui/Header.tsx` (global header with Browse/Upload CTAs)

3.2. Implement `/browse` page logic
  - Modify: `src/app/browse/page.tsx` to fetch listings via `GET /api/items` with filter query params
  - Ensure URL reflects filters: use `?building=...&location_type=...`
  - Implement pagination strategy: `load-more` button at bottom
  - Persist scroll position and applied filters in session storage or route state so Back restores

3.3. Implement `/items/[id]` detail page
  - Modify: `src/app/items/[id]/page.tsx` to fetch `getListingById(id)` and render full image and meta
  - Add share button behavior and removed-state messaging

3.4. Client-side helpers
  - Modify/Create: `src/lib/format.ts` (humanize dates like created_at/expires_at)

Deliverable: Users can browse, filter by building, open item details, and return to preserved browse state.

---

PHASE 4 — Admin UI & Moderation Endpoints
Goal: Implement protected admin UI and server endpoints to change listing `status`.

Tasks (order matters):
4.1. Implement server endpoint to update listing status
  - Modify: `src/app/api/items/route.ts` (add PATCH or a new `src/app/api/items/[id]/route.ts` supporting PATCH to change status)
  - Ensure server validates `ADMIN_SECRET` for admin actions (read from env)

4.2. Implement `/admin` UI
  - Create/Modify: `src/app/admin/page.tsx` (protected admin dashboard)
  - Create/Modify components:
    - `src/components/admin/AdminToolbar.tsx` (search + stats)
    - `src/components/admin/AdminListRow.tsx` (row with Remove/Restore action)

4.3. Implement client admin flows
  - Modify: `src/app/admin/page.tsx` to call PATCH endpoint to change `status` and refresh list
  - Protect page with simple server-side check: implement middleware or server-only protection reading `ADMIN_SECRET` (Vercel environment variable)

Deliverable: Admin can search by ID, view listing rows, and mark removed/active; changes reflect on public site.

---

PHASE 5 — Instrumentation, Error Handling & Polishing
Goal: Add PostHog instrumentation, robust error handling, mobile UX polish and accessibility improvements.

Tasks (order matters):
5.1. PostHog integration
  - Modify: `src/lib/analytics.ts` (wrap PostHog client and export event helper functions)
  - Instrument events in the following files:
    - `src/app/page.tsx` or `src/components/ui/Header.tsx` for `homepage_viewed`
    - `src/app/browse/page.tsx` for `browse_viewed` and `building_filter_used`
    - `src/app/upload/page.tsx` for `upload_started`, `upload_image_selected`, `upload_completed`, `upload_failed`
    - `src/app/items/[id]/page.tsx` for `listing_viewed`

5.2. Error handling and retry UX
  - Modify: `src/app/upload/page.tsx` and `src/app/api/items/route.ts` to present clear errors on upload failure and support retry
  - Add helper: `src/lib/retry.ts` (exponential backoff helper) — optional

5.3. Mobile polish and accessibility
  - Modify: `src/components/ui/ImageUpload.tsx`, `src/components/forms/UploadForm.tsx` to ensure large tappable controls, ARIA labels, and keyboard focus order
  - Modify: CSS/layout files (e.g., `src/app/globals.css`) to ensure responsive, mobile-first styles

Deliverable: PostHog events captured; uploads resilient to common errors; UX polish applied for mobile.

---

PHASE 6 — QA, Seeding, Staging & Launch Tasks
Goal: Final verification, seed data, deploy, and run pilot.

Tasks (order matters):
6.1. Add `buildings` seed file if not done
  - Ensure `db/seeds/001_seed_buildings.sql` exists and contains canonical building names for Luther College

6.2. Manual QA checklist and fixes
  - Run tests manually across devices; record issues and fix in appropriate files from phases above

6.3. Staging → Production deploy
  - Ensure env vars set on Vercel; run production migration against Supabase; verify storage rules

6.4. Pilot rollout and monitoring
  - Provide admin docs (small README): `docs/ADMIN_README.md` describing admin secret, moderation workflow, and manual expire script

Deliverable: Production site live and pilot users onboarded.

---

Exact file list summary (create / modify)
- Create: `.env.example`
- Create: `db/seeds/001_seed_buildings.sql`
- Modify: `db/migrations/001_create_buildings_and_listings.sql` (if seed/adjustments needed)
- Modify: `src/lib/supabaseClient.ts`
- Create: `src/lib/config.ts`
- Create: `src/lib/storage.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/hash.ts` (optional for photo_hash)
- Modify/Create: `src/lib/validators.ts`
- Create: `src/lib/analytics.ts`
- Create/Modify: `src/lib/buildings.ts`
- Create/Modify: `src/lib/format.ts`
- Modify: `src/app/api/items/route.ts`
- Optionally Create: `src/app/api/items/[id]/route.ts` (PATCH)
- Modify: `src/app/upload/page.tsx`
- Modify: `src/components/ui/ImageUpload.tsx`
- Modify: `src/components/forms/UploadForm.tsx`
- Create: `src/components/ui/BuildingPicker.tsx`
- Modify: `src/components/ui/ItemCard.tsx`
- Modify: `src/components/ui/Header.tsx`
- Modify: `src/app/browse/page.tsx`
- Modify: `src/app/items/[id]/page.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/AdminToolbar.tsx`
- Create: `src/components/admin/AdminListRow.tsx`
- Modify: `src/app/globals.css` (mobile-first layout tweaks)
- Create: `docs/ADMIN_README.md` (admin usage and manual expire script docs)

---

Recommended build order (atomic steps)
1. Phase 0 tasks (provision infra, create `.env.example`, run migration, add seed)
2. Implement `src/lib/supabaseClient.ts` and `src/lib/config.ts`
3. Implement storage & DB server helpers: `src/lib/storage.ts`, `src/lib/db.ts`, `src/lib/hash.ts`
4. Implement API route(s): `src/app/api/items/route.ts` (+ `src/app/api/items/[id]/route.ts` for PATCH)
5. Implement `/upload` page and components: `src/app/upload/page.tsx`, `src/components/ui/ImageUpload.tsx`, `src/components/forms/UploadForm.tsx`, `src/components/ui/BuildingPicker.tsx`
6. Implement image upload end-to-end and validate DB inserts
7. Implement `/browse` and `ItemCard`: `src/app/browse/page.tsx`, `src/components/ui/ItemCard.tsx`
8. Implement `/items/[id]` page: `src/app/items/[id]/page.tsx`
9. Implement `/admin` and admin endpoints: `src/app/admin/page.tsx`, admin components, and PATCH endpoint
10. Instrument PostHog: `src/lib/analytics.ts` and integrate in pages
11. UX polish, mobile fixes, accessibility updates (`src/app/globals.css`, component tweaks)
12. QA, seed verification, staging deploy, production deploy, pilot

---

Notes
- Keep each task limited to a single pull request and name PRs after the file(s) changed and the feature implemented.
- Prefer server-side upload (API accepts file) or client direct-to-storage using signed uploads — choose one approach consistently in `src/lib/storage.ts` and document it in `docs/ADMIN_README.md`.
- If time is constrained, prioritize building the upload flow and basic browse/detail pages before admin or analytics.

This file should be saved as `docs/IMPLEMENTATION_PLAN.md` and used directly by developers for implementation. Ensure the repo's `docs/` folder contains `PROJECT_CONTEXT.md`, `USER_FLOW.md`, `V1_SCOPE_LOCK.md`, `PROJECT_ROADMAP.md`, and this implementation plan.
