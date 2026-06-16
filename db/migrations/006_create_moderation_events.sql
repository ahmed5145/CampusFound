-- 006_create_moderation_events.sql
-- Audit log for listing and report moderation actions.

CREATE TABLE moderation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  previous_status TEXT,
  new_status TEXT,
  note TEXT,
  CONSTRAINT chk_moderation_action CHECK (
    action IN (
      'listing_removed',
      'listing_restored',
      'report_resolved',
      'report_dismissed',
      'report_reopened'
    )
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_moderation_events_created_at ON moderation_events(created_at DESC);
CREATE INDEX idx_moderation_events_listing_id ON moderation_events(listing_id);
