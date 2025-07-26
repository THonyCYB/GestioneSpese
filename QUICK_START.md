# 🚀 Quick Start - Expense Tracker

## ⚡ Avvio Rapido (3 minuti)

### 1. Setup Automatico
\`\`\`bash
# Installa tutto e configura
npm run setup
\`\`\`

### 2. Configura Supabase
1. Vai su [supabase.com](https://supabase.com) e crea progetto
2. Settings → API → copia credenziali
3. Aggiorna file `.env`:
\`\`\`env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
\`\`\`

### 3. Setup Database
1. Supabase Dashboard → SQL Editor
2. Copia e incolla contenuto di `scripts/setup-supabase.sql`
3. Clicca "Run"

### 4. Avvia App
\`\`\`bash
# Metodo 1: Script automatico
chmod +x start.sh && ./start.sh

# Metodo 2: Manuale
npm run dev  # Terminal 1
cd client && npm run dev  # Terminal 2
\`\`\`

### 5. Testa App
- Backend: http://localhost:3000/api/health
- Frontend: http://localhost:5173

## 🎯 Tutto Funziona?

✅ **Backend**: Status 200 su /api/health  
✅ **Frontend**: Pagina carica senza errori  
✅ **Database**: Registrazione/login funziona  
✅ **CRUD**: Puoi aggiungere/modificare spese  

## 🆘 Problemi?

\`\`\`bash
# Debug automatico
node scripts/debug-config.js

# Test completo
npm test
\`\`\`

**🎉 Congratulazioni! La tua app è pronta!**
