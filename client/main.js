// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost'
  ? "/api"  // Sviluppo locale con proxy
  : "https://gestionespese-backend.onrender.com/api"  // Produzione

// Controllo connessione all'avvio
async function checkConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    const data = await response.json()

    if (response.ok) {
      console.log("✅ Connessione backend OK:", data.message)
      return true
    } else {
      console.error("❌ Backend non raggiungibile")
      return false
    }
  } catch (error) {
    console.error("❌ Errore connessione backend:", error)
    return false
  }
}

// State Management
class AppState {
  constructor() {
    this.user = null
    this.token = localStorage.getItem("token")
    this.expenses = []
    this.currentPage = "welcome"
  }

  setUser(user, token) {
    this.user = user
    this.token = token
    localStorage.setItem("token", token)
  }

  clearUser() {
    this.user = null
    this.token = null
    localStorage.removeItem("token")
  }

  isAuthenticated() {
    return !!this.token
  }
}

// API Service
class ApiService {
  constructor(state) {
    this.state = state
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    if (this.state.token) {
      config.headers.Authorization = `Bearer ${this.state.token}`
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Errore nella richiesta")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Auth endpoints
  async signup(email, password) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  // Expense endpoints
  async getExpenses(filters = {}) {
    const params = new URLSearchParams()
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.append(key, filters[key])
    })

    const query = params.toString()
    return this.request(`/expenses${query ? `?${query}` : ""}`)
  }

  async createExpense(expense) {
    return this.request("/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
    })
  }

  async updateExpense(id, expense) {
    return this.request(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(expense),
    })
  }

  async deleteExpense(id) {
    return this.request(`/expenses/${id}`, {
      method: "DELETE",
    })
  }
}

// UI Service
class UIService {
  constructor() {
    this.currentPage = null
  }

  showPage(pageId) {
    console.log(`🔄 Switching to page: ${pageId}`)

    // Hide all pages
    const allPages = document.querySelectorAll(".page")
    console.log(`Found ${allPages.length} pages`)

    allPages.forEach((page) => {
      console.log(`Hiding page: ${page.id}`)
      page.classList.remove("active")
    })

    // Show target page
    const targetPage = document.getElementById(pageId)
    console.log(`Target page:`, targetPage)

    if (targetPage) {
      targetPage.classList.add("active")
      this.currentPage = pageId
      console.log(`✅ Successfully switched to ${pageId}`)
    } else {
      console.error(`❌ Page ${pageId} not found`)
    }
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container")
    const toast = document.createElement("div")
    toast.className = `toast ${type}`
    toast.textContent = message

    container.appendChild(toast)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 5000)
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.remove("hidden")
    }
  }

  hideModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.add("hidden")
    }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  formatDate(date) {
    return new Intl.DateTimeFormat("it-IT").format(new Date(date))
  }

  setLoading(elementId, isLoading) {
    const element = document.getElementById(elementId)
    if (element) {
      if (isLoading) {
        element.classList.remove("hidden")
      } else {
        element.classList.add("hidden")
      }
    }
  }
}

// Main App Class
class ExpenseTracker {
  constructor() {
    this.state = new AppState()
    this.api = new ApiService(this.state)
    this.ui = new UIService()
    this.currentFilters = {}

    this.init()
  }

  async init() {
    // Controlla connessione backend
    const connected = await checkConnection()
    if (!connected) {
      this.ui.showToast("Errore connessione backend. Verifica che il server sia avviato.", "error")
    }

    this.setupEventListeners()
    this.checkAuthStatus()
  }

  checkAuthStatus() {
    if (this.state.isAuthenticated()) {
      this.showDashboard()
    } else {
      this.ui.showPage("welcome-page")
    }
  }

  setupEventListeners() {
    // Welcome page
    console.log("🔧 Setting up event listeners...")

    const loginBtn = document.getElementById("login-btn")
    const signupBtn = document.getElementById("signup-btn")

    console.log("Login button:", loginBtn)
    console.log("Signup button:", signupBtn)

    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        console.log("🔘 Login button clicked!")
        this.ui.showPage("login-page")
      })
    } else {
      console.error("❌ Login button not found!")
    }

    if (signupBtn) {
      signupBtn.addEventListener("click", () => {
        console.log("🔘 Signup button clicked!")
        this.ui.showPage("signup-page")
      })
    } else {
      console.error("❌ Signup button not found!")
    }

    // Auth navigation
    document.getElementById("switch-to-signup").addEventListener("click", (e) => {
      e.preventDefault()
      this.ui.showPage("signup-page")
    })

    document.getElementById("switch-to-login").addEventListener("click", (e) => {
      e.preventDefault()
      this.ui.showPage("login-page")
    })

    document.getElementById("back-to-welcome-from-login").addEventListener("click", () => {
      this.ui.showPage("welcome-page")
    })

    document.getElementById("back-to-welcome-from-signup").addEventListener("click", () => {
      this.ui.showPage("welcome-page")
    })

    // Auth forms
    document.getElementById("login-form").addEventListener("submit", (e) => {
      this.handleLogin(e)
    })

    document.getElementById("signup-form").addEventListener("submit", (e) => {
      this.handleSignup(e)
    })

    // Dashboard
    document.getElementById("logout-btn").addEventListener("click", () => {
      this.handleLogout()
    })

    document.getElementById("expense-form").addEventListener("submit", (e) => {
      this.handleAddExpense(e)
    })

    // Filters
    document.getElementById("apply-filters").addEventListener("click", () => {
      this.applyFilters()
    })

    document.getElementById("clear-filters").addEventListener("click", () => {
      this.clearFilters()
    })

    // Modal
    document.getElementById("close-modal").addEventListener("click", () => {
      this.ui.hideModal("edit-modal")
    })

    document.getElementById("cancel-edit").addEventListener("click", () => {
      this.ui.hideModal("edit-modal")
    })

    document.getElementById("edit-expense-form").addEventListener("submit", (e) => {
      this.handleEditExpense(e)
    })

    // Set today's date as default
    const today = new Date().toISOString().split("T")[0]
    document.getElementById("expense-date").value = today
  }

  async handleLogin(e) {
    e.preventDefault()

    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value
    const submitBtn = e.target.querySelector('button[type="submit"]')

    try {
      submitBtn.disabled = true
      submitBtn.textContent = "Accesso in corso..."

      const response = await this.api.login(email, password)
      this.state.setUser(response.user, response.token)

      this.ui.showToast("Login effettuato con successo!", "success")
      this.showDashboard()
    } catch (error) {
      this.ui.showToast(error.message, "error")
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Accedi"
    }
  }

  async handleSignup(e) {
    e.preventDefault()

    const email = document.getElementById("signup-email").value
    const password = document.getElementById("signup-password").value
    const submitBtn = e.target.querySelector('button[type="submit"]')

    try {
      submitBtn.disabled = true
      submitBtn.textContent = "Registrazione in corso..."

      const response = await this.api.signup(email, password)
      this.state.setUser(response.user, response.token)

      this.ui.showToast("Registrazione completata con successo!", "success")
      this.showDashboard()
    } catch (error) {
      this.ui.showToast(error.message, "error")
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Registrati"
    }
  }

  handleLogout() {
    this.state.clearUser()
    this.ui.showToast("Logout effettuato", "info")
    this.ui.showPage("welcome-page")
  }

  async showDashboard() {
    this.ui.showPage("dashboard-page")

    if (this.state.user) {
      document.getElementById("user-email").textContent = this.state.user.email
    }

    await this.loadExpenses()
  }

  async handleAddExpense(e) {
    e.preventDefault()

    const expense = {
      title: document.getElementById("expense-title").value,
      amount: Number.parseFloat(document.getElementById("expense-amount").value),
      category: document.getElementById("expense-category").value,
      date: document.getElementById("expense-date").value,
    }

    const submitBtn = e.target.querySelector('button[type="submit"]')

    try {
      submitBtn.disabled = true
      submitBtn.textContent = "Aggiungendo..."

      await this.api.createExpense(expense)
      this.ui.showToast("Spesa aggiunta con successo!", "success")

      // Reset form
      e.target.reset()
      const today = new Date().toISOString().split("T")[0]
      document.getElementById("expense-date").value = today

      await this.loadExpenses()
    } catch (error) {
      this.ui.showToast(error.message, "error")
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Aggiungi Spesa"
    }
  }

  async loadExpenses() {
    try {
      this.ui.setLoading("loading", true)

      const response = await this.api.getExpenses(this.currentFilters)
      this.state.expenses = response.expenses

      this.renderExpenses(response.expenses)
      this.updateSummary(response.expenses, response.totalAmount)

      this.ui.setLoading("loading", false)

      if (response.expenses.length === 0) {
        document.getElementById("no-expenses").classList.remove("hidden")
      } else {
        document.getElementById("no-expenses").classList.add("hidden")
      }
    } catch (error) {
      this.ui.setLoading("loading", false)
      this.ui.showToast("Errore nel caricamento delle spese", "error")
    }
  }

  renderExpenses(expenses) {
    const container = document.getElementById("expenses-list")

    if (expenses.length === 0) {
      container.innerHTML = ""
      return
    }

    container.innerHTML = expenses
      .map(
        (expense) => `
      <div class="expense-item">
        <div class="expense-info">
          <h4>${expense.title}</h4>
          <div class="expense-meta">
            <span>📅 ${this.ui.formatDate(expense.date)}</span>
            <span>🏷️ ${expense.category}</span>
          </div>
        </div>
        <div class="expense-amount">${this.ui.formatCurrency(expense.amount)}</div>
        <div class="expense-actions">
          <button class="btn btn-edit" onclick="app.editExpense('${expense.id}')">
            Modifica
          </button>
          <button class="btn btn-danger" onclick="app.deleteExpense('${expense.id}')">
            Elimina
          </button>
        </div>
      </div>
    `,
      )
      .join("")
  }

  updateSummary(expenses, totalAmount) {
    document.getElementById("total-amount").textContent = this.ui.formatCurrency(totalAmount)
    document.getElementById("total-count").textContent = expenses.length
  }

  editExpense(id) {
    const expense = this.state.expenses.find((e) => e.id === id)
    if (!expense) return

    // Populate edit form
    document.getElementById("edit-expense-id").value = expense.id
    document.getElementById("edit-expense-title").value = expense.title
    document.getElementById("edit-expense-amount").value = expense.amount
    document.getElementById("edit-expense-category").value = expense.category
    document.getElementById("edit-expense-date").value = expense.date.split("T")[0]

    this.ui.showModal("edit-modal")
  }

  async handleEditExpense(e) {
    e.preventDefault()

    const id = document.getElementById("edit-expense-id").value
    const expense = {
      title: document.getElementById("edit-expense-title").value,
      amount: Number.parseFloat(document.getElementById("edit-expense-amount").value),
      category: document.getElementById("edit-expense-category").value,
      date: document.getElementById("edit-expense-date").value,
    }

    const submitBtn = e.target.querySelector('button[type="submit"]')

    try {
      submitBtn.disabled = true
      submitBtn.textContent = "Salvando..."

      await this.api.updateExpense(id, expense)
      this.ui.showToast("Spesa aggiornata con successo!", "success")
      this.ui.hideModal("edit-modal")

      await this.loadExpenses()
    } catch (error) {
      this.ui.showToast(error.message, "error")
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Salva Modifiche"
    }
  }

  async deleteExpense(id) {
    if (!confirm("Sei sicuro di voler eliminare questa spesa?")) {
      return
    }

    try {
      await this.api.deleteExpense(id)
      this.ui.showToast("Spesa eliminata con successo!", "success")
      await this.loadExpenses()
    } catch (error) {
      this.ui.showToast(error.message, "error")
    }
  }

  applyFilters() {
    this.currentFilters = {
      category: document.getElementById("filter-category").value,
      startDate: document.getElementById("filter-start-date").value,
      endDate: document.getElementById("filter-end-date").value,
    }

    // Remove empty filters
    Object.keys(this.currentFilters).forEach((key) => {
      if (!this.currentFilters[key] || this.currentFilters[key] === "all") {
        delete this.currentFilters[key]
      }
    })

    this.loadExpenses()
  }

  clearFilters() {
    this.currentFilters = {}
    document.getElementById("filter-category").value = "all"
    document.getElementById("filter-start-date").value = ""
    document.getElementById("filter-end-date").value = ""
    this.loadExpenses()
  }
}

// Initialize app quando DOM è pronto
document.addEventListener("DOMContentLoaded", () => {
  const app = new ExpenseTracker()

  // Make app globally available for onclick handlers
  window.app = app

  console.log("🎉 Expense Tracker inizializzato!")
})
