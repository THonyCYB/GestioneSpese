# 🚨 Risoluzione Problemi - Expense Tracker

## 🔧 Problemi Comuni e Soluzioni

### 1. Errori di Configurazione

#### ❌ "Cannot find module '@supabase/supabase-js'"
**Causa**: Dipendenze non installate
**Soluzione**:
\`\`\`bash
npm install @supabase/supabase-js
# oppure installa tutte le dipendenze
npm install
\`\`\`

#### ❌ "SUPABASE_URL is not defined"
**Causa**: File .env mancante o mal configurato
**Soluzione**:
1. Crea/verifica file `.env` nella root del progetto
2. Aggiungi le credenziali Supabase:
\`\`\`env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
\`\`\`

### 2. Errori Database Supabase

#### ❌ "relation 'users' does not exist"
**Causa**: Tabelle non create nel database
**Soluzione**:
1. Vai su Supabase Dashboard
2. Sezione "SQL Editor"
3. Esegui lo script `scripts/setup-supabase.sql`

#### ❌ "JWT expired" o "Invalid JWT"
**Causa**: Chiave service role errata
**Soluzione**:
1. Vai su Supabase Dashboard > Settings > API
2. Copia la "service_role" key (non anon key)
3. Aggiorna `SUPABASE_SERVICE_KEY` nel .env

#### ❌ "Row Level Security policy violation"
**Causa**: RLS attivo ma policy non configurate
**Soluzione**:
1. Disabilita temporaneamente RLS per test:
\`\`\`sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
\`\`\`
2. Oppure usa service_role key che bypassa RLS

### 3. Errori di Connessione

#### ❌ "connect ECONNREFUSED"
**Causa**: Server backend non avviato
**Soluzione**:
\`\`\`bash
npm run dev
\`\`\`

#### ❌ "CORS error"
**Causa**: Configurazione proxy frontend
**Soluzione**:
Verifica `client/vite.config.js`:
\`\`\`js
proxy: {
  "/api": {
    target: "http://localhost:3000",
    changeOrigin: true,
  },
}
\`\`\`

### 4. Errori Import/Export

#### ❌ "Cannot use import statement outside a module"
**Causa**: Package.json non configurato per ES modules
**Soluzione**:
Aggiungi in `package.json`:
\`\`\`json
{
  "type": "module"
}
\`\`\`

#### ❌ "fetch is not defined"
**Causa**: Node.js versione < 18
**Soluzione**:
1. Aggiorna Node.js a v18+
2. Oppure installa node-fetch:
\`\`\`bash
npm install node-fetch
\`\`\`

## 🛠️ Script di Debug

### 1. Debug Configurazione
\`\`\`bash
node scripts/debug-config.js
\`\`\`
Verifica tutte le configurazioni e connessioni.

### 2. Correzione Automatica
\`\`\`bash
node scripts/fix-setup.js
\`\`\`
Corregge automaticamente problemi comuni.

### 3. Test Step-by-Step
\`\`\`bash
# 1. Test configurazione
node scripts/debug-config.js

# 2. Test database
node scripts/test-database.js

# 3. Test API
node scripts/test-api.js
\`\`\`

## 📋 Checklist Risoluzione

### ✅ Configurazione Base
- [ ] Node.js v18+ installato
- [ ] File `.env` presente e configurato
- [ ] Dipendenze npm installate
- [ ] Progetto Supabase creato

### ✅ Database Supabase
- [ ] Script SQL eseguito
- [ ] Tabelle `users` e `expenses` create
- [ ] Service role key corretta
- [ ] URL progetto corretto

### ✅ Server Backend
- [ ] Server avviato su porta 3000
- [ ] Health check risponde
- [ ] Nessun errore console

### ✅ Frontend
- [ ] Vite dev server avviato
- [ ] Proxy configurato correttamente
- [ ] Pagina carica senza errori

## 🆘 Passi di Emergenza

Se nulla funziona, ricomincia da zero:

### 1. Reset Completo
\`\`\`bash
# Elimina node_modules e reinstalla
rm -rf node_modules package-lock.json
npm install

# Ricrea file .env
rm .env
node scripts/fix-setup.js
\`\`\`

### 2. Nuovo Progetto Supabase
1. Crea nuovo progetto su supabase.com
2. Ottieni nuove credenziali
3. Esegui script SQL
4. Aggiorna .env

### 3. Test Minimale
\`\`\`bash
# Test solo connessione
node -e "
import { createClient } from '@supabase/supabase-js';
const client = createClient('YOUR_URL', 'YOUR_KEY');
console.log('Supabase client created successfully');
"
\`\`\`

## 📞 Supporto

Se i problemi persistono:
1. Controlla logs dettagliati
2. Verifica versioni dipendenze
3. Testa con progetto Supabase nuovo
4. Controlla firewall/antivirus

**Ricorda**: La maggior parte degli errori sono dovuti a configurazione errata delle credenziali Supabase!
