# 🔧 Setup Supabase - Guida Completa

## 🎯 Panoramica

Questa guida ti aiuta a configurare Supabase per l'app Expense Tracker in 10 minuti.

## 📋 Prerequisiti

- Account Supabase (gratuito)
- Progetto Supabase creato
- Credenziali API

## 🚀 Setup Rapido

### 1. Crea Progetto Supabase

\`\`\`bash
# Guida interattiva
node scripts/create-supabase-project.js
\`\`\`

### 2. Configura Credenziali

\`\`\`bash
# Configurazione interattiva
node scripts/configure-supabase.js
\`\`\`

### 3. Test Connessione

\`\`\`bash
# Verifica configurazione
node scripts/test-supabase-connection.js
\`\`\`

### 4. Setup Database

1. Vai su **Supabase Dashboard → SQL Editor**
2. Copia contenuto di \`scripts/setup-supabase.sql\`
3. Incolla e clicca **"Run"**

### 5. Avvia App

\`\`\`bash
npm run dev
\`\`\`

## 🔑 Credenziali Necessarie

Dal **Supabase Dashboard → Settings → API**:

- **Project URL**: \`https://abc123.supabase.co\`
- **anon public key**: Per frontend (inizia con eyJ...)
- **service_role key**: Per backend (inizia con eyJ... - più lungo)

## ⚠️ Importante

- ✅ Usa **service_role key** per il backend
- ✅ Salva la **database password** 
- ✅ Non condividere mai le chiavi private
- ✅ Il tier gratuito è sufficiente per sviluppo

## 🐛 Risoluzione Problemi

### "relation 'users' does not exist"
→ Esegui lo script SQL nel dashboard

### "Invalid JWT"  
→ Verifica di usare service_role key, non anon key

### "Project not found"
→ Controlla che l'URL sia corretto

## 📞 Supporto

- 📚 [Documentazione Supabase](https://supabase.com/docs)
- 💬 [Discord Community](https://discord.supabase.com)
- 🐛 [GitHub Issues](https://github.com/supabase/supabase/issues)
