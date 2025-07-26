import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "/api"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "dummy-key"

// Client Supabase per il frontend (opzionale, usiamo le nostre API)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Per ora manteniamo le chiamate API REST personalizzate
// ma in futuro possiamo migrare a Supabase client direttamente
