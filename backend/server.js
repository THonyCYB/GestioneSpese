import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// Carica variabili ambiente
dotenv.config()

// Import routes
import authRoutes from "./routes/auth.js"
import expenseRoutes from "./routes/expenses.js"

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL,  "https://thonycyb.github.io", "https://gestionespese.vercel.app", "https://gestionespese.netlify.app"]
  : ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)
app.use(express.json())

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

// 404 handler per API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API route non trovata" })
})

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
