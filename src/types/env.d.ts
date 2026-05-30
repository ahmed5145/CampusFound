declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_SERVICE_ROLE_KEY?: string
    NEXT_PUBLIC_POSTHOG_KEY?: string
    ADMIN_SECRET?: string
    SUPABASE_STORAGE_BUCKET?: string
  }
}
