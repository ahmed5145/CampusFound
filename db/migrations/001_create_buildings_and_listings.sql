-- 001_create_buildings_and_listings.sql
-- Supabase/Postgres schema for CampusFound
-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Buildings table
CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  photo_hash TEXT,
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE RESTRICT,
  location_type TEXT NOT NULL,
  location_details TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  CONSTRAINT chk_location_type CHECK (
    location_type IN (
      'lost_and_found',
      'campus_safety',
      'other'
    )
  ),
  CONSTRAINT chk_status CHECK (
    status IN (
      'active',
      'removed'
    )
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '60 days'),
  CONSTRAINT chk_expires_after_created CHECK (expires_at > created_at)
);

-- Indexes tuned for MVP access patterns
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_expires_at ON listings(expires_at);
CREATE INDEX idx_listings_building_id ON listings(building_id);
CREATE INDEX idx_listings_status ON listings(status);

-- Notes: enums and full-text indexes intentionally omitted to keep schema flexible and simple for iteration.
