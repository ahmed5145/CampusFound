-- 003_add_image_path_to_listings.sql
-- Store the storage object path so we can serve signed URLs for private buckets.
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS image_path TEXT;

CREATE INDEX IF NOT EXISTS idx_listings_image_path ON listings(image_path);

