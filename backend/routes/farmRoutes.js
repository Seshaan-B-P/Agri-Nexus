const express = require("express");
const router = express.Router();

const {
  addFarm,
  getMyFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
} = require("../controllers/farmController");

const { protect } = require("../middleware/authMiddleware");

// All farm routes are protected
router.post("/", protect, addFarm);

router.get("/", protect, getMyFarms);

router.get("/:id", protect, getFarmById);

router.put("/:id", protect, updateFarm);

router.delete("/:id", protect, deleteFarm);

module.exports = router;
