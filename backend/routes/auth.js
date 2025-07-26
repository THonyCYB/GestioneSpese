import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "../lib/supabase.js"

const router = express.Router()

// Genera JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// POST /api/auth/signup - Registrazione utente
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validazione input
    if (!email || !password) {
      return res.status(400).json({ message: "Email e password sono richiesti" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password deve essere almeno 6 caratteri" })
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email non valida" })
    }

    // Controlla se utente esiste già
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single()

    if (existingUser) {
      return res.status(400).json({ message: "Utente già registrato con questa email" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Crea nuovo utente
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert([
        {
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      ])
      .select("id, email, created_at")
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return res.status(500).json({ message: "Errore durante la registrazione" })
    }

    // Genera token
    const token = generateToken(user.id)

    res.status(201).json({
      message: "Utente registrato con successo",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Errore signup:", error)
    res.status(500).json({ message: "Errore server durante registrazione" })
  }
})

// POST /api/auth/login - Login utente
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validazione input
    if (!email || !password) {
      return res.status(400).json({ message: "Email e password sono richiesti" })
    }

    // Trova utente
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, password, created_at")
      .eq("email", email.toLowerCase())
      .single()

    if (error || !user) {
      return res.status(401).json({ message: "Credenziali non valide" })
    }

    // Verifica password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenziali non valide" })
    }

    // Genera token
    const token = generateToken(user.id)

    res.json({
      message: "Login effettuato con successo",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Errore login:", error)
    res.status(500).json({ message: "Errore server durante login" })
  }
})

export default router
