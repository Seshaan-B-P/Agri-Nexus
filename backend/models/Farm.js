const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmName: {
      type: String,
      required: [true, "Farm name is required"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    area: {
      type: Number,
      required: [true, "Farm area is required"],
    },

    areaUnit: {
      type: String,
      enum: ["Acres", "Hectares"],
      default: "Acres",
    },

    soilType: {
      type: String,
      enum: [
        "Clay",
        "Sandy",
        "Loamy",
        "Silty",
        "Black",
        "Red",
        "Alluvial",
        "Laterite",
      ],
      required: true,
    },

    waterSource: {
      type: String,
      enum: [
        "Borewell",
        "Canal",
        "River",
        "Rainwater",
        "Pond",
        "Tank",
        "Other",
      ],
      required: true,
    },

    cropType: {
      type: String,
      default: "",
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    description: {
      type: String,
      default: "",
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

module.exports = mongoose.model("Farm", farmSchema);
