import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Carica variabili ambiente
dotenv.config()

// Import routes
import authRoutes from "./routes/auth.js"
import expenseRoutes from "./routes/expenses.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.static(path.join(__dirname, "client/dist")))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/expenses", expenseRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "🚀 Expense Tracker Server Running!",
    timestamp: new Date().toISOString(),
    database: "Supabase PostgreSQL",
    version: "1.0.0",
    status: "healthy",
  })
})

// Serve frontend per production (commentato per ora)
// app.get("*", (req, res) => {
//   if (req.path.startsWith("/api")) {
//     return res.status(404).json({ message: "API route non trovata" })
//   }
//   res.sendFile(path.join(__dirname, "client/dist/index.html"))
// })

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack)
  res.status(500).json({
    message: "Errore interno del server",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`
🎉 ===================================
🚀 EXPENSE TRACKER SERVER AVVIATO!
🌐 URL: http://localhost:${PORT}
📊 Database: Supabase PostgreSQL
🔧 Ambiente: ${process.env.NODE_ENV || "development"}
===================================
  `)

  console.log("📋 API Endpoints disponibili:")
  console.log("   GET  /api/health")
  console.log("   POST /api/auth/signup")
  console.log("   POST /api/auth/login")
  console.log("   GET  /api/expenses")
  console.log("   POST /api/expenses")
  console.log("   PUT  /api/expenses/:id")
  console.log("   DELETE /api/expenses/:id")

  console.log("\n🎯 Prossimi passi:")
  console.log("   1. Apri http://localhost:3000/api/health per test")
  console.log("   2. Avvia frontend: cd client && npm run dev")
  console.log("   3. Apri app: http://localhost:5173")
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Server shutting down gracefully...")
  process.exit(0)
})
