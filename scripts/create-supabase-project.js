// Guida per creare progetto Supabase
// Esegui con: node scripts/create-supabase-project.js

console.log(`
🎯 === GUIDA CREAZIONE PROGETTO SUPABASE ===

📋 Segui questi passi per creare il tuo progetto Supabase:

1️⃣  ACCEDI A SUPABASE
   → Vai su: https://supabase.com
   → Clicca "Start your project"
   → Accedi con GitHub/Google o crea account

2️⃣  CREA NUOVO PROGETTO
   → Clicca "New Project"
   → Scegli organizzazione (o creane una)
   → Inserisci dettagli progetto:
     • Name: expense-tracker (o nome a tua scelta)
     • Database Password: crea password sicura (SALVALA!)
     • Region: Europe West (London) - più vicino all'Italia
   → Clicca "Create new project"
   → Aspetta 2-3 minuti per setup

3️⃣  OTTIENI CREDENZIALI API
   → Nel dashboard, vai su "Settings" (icona ingranaggio)
   → Clicca "API" nella sidebar
   → Troverai:
     • Project URL (es: https://abc123.supabase.co)
     • anon public key (inizia con "eyJ...")
     • service_role key (inizia con "eyJ..." - PIÙ LUNGO)

4️⃣  CONFIGURA L'APP
   → Esegui: node scripts/configure-supabase.js
   → Inserisci le credenziali quando richiesto

5️⃣  SETUP DATABASE
   → Nel dashboard Supabase, vai su "SQL Editor"
   → Copia tutto il contenuto di scripts/setup-supabase.sql
   → Incolla nell'editor e clicca "Run"

6️⃣  TEST CONFIGURAZIONE
   → Esegui: node scripts/test-supabase-connection.js
   → Dovrebbe mostrare "✅ TUTTO CONFIGURATO CORRETTAMENTE!"

7️⃣  AVVIA L'APP
   → Esegui: npm run dev
   → Apri: http://localhost:3000

🎉 FATTO! La tua app è pronta!

💡 SUGGERIMENTI:
   • Salva la password del database in un posto sicuro
   • La service_role key è SEGRETA - non condividerla
   • Il tier gratuito include 500MB storage e 2GB bandwidth
   • Puoi sempre vedere le credenziali in Settings → API

❓ PROBLEMI?
   • Verifica che l'URL sia corretto (deve finire con .supabase.co)
   • Usa la service_role key, non la anon key per il backend
   • Controlla che il progetto sia completamente inizializzato

🚀 Inizia ora: https://supabase.com
`)
