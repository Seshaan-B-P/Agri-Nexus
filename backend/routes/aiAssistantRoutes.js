const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getChatHistory,
  clearChatHistory,
} = require("../controllers/aiAssistantController");

// All routes use protect middleware
router.post("/chat", protect, sendMessage);
router.get("/history/:sessionId", protect, getChatHistory);
router.delete("/history/:sessionId", protect, clearChatHistory);

module.exports = router;
