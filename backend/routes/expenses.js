import express from "express"
import { supabaseAdmin } from "../lib/supabase.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Applica middleware di autenticazione a tutte le rotte
router.use(authenticateToken)

// Categorie valide
const VALID_CATEGORIES = ["Alimentari", "Trasporti", "Intrattenimento", "Salute", "Casa", "Lavoro", "Altro"]

// GET /api/expenses - Ottieni tutte le spese dell'utente
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 50, category, startDate, endDate } = req.query
    const offset = (page - 1) * limit

    // Costruisci query base
    let query = supabaseAdmin
      .from("expenses")
      .select("*", { count: "exact" })
      .eq("user_id", req.user.id)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })

    // Applica filtri
    if (category && category !== "all" && VALID_CATEGORIES.includes(category)) {
      query = query.eq("category", category)
    }

    if (startDate) {
      query = query.gte("date", startDate)
    }

    if (endDate) {
      query = query.lte("date", endDate)
    }

    // Esegui query con paginazione
    const { data: expenses, error, count } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error("Supabase error:", error)
      return res.status(500).json({ message: "Errore durante il recupero delle spese" })
    }

    // Calcola totale importo
    let totalQuery = supabaseAdmin.from("expenses").select("amount").eq("user_id", req.user.id)

    if (category && category !== "all" && VALID_CATEGORIES.includes(category)) {
      totalQuery = totalQuery.eq("category", category)
    }
    if (startDate) totalQuery = totalQuery.gte("date", startDate)
    if (endDate) totalQuery = totalQuery.lte("date", endDate)

    const { data: totalData, error: totalError } = await totalQuery

    if (totalError) {
      console.error("Total calculation error:", totalError)
    }

    const totalAmount = totalData?.reduce((sum, expense) => sum + Number.parseFloat(expense.amount), 0) || 0

    res.json({
      expenses: expenses || [],
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
      },
      totalAmount,
    })
  } catch (error) {
    console.error("Errore recupero spese:", error)
    res.status(500).json({ message: "Errore server durante recupero spese" })
  }
})

// POST /api/expenses - Aggiungi nuova spesa
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body

    // Validazione input
    if (!title || !amount || !category) {
      return res.status(400).json({ message: "Titolo, importo e categoria sono richiesti" })
    }

    if (Number.parseFloat(amount) <= 0) {
      return res.status(400).json({ message: "Importo deve essere maggiore di 0" })
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Categoria non valida" })
    }

    if (title.length > 100) {
      return res.status(400).json({ message: "Titolo non può superare 100 caratteri" })
    }

    // Crea spesa
    const { data: expense, error } = await supabaseAdmin
      .from("expenses")
      .insert([
        {
          title: title.trim(),
          amount: Number.parseFloat(amount),
          category,
          date: date || new Date().toISOString().split("T")[0],
          user_id: req.user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return res.status(500).json({ message: "Errore durante l'aggiunta della spesa" })
    }

    res.status(201).json({
      message: "Spesa aggiunta con successo",
      expense,
    })
  } catch (error) {
    console.error("Errore aggiunta spesa:", error)
    res.status(500).json({ message: "Errore server durante aggiunta spesa" })
  }
})

// PUT /api/expenses/:id - Aggiorna spesa
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { title, amount, category, date } = req.body

    // Validazione input
    if (amount && Number.parseFloat(amount) <= 0) {
      return res.status(400).json({ message: "Importo deve essere maggiore di 0" })
    }

    if (category && !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Categoria non valida" })
    }

    if (title && title.length > 100) {
      return res.status(400).json({ message: "Titolo non può superare 100 caratteri" })
    }

    // Prepara dati per aggiornamento
    const updateData = {}
    if (title) updateData.title = title.trim()
    if (amount) updateData.amount = Number.parseFloat(amount)
    if (category) updateData.category = category
    if (date) updateData.date = date

    // Aggiorna spesa
    const { data: expense, error } = await supabaseAdmin
      .from("expenses")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return res.status(500).json({ message: "Errore durante l'aggiornamento della spesa" })
    }

    if (!expense) {
      return res.status(404).json({ message: "Spesa non trovata" })
    }

    res.json({
      message: "Spesa aggiornata con successo",
      expense,
    })
  } catch (error) {
    console.error("Errore aggiornamento spesa:", error)
    res.status(500).json({ message: "Errore server durante aggiornamento spesa" })
  }
})

// DELETE /api/expenses/:id - Elimina spesa
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const { data: expense, error } = await supabaseAdmin
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return res.status(500).json({ message: "Errore durante l'eliminazione della spesa" })
    }

    if (!expense) {
      return res.status(404).json({ message: "Spesa non trovata" })
    }

    res.json({ message: "Spesa eliminata con successo" })
  } catch (error) {
    console.error("Errore eliminazione spesa:", error)
    res.status(500).json({ message: "Errore server durante eliminazione spesa" })
  }
})

export default router
