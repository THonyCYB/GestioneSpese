// Script per testare direttamente la connessione Supabase
// Esegui con: node scripts/test-database.js

import { supabaseAdmin } from "../lib/supabase.js"
import bcrypt from "bcryptjs"

async function checkConfiguration() {
  console.log("🔧 === CONTROLLO CONFIGURAZIONE ===")

  // Verifica variabili ambiente
  const requiredEnvVars = ["SUPABASE_URL", "SUPABASE_SERVICE_KEY", "JWT_SECRET"]
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error("❌ Variabili ambiente mancanti:", missingVars)
    console.log("💡 Assicurati che il file .env contenga:")
    missingVars.forEach((varName) => {
      console.log(`   ${varName}=your-value-here`)
    })
    return false
  }

  console.log("✅ Variabili ambiente OK")
  console.log(`📍 Supabase URL: ${process.env.SUPABASE_URL}`)
  console.log(`🔑 Service Key: ${process.env.SUPABASE_SERVICE_KEY ? "Configurata" : "Mancante"}`)

  return true
}

async function testDatabaseConnection() {
  console.log("🔌 === TEST CONNESSIONE DATABASE ===")

  try {
    // Test connessione base
    const { data, error } = await supabaseAdmin.from("users").select("count(*)").single()

    if (error) {
      console.error("❌ Errore connessione:", error)
      return false
    }

    console.log("✅ Connessione Supabase OK")
    return true
  } catch (error) {
    console.error("❌ Errore connessione database:", error)
    return false
  }
}

async function testTableStructure() {
  console.log("\n📋 === TEST STRUTTURA TABELLE ===")

  try {
    // Test tabella users
    console.log("👤 Test tabella users...")
    const { data: users, error: usersError } = await supabaseAdmin.from("users").select("*").limit(1)

    if (usersError && usersError.code !== "PGRST116") {
      // PGRST116 = no rows
      console.error("❌ Errore tabella users:", usersError)
    } else {
      console.log("✅ Tabella users OK")
    }

    // Test tabella expenses
    console.log("💰 Test tabella expenses...")
    const { data: expenses, error: expensesError } = await supabaseAdmin.from("expenses").select("*").limit(1)

    if (expensesError && expensesError.code !== "PGRST116") {
      console.error("❌ Errore tabella expenses:", expensesError)
    } else {
      console.log("✅ Tabella expenses OK")
    }
  } catch (error) {
    console.error("❌ Errore test struttura:", error)
  }
}

async function testCRUDOperations() {
  console.log("\n🔄 === TEST OPERAZIONI CRUD ===")

  const testEmail = `test-db-${Date.now()}@example.com`
  const testPassword = await bcrypt.hash("password123", 12)
  let testUserId = null
  let testExpenseId = null

  try {
    // CREATE USER
    console.log("➕ Test CREATE user...")
    const { data: newUser, error: createError } = await supabaseAdmin
      .from("users")
      .insert([{ email: testEmail, password: testPassword }])
      .select()
      .single()

    if (createError) {
      console.error("❌ Errore create user:", createError)
      return
    }

    testUserId = newUser.id
    console.log("✅ User creato:", testUserId)

    // READ USER
    console.log("📖 Test READ user...")
    const { data: readUser, error: readError } = await supabaseAdmin
      .from("users")
      .select("id, email, created_at")
      .eq("id", testUserId)
      .single()

    if (readError) {
      console.error("❌ Errore read user:", readError)
    } else {
      console.log("✅ User letto:", readUser.email)
    }

    // CREATE EXPENSE
    console.log("💰 Test CREATE expense...")
    const { data: newExpense, error: expenseCreateError } = await supabaseAdmin
      .from("expenses")
      .insert([
        {
          title: "Test Database Expense",
          amount: 25.5,
          category: "Altro",
          date: "2024-01-15",
          user_id: testUserId,
        },
      ])
      .select()
      .single()

    if (expenseCreateError) {
      console.error("❌ Errore create expense:", expenseCreateError)
    } else {
      testExpenseId = newExpense.id
      console.log("✅ Expense creata:", testExpenseId)
    }

    // READ EXPENSES
    console.log("📋 Test READ expenses...")
    const { data: expenses, error: expensesReadError } = await supabaseAdmin
      .from("expenses")
      .select("*")
      .eq("user_id", testUserId)

    if (expensesReadError) {
      console.error("❌ Errore read expenses:", expensesReadError)
    } else {
      console.log("✅ Expenses lette:", expenses.length)
    }

    // UPDATE EXPENSE
    if (testExpenseId) {
      console.log("✏️ Test UPDATE expense...")
      const { data: updatedExpense, error: updateError } = await supabaseAdmin
        .from("expenses")
        .update({ title: "Test Database Expense UPDATED", amount: 35.75 })
        .eq("id", testExpenseId)
        .select()
        .single()

      if (updateError) {
        console.error("❌ Errore update expense:", updateError)
      } else {
        console.log("✅ Expense aggiornata:", updatedExpense.title)
      }
    }

    // DELETE EXPENSE
    if (testExpenseId) {
      console.log("🗑️ Test DELETE expense...")
      const { error: deleteExpenseError } = await supabaseAdmin.from("expenses").delete().eq("id", testExpenseId)

      if (deleteExpenseError) {
        console.error("❌ Errore delete expense:", deleteExpenseError)
      } else {
        console.log("✅ Expense eliminata")
      }
    }

    // DELETE USER (cleanup)
    console.log("🧹 Cleanup test user...")
    const { error: deleteUserError } = await supabaseAdmin.from("users").delete().eq("id", testUserId)

    if (deleteUserError) {
      console.error("❌ Errore delete user:", deleteUserError)
    } else {
      console.log("✅ Test user eliminato")
    }
  } catch (error) {
    console.error("❌ Errore test CRUD:", error)
  }
}

async function testConstraints() {
  console.log("\n🛡️ === TEST CONSTRAINTS E VALIDAZIONI ===")

  try {
    // Test email duplicata
    console.log("📧 Test email duplicata...")
    const testEmail = `duplicate-${Date.now()}@example.com`

    // Crea primo user
    await supabaseAdmin.from("users").insert([{ email: testEmail, password: "hash123" }])

    // Prova a creare secondo user con stessa email
    const { error: duplicateError } = await supabaseAdmin
      .from("users")
      .insert([{ email: testEmail, password: "hash456" }])

    if (duplicateError && duplicateError.code === "23505") {
      console.log("✅ Constraint email unica funziona")
    } else {
      console.log("❌ Constraint email unica non funziona")
    }

    // Cleanup
    await supabaseAdmin.from("users").delete().eq("email", testEmail)

    // Test categoria invalida
    console.log("🏷️ Test categoria invalida...")
    const { error: categoryError } = await supabaseAdmin.from("expenses").insert([
      {
        title: "Test",
        amount: 10,
        category: "CategoriaInesistente",
        date: "2024-01-15",
        user_id: "00000000-0000-0000-0000-000000000000", // UUID fake
      },
    ])

    if (categoryError && categoryError.code === "23514") {
      console.log("✅ Constraint categoria funziona")
    } else {
      console.log("❌ Constraint categoria non funziona")
    }

    // Test importo negativo
    console.log("💸 Test importo negativo...")
    const { error: amountError } = await supabaseAdmin.from("expenses").insert([
      {
        title: "Test",
        amount: -10,
        category: "Altro",
        date: "2024-01-15",
        user_id: "00000000-0000-0000-0000-000000000000",
      },
    ])

    if (amountError && amountError.code === "23514") {
      console.log("✅ Constraint importo positivo funziona")
    } else {
      console.log("❌ Constraint importo positivo non funziona")
    }
  } catch (error) {
    console.error("❌ Errore test constraints:", error)
  }
}

async function runDatabaseTests() {
  console.log("🧪 === INIZIO TEST DATABASE SUPABASE ===\n")

  // Aggiungi controllo configurazione
  const configOk = await checkConfiguration()
  if (!configOk) {
    console.log("❌ Impossibile continuare senza configurazione corretta")
    return
  }

  const isConnected = await testDatabaseConnection()
  if (!isConnected) {
    console.log("❌ Impossibile continuare senza connessione database")
    return
  }

  await testTableStructure()
  await testCRUDOperations()
  await testConstraints()

  console.log("\n✅ === TEST DATABASE COMPLETATI ===")
  console.log("Se tutti i test sono OK, il database Supabase è configurato correttamente!")
}

// Avvia test database
runDatabaseTests()
