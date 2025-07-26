import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Titolo è richiesto"],
      trim: true,
      maxlength: [100, "Titolo non può superare 100 caratteri"],
    },
    amount: {
      type: Number,
      required: [true, "Importo è richiesto"],
      min: [0.01, "Importo deve essere maggiore di 0"],
    },
    category: {
      type: String,
      required: [true, "Categoria è richiesta"],
      enum: ["Alimentari", "Trasporti", "Intrattenimento", "Salute", "Casa", "Lavoro", "Altro"],
      default: "Altro",
    },
    date: {
      type: Date,
      required: [true, "Data è richiesta"],
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID è richiesto"],
    },
  },
  {
    timestamps: true,
  },
)

// Index per migliorare performance query
expenseSchema.index({ userId: 1, date: -1 })

export default mongoose.model("Expense", expenseSchema)
