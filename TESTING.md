# 🧪 Guida ai Test - Expense Tracker con Supabase

Questa guida ti aiuta a testare completamente l'integrazione con Supabase.

## 🚀 Preparazione Test

### 1. Avvia il Server
\`\`\`bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
\`\`\`

### 2. Verifica Configurazione
- ✅ File `.env` configurato con credenziali Supabase
- ✅ Script SQL eseguito in Supabase Dashboard
- ✅ Tabelle `users` e `expenses` create
- ✅ Server backend su http://localhost:3000
- ✅ Frontend su http://localhost:5173

## 🔧 Test Backend (API)

### Test Automatici
\`\`\`bash
# Test completo API
node scripts/test-api.js

# Test database diretto
node scripts/test-database.js
\`\`\`

### Test Manuali con Postman

#### 1. Health Check
\`\`\`
GET http://localhost:3000/api/health
\`\`\`
**Risultato atteso**: Status 200, messaggio con "Supabase PostgreSQL"

#### 2. Registrazione
\`\`\`
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
\`\`\`
**Risultato atteso**: Status 201, token JWT, user object

#### 3. Login
\`\`\`
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com", 
  "password": "password123"
}
\`\`\`
**Risultato atteso**: Status 200, token JWT, user object

#### 4. Crea Spesa
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
**Risultato atteso**: Status 201, expense object con ID

#### 5. Lista Spese
\`\`\`
GET http://localhost:3000/api/expenses
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`
**Risultato atteso**: Status 200, array expenses, pagination, totalAmount

#### 6. Aggiorna Spesa
\`\`\`
PUT http://localhost:3000/api/expenses/EXPENSE_ID
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Spesa supermercato AGGIORNATA",
  "amount": 55.75
}
\`\`\`
**Risultato atteso**: Status 200, expense aggiornata

#### 7. Elimina Spesa
\`\`\`
DELETE http://localhost:3000/api/expenses/EXPENSE_ID
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`
**Risultato atteso**: Status 200, messaggio conferma

## 🎨 Test Frontend

### Test Automatico
Apri: http://localhost:5173/test.html

Questa pagina include:
- ✅ Test connessione API
- ✅ Test autenticazione (signup/login/logout)
- ✅ Test CRUD spese complete
- ✅ Test filtri e paginazione
- ✅ Test gestione errori
- ✅ Test validazioni

### Test Manuale App Principale
1. Apri http://localhost:5173
2. Clicca "Registrati" → inserisci email/password
3. Verifica redirect a dashboard
4. Aggiungi alcune spese con categorie diverse
5. Testa filtri per categoria e data
6. Modifica una spesa esistente
7. Elimina una spesa
8. Testa logout e re-login

## 🔍 Test Database Supabase

### Verifica Tabelle
1. Vai su Supabase Dashboard
2. Sezione "Table Editor"
3. Verifica tabelle `users` e `expenses`
4. Controlla dati inseriti dai test

### Query SQL Dirette
\`\`\`sql
-- Conta utenti
SELECT COUNT(*) FROM users;

-- Conta spese per utente
SELECT u.email, COUNT(e.id) as expense_count, SUM(e.amount) as total_amount
FROM users u
LEFT JOIN expenses e ON u.id = e.user_id
GROUP BY u.id, u.email;

-- Spese per categoria
SELECT category, COUNT(*) as count, SUM(amount) as total
FROM expenses
GROUP BY category
ORDER BY total DESC;
\`\`\`

## ⚠️ Test Errori e Validazioni

### Test Errori Attesi

#### 1. Email Duplicata
\`\`\`bash
# Dovrebbe fallire con errore 400
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"existing@example.com","password":"password123"}'
\`\`\`

#### 2. Password Troppo Corta
\`\`\`bash
# Dovrebbe fallire con errore 400
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123"}'
\`\`\`

#### 3. Categoria Invalida
\`\`\`bash
# Dovrebbe fallire con errore 400
curl -X POST http://localhost:3000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","amount":10,"category":"InvalidCategory"}'
\`\`\`

#### 4. Importo Negativo
\`\`\`bash
# Dovrebbe fallire con errore 400
curl -X POST http://localhost:3000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","amount":-10,"category":"Altro"}'
\`\`\`

## 📊 Checklist Test Completa

### ✅ Backend
- [ ] Health check risponde correttamente
- [ ] Signup crea utente in database
- [ ] Login restituisce token valido
- [ ] Token JWT autentica richieste
- [ ] CRUD spese funziona completamente
- [ ] Filtri e paginazione funzionano
- [ ] Validazioni bloccano dati invalidi
- [ ] Errori restituiscono messaggi appropriati

### ✅ Database
- [ ] Tabelle create correttamente
- [ ] Constraints funzionano (email unica, categoria valida, importo positivo)
- [ ] Indici migliorano performance
- [ ] Row Level Security configurata
- [ ] Trigger updated_at funziona

### ✅ Frontend
- [ ] Pagine si caricano correttamente
- [ ] Autenticazione funziona (signup/login/logout)
- [ ] Dashboard mostra dati corretti
- [ ] Form spese validano input
- [ ] Filtri aggiornano lista
- [ ] Modal modifica funziona
- [ ] Toast notifications appaiono
- [ ] Design responsive su mobile

### ✅ Integrazione
- [ ] Frontend comunica con backend
- [ ] Token salvato in localStorage
- [ ] Richieste autenticate funzionano
- [ ] Errori gestiti correttamente
- [ ] Stato UI aggiornato dopo operazioni

## 🐛 Risoluzione Problemi

### Errore Connessione Database
\`\`\`
Error: connect ECONNREFUSED
\`\`\`
**Soluzione**: Verifica credenziali Supabase in `.env`

### Errore Tabelle Non Trovate
\`\`\`
relation "users" does not exist
\`\`\`
**Soluzione**: Esegui script SQL in Supabase Dashboard

### Errore CORS
\`\`\`
Access to fetch blocked by CORS policy
\`\`\`
**Soluzione**: Verifica proxy in `vite.config.js`

### Token JWT Invalido
\`\`\`
JsonWebTokenError: invalid token
\`\`\`
**Soluzione**: Verifica `JWT_SECRET` in `.env`

## 🎯 Risultati Attesi

Se tutti i test passano:
- ✅ **Backend**: Tutte le API restituiscono status 200/201
- ✅ **Database**: Dati salvati e recuperati correttamente
- ✅ **Frontend**: UI funziona senza errori console
- ✅ **Integrazione**: App completa funziona end-to-end

**🎉 Congratulazioni! La tua app Expense Tracker con Supabase è pronta!**
