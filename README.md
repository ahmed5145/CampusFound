# CampusFound

CampusFound is a mobile-first found-item board for campus communities. It gives users a fast way to post items they’ve found with a photo, building, and location details, while making it just as easy to browse active listings and open a full item detail page.

The app supports a lightweight workflow for the common campus case: choose a building, select a location type, add an optional custom "Other" specification when needed, and publish the listing with minimal friction.

## Features

- Mobile-first upload flow with image preview and validation
- Browse page with building and location-type filters
- Item detail page for individual listings
- Persistent `other_location_type` support for listings marked as Other
- Supabase-backed storage and database

## Project Structure

- `src/app/upload` - upload flow and submission
- `src/app/browse` - browse and filter listings
- `src/app/items/[id]` - item detail page
- `src/app/api/items` - listings API routes
- `src/lib` - Supabase, DB, validation, and helper utilities
- `db/migrations` - database migrations
- `docs` - product and implementation docs

## Getting Started

1. Install dependencies.

```bash
npm install
```

2. Create your environment file from `.env.example` and fill in the Supabase values.

3. Apply the database migrations in order.

```bash
db/migrations/001_create_buildings_and_listings.sql
db/migrations/002_add_other_location_type_to_listings.sql
```

4. Start the development server.

```bash
npm run dev
```

## Database Notes

- `other_location_type` is stored on `listings` for entries marked as `other`.
- The initial table creation lives in `db/migrations/001_create_buildings_and_listings.sql`.
- The follow-up schema migration for the custom Other value lives in `db/migrations/002_add_other_location_type_to_listings.sql`.

## Documentation

- [docs/DATA_MODEL.md](docs/DATA_MODEL.md)
- [docs/USER_FLOW.md](docs/USER_FLOW.md)
- [docs/V1_SCOPE_LOCK.md](docs/V1_SCOPE_LOCK.md)
- [docs/CAMPUS_ONBOARDING.md](docs/CAMPUS_ONBOARDING.md)
- [docs/OPS_RUNBOOK.md](docs/OPS_RUNBOOK.md)
- [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)

## Tech Stack

- Next.js
- TypeScript
- Supabase
