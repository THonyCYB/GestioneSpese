// Script completo per setup e avvio dell'app
// Esegui con: npm run setup

import fs from "fs"
import { execSync } from "child_process"

console.log("🚀 === SETUP COMPLETO EXPENSE TRACKER ===\n")

// 1. Installa dipendenze se necessario
console.log("📦 Installazione dipendenze...")
try {
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dipendenze installate\n")
} catch (error) {
  console.error("❌ Errore installazione dipendenze:", error.message)
}

// 2. Crea file .env se mancante
if (!fs.existsSync(".env")) {
  console.log("📝 Creazione file .env...")
  const envContent = `# Expense Tracker Configuration
PORT=3000
JWT_SECRET=expense-tracker-jwt-secret-${Date.now()}-change-in-production
NODE_ENV=development

# Supabase Configuration
# IMPORTANTE: Sostituisci questi valori con le tue credenziali Supabase
# Ottieni da: https://app.supabase.com/project/YOUR_PROJECT/settings/api
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Per test locali (opzionale)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
`
  fs.writeFileSync(".env", envContent)
  console.log("✅ File .env creato")
  console.log("⚠️  IMPORTANTE: Aggiorna le credenziali Supabase nel file .env\n")
}

// 3. Crea cartelle necessarie
const dirs = ["lib", "routes", "middleware", "scripts", "client"]
dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✅ Cartella ${dir} creata`)
  }
})

// 4. Setup client se non esiste
if (!fs.existsSync("client/package.json")) {
  console.log("\n🎨 Setup frontend...")
  fs.mkdirSync("client", { recursive: true })

  const clientPackageJson = {
    name: "expense-tracker-client",
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    devDependencies: {
      vite: "^5.0.8",
    },
  }

  fs.writeFileSync("client/package.json", JSON.stringify(clientPackageJson, null, 2))
  console.log("✅ Client package.json creato")
}

console.log("\n🎯 === SETUP COMPLETATO ===")
console.log("Prossimi passi:")
console.log("1. Aggiorna le credenziali Supabase nel file .env")
console.log("2. Esegui lo script SQL in Supabase Dashboard")
console.log("3. Avvia l'app con: npm run dev")
console.log("\n📚 Guida completa in README.md")
