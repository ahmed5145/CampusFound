-- 005_add_reporter_ip_hash_to_reports.sql
-- Prevent duplicate reports for the same listing from the same reporter fingerprint.

ALTER TABLE reports
ADD COLUMN IF NOT EXISTS reporter_ip_hash TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_listing_reporter_unique
ON reports(listing_id, reporter_ip_hash)
WHERE reporter_ip_hash IS NOT NULL;
