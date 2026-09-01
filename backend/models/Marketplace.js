const mongoose = require("mongoose");

const marketplaceSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Listing title is required"],
      trim: true,
    },

    itemType: {
      type: String,
      enum: ["Produce", "Seeds", "Equipment", "Fertilizer", "Other"],
      default: "Produce",
    },

    cropType: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
    },

    unit: {
      type: String,
      enum: ["kg", "Quintal", "Ton", "Piece", "Bag", "Acre"],
      default: "kg",
    },

    quantity: {
      type: Number,
      default: 1,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
    },

    contactPhone: {
      type: String,
      required: [true, "Contact phone is required"],
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Available", "Sold", "Reserved"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Marketplace", marketplaceSchema);
