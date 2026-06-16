Developer setup notes (minimal)

1. Install dependencies (example):

```bash
npm install
# or
pnpm install
```

2. Install runtime packages used by libs (if not present):

```bash
npm install @supabase/supabase-js posthog-js
```

3. Copy `.env.example` to `.env.local` and fill values.

4. Run DB migrations and seeds (point to your Supabase project's connection):

- Use Supabase CLI or psql to run migrations in order:
	- `db/migrations/001_create_buildings_and_listings.sql`
	- `db/migrations/002_add_other_location_type_to_listings.sql`
	- `db/migrations/003_add_image_path_to_listings.sql`
	- `db/migrations/004_create_reports.sql`
- Run `db/seeds/001_seed_buildings.sql` if present

5. Start Next dev server:

```bash
npm run dev
```

Notes:
- `SUPABASE_SERVICE_ROLE_KEY` must NEVER be used in client-side bundles. Keep it server-only (CI, Vercel secrets).
- PostHog key set in `NEXT_PUBLIC_POSTHOG_KEY` is used client-side for analytics.
- The listings schema includes `other_location_type` for `location_type = 'other'` submissions.

Server-only modules:
- When you create modules that must only run on the server (database access, service-role Supabase usage, storage helpers), add this import at the top of the file to prevent accidental client-side imports in Next.js:

```ts
import 'server-only'
```

Read `process.env.ADMIN_SECRET` directly inside server routes or server-only modules; do not export secrets from shared modules.
