# 💰 Expense Tracker - Gestione Spese Personali

Una web app professionale per la gestione delle spese personali, costruita con architettura modulare e scalabile.

![Expense Tracker](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Supabase](https://img.shields.io/badge/Database-Supabase-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 Demo Live
- **Frontend**: [Inserire URL deploy]
- **API Health**: [Inserire URL]/api/health

## 🚀 Caratteristiche

### Backend (Node.js + Express + MongoDB)
- ✅ API RESTful complete per gestione spese
- ✅ Autenticazione JWT sicura
- ✅ Validazione dati robusta
- ✅ Middleware di sicurezza
- ✅ Gestione errori centralizzata
- ✅ Database MongoDB Atlas (gratuito)

### Frontend (Vite + Vanilla JS)
- ✅ Interfaccia responsive e professionale
- ✅ Gestione stato client-side
- ✅ Comunicazione API con fetch
- ✅ Notifiche toast per feedback utente
- ✅ Modal per editing spese
- ✅ Filtri avanzati per spese

### Funzionalità Principali
- 📝 **CRUD Completo**: Crea, leggi, aggiorna, elimina spese
- 🔐 **Autenticazione**: Registrazione e login sicuri
- 📊 **Dashboard**: Visualizzazione riassuntiva delle spese
- 🏷️ **Categorie**: Organizzazione spese per categoria
- 📅 **Filtri**: Filtra per data e categoria
- 💰 **Totali**: Calcolo automatico importi totali
- 📱 **Responsive**: Ottimizzato per mobile e desktop

## 🛠️ Setup e Installazione

### Prerequisiti
- Node.js (v18 o superiore)
- Account MongoDB Atlas (gratuito)
- Git

### 1. Backend Setup

\`\`\`bash
# Clona il repository
git clone <repository-url>
cd expense-tracker

# Installa dipendenze backend
npm install

# Configura variabili ambiente
cp .env.example .env
# Modifica .env con le tue credenziali MongoDB Atlas
\`\`\`

### 2. Configurazione Supabase

1. Crea account su [Supabase](https://supabase.com)
2. Crea nuovo progetto
3. Vai su Settings > API per ottenere:
   - Project URL
   - Anon public key  
   - Service role key (secret)
4. Aggiorna `.env` con le credenziali Supabase
5. Esegui lo script SQL in Supabase Dashboard > SQL Editor

### Database: Supabase PostgreSQL
- ✅ **PostgreSQL**: Database relazionale robusto
- ✅ **Row Level Security**: Sicurezza a livello di riga
- ✅ **API REST automatiche**: Generate automaticamente
- ✅ **Real-time**: Aggiornamenti in tempo reale (opzionale)
- ✅ **Dashboard**: Interfaccia web per gestione database

### Vantaggi Supabase vs MongoDB:
- 🔒 **Sicurezza**: RLS integrata
- ⚡ **Performance**: Indici PostgreSQL ottimizzati  
- 🛠️ **Tooling**: Dashboard completa per sviluppo
- 💰 **Costi**: Tier gratuito generoso
- 🔄 **Backup**: Backup automatici inclusi

### 3. Frontend Setup

\`\`\`bash
# Vai nella cartella client
cd client

# Installa dipendenze frontend
npm install

# Avvia server di sviluppo
npm run dev
\`\`\`

### 4. Avvio Applicazione

\`\`\`bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
\`\`\`

L'app sarà disponibile su:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📁 Struttura Progetto

\`\`\`
expense-tracker/
├── server.js              # Server principale Express
├── models/                # Modelli MongoDB
│   ├── User.js
│   └── Expense.js
├── routes/                # Route API
│   ├── auth.js
│   └── expenses.js
├── middleware/            # Middleware personalizzati
│   └── auth.js
├── scripts/               # Script database
│   └── setup-database.sql
├── client/                # Frontend Vite
│   ├── index.html
│   ├── main.js
│   ├── style.css
│   └── vite.config.js
├── .env                   # Variabili ambiente
└── package.json
\`\`\`

## 🔧 API Endpoints

### Autenticazione
- `POST /api/auth/signup` - Registrazione utente
- `POST /api/auth/login` - Login utente

### Spese (Protette)
- `GET /api/expenses` - Lista spese utente
- `POST /api/expenses` - Crea nuova spesa
- `PUT /api/expenses/:id` - Aggiorna spesa
- `DELETE /api/expenses/:id` - Elimina spesa

## 🧪 Test

### Test Backend con Postman

1. **Health Check**
   \`\`\`
   GET http://localhost:3000/api/health
   \`\`\`

2. **Registrazione**
   \`\`\`
   POST http://localhost:3000/api/auth/signup
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "password": "password123"
   }
   \`\`\`

3. **Login**
   \`\`\`
   POST http://localhost:3000/api/auth/login
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "password": "password123"
   }
   \`\`\`

4. **Crea Spesa**
   \`\`\`
   POST http://localhost:3000/api/expenses
   Authorization: Bearer YOUR_JWT_TOKEN
   Content-Type: application/json
   
   {
     "title": "Spesa supermercato",
     "amount": 45.50,
     "category": "Alimentari",
     "date": "2024-01-15"
   }
   \`\`\`

### Test Frontend

1. Apri http://localhost:5173
2. Registra nuovo utente
3. Effettua login
4. Aggiungi alcune spese
5. Testa filtri e modifica spese
6. Verifica responsive design

## 🔒 Sicurezza

- ✅ Password hashate con bcrypt (salt rounds: 12)
- ✅ JWT con scadenza (7 giorni)
- ✅ Validazione input lato server
- ✅ Middleware autenticazione per rotte protette
- ✅ CORS configurato
- ✅ Gestione errori sicura (no leak informazioni)

## 🚀 Deploy in Produzione

### Backend (Vercel/Railway/Render)
1. Configura variabili ambiente production
2. Aggiorna `NODE_ENV=production`
3. Deploy su piattaforma scelta

### Frontend (Vercel/Netlify)
1. Build progetto: `npm run build`
2. Deploy cartella `dist`
3. Configura proxy API per produzione

## 📱 Responsive Design

L'app è completamente responsive con breakpoint:
- Desktop: > 768px
- Tablet: 481px - 768px  
- Mobile: < 480px

## 🎨 Personalizzazione

### Colori
Modifica le variabili CSS in `client/style.css`:
\`\`\`css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #6b7280;
  --success-color: #10b981;
  --error-color: #ef4444;
}
\`\`\`

### Categorie Spese
Aggiungi nuove categorie in:
1. `models/Expense.js` (enum validation)
2. `client/index.html` (select options)

## 🐛 Troubleshooting

### Errori Comuni

1. **Errore connessione MongoDB**
   - Verifica connection string in `.env`
   - Controlla whitelist IP su Atlas
   - Verifica credenziali database user

2. **CORS Error**
   - Verifica configurazione proxy in `vite.config.js`
   - Controlla URL backend in frontend

3. **JWT Token Invalid**
   - Verifica `JWT_SECRET` in `.env`
   - Controlla scadenza token (7 giorni)

## 📈 Possibili Miglioramenti

- [ ] Grafici e statistiche avanzate
- [ ] Export dati (CSV, PDF)
- [ ] Notifiche push
- [ ] Backup automatico
- [ ] Condivisione spese tra utenti
- [ ] App mobile (React Native)
- [ ] Integrazione banche (Open Banking)

## 📄 Licenza

MIT License - Vedi file LICENSE per dettagli.

## 🤝 Contributi

1. Fork del progetto
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

---

**Sviluppato con ❤️ per la gestione delle spese personali**
