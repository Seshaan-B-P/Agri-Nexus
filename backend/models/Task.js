const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      default: null,
    },

    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    taskType: {
      type: String,
      enum: ["Irrigation", "Fertilizer", "Pesticide", "Harvesting", "Pruning", "General"],
      default: "General",
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
