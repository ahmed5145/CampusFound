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

- Use Supabase CLI or psql to run `db/migrations/001_create_buildings_and_listings.sql`
- Run `db/seeds/001_seed_buildings.sql` if present

5. Start Next dev server:

```bash
npm run dev
```

Notes:
- `SUPABASE_SERVICE_ROLE_KEY` must NEVER be used in client-side bundles. Keep it server-only (CI, Vercel secrets).
- PostHog key set in `NEXT_PUBLIC_POSTHOG_KEY` is used client-side for analytics.
