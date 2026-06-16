import 'server-only'

import { getServiceSupabase } from './supabaseClient'

export type AdminRole = 'moderator' | 'admin'

export interface AdminUserRecord {
  id: string
  email: string
  role: AdminRole
  created_at: string
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function getAdminUserByEmail(email: string): Promise<AdminUserRecord | null> {
  const supabase = getServiceSupabase()
  const normalized = normalizeEmail(email)

  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, role, created_at')
    .eq('email', normalized)
    .maybeSingle<AdminUserRecord>()

  if (error) {
    throw error
  }

  return data
}
