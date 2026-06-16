-- 004_create_reports.sql
-- User-submitted reports for inappropriate or unsafe listings.

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  CONSTRAINT chk_report_reason CHECK (
    reason IN (
      'inappropriate_content',
      'personal_information',
      'spam',
      'not_a_found_item',
      'other'
    )
  ),
  CONSTRAINT chk_report_status CHECK (
    status IN (
      'open',
      'resolved',
      'dismissed'
    )
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_listing_id ON reports(listing_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
