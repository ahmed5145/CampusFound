# CampusFound — Project Context

CampusFound is a mobile-first found-item web app for Luther College.

Core goals:
- make it fast to upload a found item with a photo and a few required fields
- let users browse and filter active listings
- preserve item detail visibility for custom Other labels
- keep the schema simple and versioned through Supabase migrations

Current implementation notes:
- Listings live in Supabase `listings` and `buildings` tables.
- `other_location_type` is stored for listings with `location_type = other`.
- Public browse and item detail views render the custom Other label as `Other - <value>` when present.

Canonical references:
- `README.md`
- `db/migrations/001_create_buildings_and_listings.sql`
- `db/migrations/002_add_other_location_type_to_listings.sql`
- `docs/DATA_MODEL.md`
- `docs/USER_FLOW.md`
- `docs/V1_SCOPE_LOCK.md`