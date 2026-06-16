# CampusFound — Campus Onboarding Guide

Use this checklist when launching a new campus instance (pilot or production).

## 1. Provision infrastructure

1. Create a Supabase project (or a dedicated schema if sharing a project).
2. Create a Vercel project connected to this repository.
3. Create a PostHog project (optional but recommended).

## 2. Configure environment variables

Copy `.env.example` to your Vercel environment (Staging + Production).

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon JWT key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only DB/storage access |
| `SUPABASE_STORAGE_BUCKET` | Image bucket name (`listings`) |
| `ADMIN_SECRET` | Shared-secret admin login fallback |
| `CRON_SECRET` | Protects `/api/cron/expire-listings` |
| `NEXT_PUBLIC_CAMPUS_NAME` | Header + page title branding |
| `NEXT_PUBLIC_CAMPUS_SLUG` | Scopes buildings/listings to one campus |
| `NEXT_PUBLIC_MODERATION_CONTACT` | Shown on `/about` |

## 3. Run database migrations

Apply in order in the Supabase SQL editor:

1. `001` – core schema
2. `002` – other location type
3. `003` – image path (signed storage)
4. `004` – reports
5. `005` – reporter IP hash
6. `006` – moderation events
7. `007` – campuses + building scoping
8. `008` – admin users (role-based staff login)
9. `009` – search indexes

Then seed buildings: `db/seeds/001_seed_buildings.sql`

## 4. Storage

1. Create bucket `listings` (or your configured name).
2. For public mode: set bucket public.
3. For signed mode: set `SUPABASE_STORAGE_MODE=signed` and keep bucket private.

## 5. Admin access

### Option A — Staff email (recommended)

1. Enable Email auth in Supabase Auth.
2. Create staff users in Supabase Auth (email + password).
3. Add matching rows to `admin_users`:

```sql
INSERT INTO admin_users (email, role)
VALUES ('moderator@yourcollege.edu', 'moderator')
ON CONFLICT (email) DO NOTHING;
```

Roles: `moderator` or `admin`.

### Option B — Shared secret (pilot fallback)

Set `ADMIN_SECRET` and use the **Shared secret** tab on `/admin/login`.

## 6. Scheduled expiry job

Vercel cron is configured in `vercel.json` (daily 06:00 UTC).

Set `CRON_SECRET` in Vercel, then verify manually:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain/api/cron/expire-listings
```

Expired active listings are marked `removed` and logged in moderation events.

## 7. Smoke test before launch

- Upload → browse → item detail
- Search on browse (`/browse?q=wallet`)
- Report listing → admin resolve
- Admin remove/restore
- Confirm thumbnails load on browse cards

## 8. Pilot → full launch

- Share `/about`, `/terms`, `/privacy` with campus stakeholders
- Monitor PostHog events: `upload_completed`, `listing_viewed`, `search_used`
- Review admin stats dashboard (`/admin`)
- Keep `docs/OPS_RUNBOOK.md` handy for incidents

## Multi-campus note

Each deployment should set `NEXT_PUBLIC_CAMPUS_SLUG` to the campus row in `campuses`. Additional campuses can be added to the same database with separate slugs and separate Vercel projects/env configs.
