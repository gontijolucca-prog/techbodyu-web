import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()

export const supabaseReady: boolean = !!(url && anon)
export const supabase: SupabaseClient | null = supabaseReady ? createClient(url!, anon!, { auth: { persistSession: true, autoRefreshToken: true } }) : null
