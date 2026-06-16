-- Text search support for browse queries (description + location fields).

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_listings_description_trgm ON listings USING gin (description gin_trgm_ops);
CREATE INDEX idx_listings_location_details_trgm ON listings USING gin (location_details gin_trgm_ops);
CREATE INDEX idx_listings_other_location_type_trgm ON listings USING gin (other_location_type gin_trgm_ops);
