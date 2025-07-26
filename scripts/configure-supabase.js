// Script interattivo per configurare Supabase
// Esegui con: node scripts/configure-supabase.js

import fs from "fs"
import { createInterface } from "readline"

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function configureSupabase() {
  console.log("🔧 === CONFIGURAZIONE SUPABASE ===\n")

  console.log("📋 Per configurare Supabase, segui questi passi:")
  console.log("1. Vai su https://supabase.com")
  console.log("2. Accedi o crea un account")
  console.log("3. Crea un nuovo progetto (o usa uno esistente)")
  console.log("4. Vai su Settings → API")
  console.log("5. Copia le credenziali richieste\n")

  // Chiedi le credenziali
  const supabaseUrl = await question("🌐 Inserisci SUPABASE_URL (es: https://abc123.supabase.co): ")
  const supabaseServiceKey = await question("🔑 Inserisci SUPABASE_SERVICE_KEY (service_role key): ")
  const supabaseAnonKey = await question("🔓 Inserisci SUPABASE_ANON_KEY (anon public key): ")

  // Valida input
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log("❌ URL e Service Key sono obbligatori!")
    rl.close()
    return
  }

  if (!supabaseUrl.includes("supabase.co")) {
    console.log("⚠️  L'URL non sembra valido. Dovrebbe essere simile a: https://abc123.supabase.co")
  }

  // Leggi file .env esistente
  let envContent = ""
  if (fs.existsSync(".env")) {
    envContent = fs.readFileSync(".env", "utf8")
  }

  // Aggiorna o aggiungi le credenziali Supabase
  const envLines = envContent.split("\n")
  const updatedLines = []
  const supabaseVars = {
    SUPABASE_URL: supabaseUrl,
    SUPABASE_SERVICE_KEY: supabaseServiceKey,
    SUPABASE_ANON_KEY: supabaseAnonKey || supabaseServiceKey,
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey || supabaseServiceKey,
  }

  // Mantieni variabili esistenti e aggiorna quelle Supabase
  const processedVars = new Set()

  for (const line of envLines) {
    if (line.trim() === "" || line.startsWith("#")) {
      updatedLines.push(line)
      continue
    }

    const [key] = line.split("=")
    if (supabaseVars[key]) {
      updatedLines.push(`${key}=${supabaseVars[key]}`)
      processedVars.add(key)
    } else {
      updatedLines.push(line)
    }
  }

  // Aggiungi variabili Supabase mancanti
  Object.entries(supabaseVars).forEach(([key, value]) => {
    if (!processedVars.has(key)) {
      updatedLines.push(`${key}=${value}`)
    }
  })

  // Assicurati che ci siano altre variabili necessarie
  const requiredVars = {
    PORT: "3000",
    JWT_SECRET: `expense-tracker-jwt-secret-${Date.now()}`,
    NODE_ENV: "development",
  }

  Object.entries(requiredVars).forEach(([key, defaultValue]) => {
    if (!updatedLines.some((line) => line.startsWith(`${key}=`))) {
      updatedLines.push(`${key}=${defaultValue}`)
    }
  })

  // Scrivi file .env aggiornato
  const finalEnvContent = updatedLines.join("\n")
  fs.writeFileSync(".env", finalEnvContent)

  console.log("\n✅ File .env aggiornato con successo!")
  console.log("\n📋 Configurazione salvata:")
  console.log(`   SUPABASE_URL: ${supabaseUrl}`)
  console.log(`   SUPABASE_SERVICE_KEY: ${supabaseServiceKey.substring(0, 20)}...`)
  console.log(`   SUPABASE_ANON_KEY: ${(supabaseAnonKey || "usando service key").substring(0, 20)}...`)

  console.log("\n🎯 Prossimi passi:")
  console.log("1. Esegui lo script SQL per creare le tabelle:")
  console.log("   → Vai su Supabase Dashboard → SQL Editor")
  console.log("   → Copia il contenuto di scripts/setup-supabase.sql")
  console.log("   → Incolla e clicca 'Run'")
  console.log("\n2. Avvia l'app:")
  console.log("   → npm run dev")

  rl.close()
}

configureSupabase().catch(console.error)
