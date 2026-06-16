# CampusFound — Ops Runbook (Pilot → Launch)

This runbook is written for a campus pilot and early production. It focuses on deployment, data safety, and moderation operations.

## Environments
- **Staging**: mirrors production settings; used for testing changes before launch.
- **Production**: live campus instance.

## Required environment variables
Public:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_POSTHOG_KEY` (optional)

Server-only:
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `ADMIN_SECRET`
- `CRON_SECRET` (for scheduled listing expiry)
- `NEXT_PUBLIC_CAMPUS_SLUG` (optional campus scoping)
- `NEXT_PUBLIC_CAMPUS_NAME` (header branding)

## Database setup
Run migrations in order:
- `db/migrations/001_create_buildings_and_listings.sql`
- `db/migrations/002_add_other_location_type_to_listings.sql`
- `db/migrations/003_add_image_path_to_listings.sql`
- `db/migrations/004_create_reports.sql`
- `db/migrations/005_add_reporter_ip_hash_to_reports.sql`
- `db/migrations/006_create_moderation_events.sql`
- `db/migrations/007_create_campuses.sql`
- `db/migrations/008_create_admin_users.sql`
- `db/migrations/009_add_listing_search_indexes.sql`

Seed buildings:
- `db/seeds/001_seed_buildings.sql`

## Storage setup
Create a bucket matching `SUPABASE_STORAGE_BUCKET`.

Operational notes:
- Images can contain sensitive content. Prefer restrictive access patterns and a clear takedown workflow.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.

## Deploy (Vercel)
1. Set environment variables for **Staging** and **Production**.
2. Deploy staging.
3. Verify the smoke checks below.
4. Promote to production.

## Smoke checks (do after every deploy)
Public:
- Homepage loads.
- Browse loads, filters work.
- Upload creates a listing successfully.
- Item detail page loads for the new listing.

Admin:
- Admin login works (staff email or shared secret).
- Admin can remove and restore a listing.
- Admin stats load on `/admin`.
- Cron expiry endpoint returns `{ expired_count }` when authorized.

## Scheduled expiry

- Route: `GET /api/cron/expire-listings`
- Auth: `Authorization: Bearer $CRON_SECRET`
- Vercel schedule: daily at 06:00 UTC (`vercel.json`)

## Rollback
- **Fast rollback**: redeploy the previous known-good build.
- **DB rollback**: avoid destructive rollbacks during pilot. Prefer forward fixes and feature flags.

## Incident checklist
If users report issues:
- Check if uploads are failing (API errors, storage permissions).
- Check Supabase status and logs.
- Check rate-limiting thresholds if users are blocked.
- Temporarily disable uploads if abuse/spam occurs and publish a status update.

