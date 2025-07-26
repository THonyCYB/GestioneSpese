// Script per testare tutte le API con Supabase
// Esegui con: node scripts/test-api.js

// Rimuovi l'import di node-fetch che non è necessario in Node.js moderno
// import fetch from "node-fetch"

// Sostituisci con:
// Per Node.js 18+ fetch è built-in, ma per compatibilità:
const fetch = globalThis.fetch || (await import("node-fetch")).default

const API_BASE = "http://localhost:3000/api"
let authToken = null
let testUserId = null
let testExpenseId = null

// Utility per fare richieste HTTP
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  if (authToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${authToken}`
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    console.log(`${options.method || "GET"} ${endpoint}:`, {
      status: response.status,
      success: response.ok,
      data: response.ok ? data : data.message,
    })

    return { response, data }
  } catch (error) {
    console.error(`❌ Errore ${endpoint}:`, error.message)
    return { error }
  }
}

// Test Health Check
async function testHealthCheck() {
  console.log("\n🏥 === TEST HEALTH CHECK ===")
  await apiRequest("/health")
}

// Test Registrazione
async function testSignup() {
  console.log("\n📝 === TEST SIGNUP ===")
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = "password123"

  const { response, data } = await apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  })

  if (response?.ok) {
    authToken = data.token
    testUserId = data.user.id
    console.log("✅ Signup successful, token saved")
  }

  return { testEmail, testPassword }
}

// Test Login
async function testLogin(email, password) {
  console.log("\n🔐 === TEST LOGIN ===")
  const { response, data } = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  })

  if (response?.ok) {
    authToken = data.token
    console.log("✅ Login successful, token updated")
  }
}

// Test Creazione Spesa
async function testCreateExpense() {
  console.log("\n💰 === TEST CREATE EXPENSE ===")
  const expenseData = {
    title: "Test Spesa Supermercato",
    amount: 45.5,
    category: "Alimentari",
    date: "2024-01-15",
  }

  const { response, data } = await apiRequest("/expenses", {
    method: "POST",
    body: JSON.stringify(expenseData),
  })

  if (response?.ok) {
    testExpenseId = data.expense.id
    console.log("✅ Expense created, ID saved:", testExpenseId)
  }
}

// Test Recupero Spese
async function testGetExpenses() {
  console.log("\n📋 === TEST GET EXPENSES ===")
  await apiRequest("/expenses")

  // Test con filtri
  console.log("\n📋 === TEST GET EXPENSES WITH FILTERS ===")
  await apiRequest("/expenses?category=Alimentari&page=1&limit=10")
}

// Test Aggiornamento Spesa
async function testUpdateExpense() {
  if (!testExpenseId) {
    console.log("❌ No expense ID available for update test")
    return
  }

  console.log("\n✏️ === TEST UPDATE EXPENSE ===")
  const updateData = {
    title: "Test Spesa Supermercato AGGIORNATA",
    amount: 55.75,
    category: "Casa",
  }

  await apiRequest(`/expenses/${testExpenseId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  })
}

// Test Eliminazione Spesa
async function testDeleteExpense() {
  if (!testExpenseId) {
    console.log("❌ No expense ID available for delete test")
    return
  }

  console.log("\n🗑️ === TEST DELETE EXPENSE ===")
  await apiRequest(`/expenses/${testExpenseId}`, {
    method: "DELETE",
  })
}

// Test Errori di Validazione
async function testValidationErrors() {
  console.log("\n⚠️ === TEST VALIDATION ERRORS ===")

  // Test signup con email invalida
  console.log("\n📧 Test email invalida:")
  await apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email: "invalid-email",
      password: "password123",
    }),
  })

  // Test spesa con importo negativo
  console.log("\n💸 Test importo negativo:")
  await apiRequest("/expenses", {
    method: "POST",
    body: JSON.stringify({
      title: "Test Negativo",
      amount: -10,
      category: "Altro",
    }),
  })

  // Test spesa con categoria invalida
  console.log("\n🏷️ Test categoria invalida:")
  await apiRequest("/expenses", {
    method: "POST",
    body: JSON.stringify({
      title: "Test Categoria",
      amount: 10,
      category: "CategoriaInesistente",
    }),
  })
}

// Test Autenticazione
async function testAuthErrors() {
  console.log("\n🔒 === TEST AUTH ERRORS ===")

  // Salva token corrente
  const originalToken = authToken

  // Test senza token
  console.log("\n🚫 Test senza token:")
  authToken = null
  await apiRequest("/expenses")

  // Test con token invalido
  console.log("\n🔑 Test token invalido:")
  authToken = "invalid-token"
  await apiRequest("/expenses")

  // Ripristina token
  authToken = originalToken
}

// Esegui tutti i test
async function runAllTests() {
  console.log("🚀 === INIZIO TEST SUPABASE INTEGRATION ===")
  console.log("Assicurati che il server sia in esecuzione su http://localhost:3000")

  try {
    // Test base
    await testHealthCheck()

    // Test autenticazione
    const { testEmail, testPassword } = await testSignup()
    await testLogin(testEmail, testPassword)

    // Test CRUD spese
    await testCreateExpense()
    await testGetExpenses()
    await testUpdateExpense()

    // Test errori
    await testValidationErrors()
    await testAuthErrors()

    // Cleanup - elimina spesa di test
    await testDeleteExpense()

    console.log("\n✅ === TUTTI I TEST COMPLETATI ===")
    console.log("Se tutti i test mostrano status 200/201, Supabase funziona correttamente!")
  } catch (error) {
    console.error("❌ Errore durante i test:", error)
  }
}

// Avvia i test
runAllTests()
