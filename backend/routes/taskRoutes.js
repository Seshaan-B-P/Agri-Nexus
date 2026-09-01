const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

router.route("/")
  .get(protect, getTasks)
  .post(protect, createTask);

router.route("/:id")
  .put(protect, updateTaskStatus)
  .delete(protect, deleteTask);

module.exports = router;
