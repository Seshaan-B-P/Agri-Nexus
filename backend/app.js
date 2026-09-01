const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const farmRoutes = require("./routes/farmRoutes");
const cropRoutes = require("./routes/cropRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const taskRoutes = require("./routes/taskRoutes");
const aiAssistantRoutes = require("./routes/aiAssistantRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const yieldRoutes = require("./routes/yieldRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Static Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Agri Nexus API Running",
  });
});

// API Endpoint Routes
app.use("/api/auth", authRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai-assistant", aiAssistantRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/yield", yieldRoutes);
app.use("/api/expenses", expenseRoutes);

module.exports = app;
