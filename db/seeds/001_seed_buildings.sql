-- 001_seed_buildings.sql
-- Idempotent seed for the buildings table.
-- Uses INSERT ... VALUES ... ON CONFLICT DO NOTHING so it can be run multiple times safely.

INSERT INTO buildings (name) VALUES ('Main')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Union')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Loyalty')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Koren')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Larsen')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('CFA (Center for the Arts)')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('CFL (Center for Faith and Life)')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Farwell')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Ylvisaker')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Brandt')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Dieseth')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Miller')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Olin')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Valders')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('SHL (Sampson Hoffland Laboratories)')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Jenson Hall')
ON CONFLICT (name) DO NOTHING;

INSERT INTO buildings (name) VALUES ('Gerdin Fieldhouse')
ON CONFLICT (name) DO NOTHING;

