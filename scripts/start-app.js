// Script per avviare l'app completa
// Esegui con: node scripts/start-app.js

import { spawn } from "child_process"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

async function checkSupabaseConnection() {
  console.log("🔌 Verifica connessione Supabase...")

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error("❌ Credenziali Supabase mancanti nel file .env")
    console.log("💡 Configura SUPABASE_URL e SUPABASE_SERVICE_KEY")
    return false
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { data, error } = await supabase.from("users").select("count(*)").limit(1)

    if (error && error.code !== "PGRST116") {
      console.warn("⚠️  Database non configurato:", error.message)
      console.log("💡 Esegui lo script SQL in Supabase Dashboard")
      return false
    }

    console.log("✅ Connessione Supabase OK")
    return true
  } catch (error) {
    console.error("❌ Errore connessione Supabase:", error.message)
    return false
  }
}

async function startApp() {
  console.log("🚀 === AVVIO EXPENSE TRACKER ===\n")

  // Verifica connessione Supabase
  const supabaseOk = await checkSupabaseConnection()
  if (!supabaseOk) {
    console.log("\n❌ Impossibile avviare l'app senza Supabase configurato")
    console.log("📚 Consulta README.md per la configurazione")
    return
  }

  console.log("\n🎯 Avvio server backend...")

  // Avvia server backend
  const backend = spawn("npm", ["run", "dev"], {
    stdio: "inherit",
    shell: true,
  })

  backend.on("error", (error) => {
    console.error("❌ Errore avvio backend:", error)
  })

  // Aspetta un po' prima di avviare il frontend
  setTimeout(() => {
    console.log("\n🎨 Avvio frontend...")

    // Avvia frontend
    const frontend = spawn("npm", ["run", "dev"], {
      cwd: "client",
      stdio: "inherit",
      shell: true,
    })

    frontend.on("error", (error) => {
      console.error("❌ Errore avvio frontend:", error)
    })
  }, 3000)

  // Gestione chiusura
  process.on("SIGINT", () => {
    console.log("\n🛑 Chiusura app...")
    backend.kill()
    process.exit(0)
  })
}

startApp()
