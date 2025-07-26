// Script per verificare lo stato attuale di Supabase
// Esegui con: node scripts/check-supabase-status.js

import fs from "fs"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

async function checkSupabaseStatus() {
  console.log("🔍 === CONTROLLO STATO SUPABASE ===\n")

  // 1. Verifica file .env
  console.log("📁 Controllo file .env:")
  if (!fs.existsSync(".env")) {
    console.log("❌ File .env non trovato")
    return "no_env"
  }

  const envContent = fs.readFileSync(".env", "utf8")
  const hasSupabaseUrl = envContent.includes("SUPABASE_URL=") && !envContent.includes("your-project.supabase.co")
  const hasServiceKey = envContent.includes("SUPABASE_SERVICE_KEY=") && !envContent.includes("your-service-role-key")

  console.log(`   SUPABASE_URL: ${hasSupabaseUrl ? "✅ Configurato" : "❌ Non configurato"}`)
  console.log(`   SUPABASE_SERVICE_KEY: ${hasServiceKey ? "✅ Configurato" : "❌ Non configurato"}`)

  if (!hasSupabaseUrl || !hasServiceKey) {
    console.log("\n❌ Credenziali Supabase NON configurate")
    return "not_configured"
  }

  // 2. Test connessione
  console.log("\n🔌 Test connessione Supabase:")
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

    const { data, error } = await supabase.from("users").select("count(*)").limit(1)

    if (error) {
      if (error.code === "PGRST301") {
        console.log("⚠️  Connessione OK, ma tabelle mancanti")
        console.log(`   URL: ${process.env.SUPABASE_URL}`)
        return "tables_missing"
      } else {
        console.log("❌ Errore connessione:", error.message)
        return "connection_error"
      }
    }

    console.log("✅ Connessione Supabase OK!")
    console.log(`   URL: ${process.env.SUPABASE_URL}`)

    // 3. Test tabelle
    console.log("\n📋 Test struttura database:")

    const { data: usersTest } = await supabase.from("users").select("*").limit(1)
    const { data: expensesTest } = await supabase.from("expenses").select("*").limit(1)

    console.log("   ✅ Tabella 'users' trovata")
    console.log("   ✅ Tabella 'expenses' trovata")

    return "fully_configured"
  } catch (error) {
    console.log("❌ Errore durante test:", error.message)
    return "connection_error"
  }
}

async function showNextSteps(status) {
  console.log("\n🎯 === STATO ATTUALE E PROSSIMI PASSI ===")

  switch (status) {
    case "no_env":
      console.log("📝 STATO: File .env mancante")
      console.log("🔧 AZIONE: Esegui npm run setup per creare configurazione base")
      break

    case "not_configured":
      console.log("⚙️  STATO: Supabase non configurato")
      console.log("🔧 AZIONE: Configura credenziali Supabase")
      console.log("   → node scripts/configure-supabase.js")
      break

    case "connection_error":
      console.log("🔌 STATO: Errore connessione")
      console.log("🔧 AZIONE: Verifica credenziali")
      console.log("   → Controlla SUPABASE_URL e SUPABASE_SERVICE_KEY nel .env")
      console.log("   → Vai su Supabase Dashboard → Settings → API")
      break

    case "tables_missing":
      console.log("📋 STATO: Connesso ma tabelle mancanti")
      console.log("🔧 AZIONE: Crea tabelle database")
      console.log("   → Vai su Supabase Dashboard → SQL Editor")
      console.log("   → Copia contenuto di scripts/setup-supabase.sql")
      console.log("   → Incolla e clicca 'Run'")
      break

    case "fully_configured":
      console.log("🎉 STATO: Tutto configurato correttamente!")
      console.log("🚀 AZIONE: Avvia l'app")
      console.log("   → npm run dev")
      console.log("   → Apri http://localhost:3000")
      break
  }
}

// Esegui controllo
const status = await checkSupabaseStatus()
await showNextSteps(status)

// Mostra comandi utili
console.log("\n🛠️  === COMANDI UTILI ===")
console.log("   node scripts/configure-supabase.js    # Configura credenziali")
console.log("   node scripts/test-supabase-connection.js  # Test connessione")
console.log("   npm run dev                           # Avvia app")
console.log("   npm test                              # Test completo")
