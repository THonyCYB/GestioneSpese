import jwt from "jsonwebtoken"
import { supabaseAdmin } from "../lib/supabase.js"

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        message: "Token di accesso richiesto",
        code: "NO_TOKEN",
      })
    }

    // Verifica JWT token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (jwtError) {
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Token non valido", code: "INVALID_TOKEN" })
      }
      if (jwtError.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token scaduto", code: "EXPIRED_TOKEN" })
      }
      throw jwtError
    }

    // Ottieni user da Supabase
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, created_at")
      .eq("id", decoded.userId)
      .single()

    if (error || !user) {
      return res.status(401).json({
        message: "Utente non trovato",
        code: "USER_NOT_FOUND",
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(500).json({
      message: "Errore server durante autenticazione",
      code: "AUTH_ERROR",
    })
  }
}
