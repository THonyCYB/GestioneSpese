// Script per debuggare la configurazione
// Esegui con: node scripts/debug-config.js

import dotenv from "dotenv"
import { supabaseAdmin } from "../lib/supabase.js"

// Carica variabili ambiente
dotenv.config()

async function debugConfiguration() {
  console.log("🔍 === DEBUG CONFIGURAZIONE ===\n")

  // 1. Verifica file .env
  console.log("📁 Controllo file .env:")
  const requiredVars = ["PORT", "JWT_SECRET", "NODE_ENV", "SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_KEY"]

  requiredVars.forEach((varName) => {
    const value = process.env[varName]
    if (value) {
      // Nascondi valori sensibili
      const displayValue = ["JWT_SECRET", "SUPABASE_SERVICE_KEY"].includes(varName)
        ? `${value.substring(0, 10)}...`
        : value
      console.log(`✅ ${varName}: ${displayValue}`)
    } else {
      console.log(`❌ ${varName}: NON CONFIGURATA`)
    }
  })

  // 2. Test connessione Supabase
  console.log("\n🔌 Test connessione Supabase:")
  try {
    const { data, error } = await supabaseAdmin.from("users").select("count(*)").single()

    if (error) {
      console.error("❌ Errore connessione Supabase:")
      console.error("   Codice:", error.code)
      console.error("   Messaggio:", error.message)
      console.error("   Dettagli:", error.details)

      // Suggerimenti basati sull'errore
      if (error.code === "PGRST301") {
        console.log("\n💡 Possibili soluzioni:")
        console.log("   - Verifica che le tabelle siano create nel database")
        console.log("   - Esegui lo script SQL in Supabase Dashboard")
      } else if (error.message.includes("JWT")) {
        console.log("\n💡 Possibili soluzioni:")
        console.log("   - Verifica SUPABASE_SERVICE_KEY nel file .env")
        console.log("   - Controlla che la chiave sia quella corretta dal dashboard")
      }
    } else {
      console.log("✅ Connessione Supabase OK")
    }
  } catch (error) {
    console.error("❌ Errore durante test connessione:", error.message)
  }

  // 3. Verifica struttura progetto
  console.log("\n📂 Controllo struttura progetto:")
  const fs = await import("fs")
  const path = await import("path")

  const requiredFiles = [".env", "lib/supabase.js", "server.js", "package.json"]

  requiredFiles.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${filePath}`)
    } else {
      console.log(`❌ ${filePath} - FILE MANCANTE`)
    }
  })

  // 4. Test import moduli
  console.log("\n📦 Test import moduli:")
  try {
    const express = await import("express")
    console.log("✅ Express importato")
  } catch (error) {
    console.log("❌ Express non trovato - esegui: npm install")
  }

  try {
    const supabase = await import("@supabase/supabase-js")
    console.log("✅ Supabase client importato")
  } catch (error) {
    console.log("❌ Supabase client non trovato - esegui: npm install @supabase/supabase-js")
  }

  console.log("\n🎯 === RIEPILOGO DEBUG ===")
  console.log("Se vedi errori sopra, segui i suggerimenti per risolverli.")
  console.log("Una volta risolti, riprova i test principali.")
}

debugConfiguration()
