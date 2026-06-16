-- Role-based admin users (used with Supabase Auth email login).

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'moderator',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_admin_role CHECK (role IN ('moderator', 'admin'))
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
