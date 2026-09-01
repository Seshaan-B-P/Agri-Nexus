const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },

    cropName: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
    },

    variety: {
      type: String,
      default: "",
      trim: true,
    },

    season: {
      type: String,
      enum: ["Kharif", "Rabi", "Zaid", "Summer", "Winter", "All Season"],
      required: true,
    },

    sowingDate: {
      type: Date,
      required: true,
    },

    expectedHarvestDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Planned",
        "Planted",
        "Growing",
        "Flowering",
        "Harvest Ready",
        "Harvested",
      ],
      default: "Planted",
    },

    cropImage: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Crop", cropSchema);
