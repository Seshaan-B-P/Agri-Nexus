const express = require("express");
const router = express.Router();
const { getReportAnalytics } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

// Protected Report Analytics Route
router.get("/analytics", protect, getReportAnalytics);

module.exports = router;
