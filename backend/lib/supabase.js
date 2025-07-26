import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Carica variabili ambiente
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ ERRORE: Credenziali Supabase mancanti nel file .env")
  console.log("💡 Aggiungi nel file .env:")
  console.log("   SUPABASE_URL=https://your-project.supabase.co")
  console.log("   SUPABASE_SERVICE_KEY=your-service-role-key")
  process.exit(1)
}

// Server-side client con service role key per operazioni admin
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Client-side per autenticazione (opzionale)
export const createSupabaseClient = (accessToken) => {
  return createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })
}

// Test connessione (chiamato manualmente quando necessario)
export async function testConnection() {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").limit(1)
    if (error && error.code !== "PGRST116") {
      console.warn("⚠️  Attenzione: Problema connessione Supabase:", error.message)
      console.log("💡 Verifica che le tabelle siano create nel database")
      return false
    } else {
      console.log("✅ Connessione Supabase OK")
      return true
    }
  } catch (error) {
    console.warn("⚠️  Attenzione: Test connessione Supabase fallito:", error.message)
    return false
  }
}
