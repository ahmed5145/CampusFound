-- 002_add_other_location_type_to_listings.sql
-- Add persisted custom text for listings marked as 'other'
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS other_location_type TEXT;
