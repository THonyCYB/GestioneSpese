// Script per correggere automaticamente problemi comuni
// Esegui con: node scripts/fix-setup.js

import fs from "fs"

async function fixCommonIssues() {
  console.log("🔧 === CORREZIONE AUTOMATICA PROBLEMI ===\n")

  // 1. Verifica e crea file .env se mancante
  if (!fs.existsSync(".env")) {
    console.log("📝 Creazione file .env...")
    const envTemplate = `PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production-${Date.now()}
NODE_ENV=development

# Supabase Configuration
# Ottieni questi valori da: https://app.supabase.com/project/YOUR_PROJECT/settings/api
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
`
    fs.writeFileSync(".env", envTemplate)
    console.log("✅ File .env creato")
    console.log("⚠️  IMPORTANTE: Aggiorna le credenziali Supabase nel file .env")
  } else {
    console.log("✅ File .env esiste")
  }

  // 2. Verifica package.json dependencies
  console.log("\n📦 Controllo dipendenze...")
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))

  const requiredDeps = {
    "@supabase/supabase-js": "^2.38.4",
    express: "^4.18.2",
    cors: "^2.8.5",
    dotenv: "^16.3.1",
    bcryptjs: "^2.4.3",
    jsonwebtoken: "^9.0.2",
  }

  const missingDeps = []
  Object.entries(requiredDeps).forEach(([dep, version]) => {
    if (!packageJson.dependencies?.[dep]) {
      missingDeps.push(`${dep}@${version}`)
    }
  })

  if (missingDeps.length > 0) {
    console.log("❌ Dipendenze mancanti:", missingDeps)
    console.log("💡 Esegui: npm install " + missingDeps.join(" "))
  } else {
    console.log("✅ Tutte le dipendenze sono presenti")
  }

  // 3. Verifica struttura cartelle
  console.log("\n📁 Controllo struttura cartelle...")
  const requiredDirs = ["lib", "routes", "middleware", "scripts", "client"]

  requiredDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`✅ Cartella ${dir} creata`)
    } else {
      console.log(`✅ Cartella ${dir} esiste`)
    }
  })

  // 4. Crea script di avvio se mancante
  if (!packageJson.scripts?.dev) {
    console.log("\n📜 Aggiornamento script package.json...")
    packageJson.scripts = {
      ...packageJson.scripts,
      dev: "nodemon server.js",
      start: "node server.js",
    }
    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2))
    console.log("✅ Script dev aggiunto")
  }

  console.log("\n🎯 === CORREZIONI COMPLETATE ===")
  console.log("Prossimi passi:")
  console.log("1. Aggiorna le credenziali Supabase nel file .env")
  console.log("2. Esegui: npm install (se ci sono dipendenze mancanti)")
  console.log("3. Esegui lo script SQL in Supabase Dashboard")
  console.log("4. Riprova i test: node scripts/debug-config.js")
}

fixCommonIssues()
