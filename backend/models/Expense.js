const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      default: null,
    },

    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      default: null,
    },

    category: {
      type: String,
      enum: [
        "Seeds",
        "Fertilizer",
        "Pesticides",
        "Labour",
        "Irrigation",
        "Equipment",
        "Transport",
        "Electricity",
        "Other",
      ],
      default: "Other",
      required: true,
    },

    description: {
      type: String,
      required: [true, "Expense description is required"],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Expense amount is required"],
      min: [0, "Amount cannot be negative"],
    },

    date: {
      type: Date,
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Credit/Card", "Other"],
      default: "Cash",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
