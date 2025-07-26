// Script per testare la connessione Supabase
// Esegui con: node scripts/test-supabase-connection.js

import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

async function testSupabaseConnection() {
  console.log("🧪 === TEST CONNESSIONE SUPABASE ===\n")

  // Verifica variabili ambiente
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  console.log("📋 Verifica configurazione:")
  console.log(`   SUPABASE_URL: ${supabaseUrl ? "✅ Configurato" : "❌ Mancante"}`)
  console.log(`   SUPABASE_SERVICE_KEY: ${supabaseServiceKey ? "✅ Configurato" : "❌ Mancante"}`)

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log("\n❌ Configurazione incompleta!")
    console.log("💡 Esegui: node scripts/configure-supabase.js")
    return false
  }

  // Test connessione
  console.log("\n🔌 Test connessione...")
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Test semplice query
    const { data, error } = await supabase.from("users").select("count(*)").limit(1)

    if (error) {
      if (error.code === "PGRST301") {
        console.log("⚠️  Connessione OK, ma tabelle non trovate")
        console.log("💡 Esegui lo script SQL in Supabase Dashboard:")
        console.log("   1. Vai su Supabase Dashboard → SQL Editor")
        console.log("   2. Copia il contenuto di scripts/setup-supabase.sql")
        console.log("   3. Incolla e clicca 'Run'")
        return "tables_missing"
      } else {
        console.log("❌ Errore connessione:", error.message)
        console.log("💡 Verifica le credenziali in .env")
        return false
      }
    }

    console.log("✅ Connessione Supabase OK!")
    console.log("✅ Tabelle database trovate!")
    return true
  } catch (error) {
    console.log("❌ Errore durante test:", error.message)
    return false
  }
}

// Test aggiuntivo per verificare struttura tabelle
async function testTableStructure() {
  console.log("\n📋 === TEST STRUTTURA TABELLE ===")

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  try {
    // Test tabella users
    const { data: usersTest, error: usersError } = await supabase.from("users").select("*").limit(1)

    if (usersError && usersError.code !== "PGRST116") {
      console.log("❌ Tabella 'users' non trovata")
      return false
    }
    console.log("✅ Tabella 'users' OK")

    // Test tabella expenses
    const { data: expensesTest, error: expensesError } = await supabase.from("expenses").select("*").limit(1)

    if (expensesError && expensesError.code !== "PGRST116") {
      console.log("❌ Tabella 'expenses' non trovata")
      return false
    }
    console.log("✅ Tabella 'expenses' OK")

    return true
  } catch (error) {
    console.log("❌ Errore test tabelle:", error.message)
    return false
  }
}

async function runTests() {
  const connectionResult = await testSupabaseConnection()

  if (connectionResult === true) {
    const tablesResult = await testTableStructure()

    if (tablesResult) {
      console.log("\n🎉 === TUTTO CONFIGURATO CORRETTAMENTE! ===")
      console.log("🚀 Puoi ora avviare l'app con: npm run dev")
    }
  } else if (connectionResult === "tables_missing") {
    console.log("\n⚠️  === CONFIGURAZIONE PARZIALE ===")
    console.log("🔧 Esegui lo script SQL e riprova")
  } else {
    console.log("\n❌ === CONFIGURAZIONE NECESSARIA ===")
    console.log("🔧 Esegui: node scripts/configure-supabase.js")
  }
}

runTests()
