const express = require("express");
const router = express.Router();

const {
  addCrop,
  getMyCrops,
  getCropById,
  updateCrop,
  deleteCrop,
} = require("../controllers/cropController");

const { protect } = require("../middleware/authMiddleware");

// All crop routes are protected
router.post("/", protect, addCrop);

router.get("/", protect, getMyCrops);

router.get("/:id", protect, getCropById);

router.put("/:id", protect, updateCrop);

router.delete("/:id", protect, deleteCrop);

module.exports = router;
