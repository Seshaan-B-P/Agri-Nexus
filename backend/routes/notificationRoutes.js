const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// All notification routes are protected
router.use(protect);

router.get("/", getNotifications);
router.get("/unread", getUnreadNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);
router.delete("/", deleteAllNotifications);

module.exports = router;
