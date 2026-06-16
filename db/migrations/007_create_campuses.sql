-- Multi-campus foundation: campuses table and building scoping.

CREATE TABLE campuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE buildings
  ADD COLUMN campus_id UUID REFERENCES campuses(id) ON DELETE RESTRICT;

CREATE INDEX idx_buildings_campus_id ON buildings(campus_id);

-- Default Luther College campus for existing deployments.
INSERT INTO campuses (slug, name)
VALUES ('luther', 'Luther College')
ON CONFLICT (slug) DO NOTHING;

UPDATE buildings
SET campus_id = (SELECT id FROM campuses WHERE slug = 'luther')
WHERE campus_id IS NULL;
