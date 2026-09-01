const express = require("express");
const router = express.Router();

const {
  predictDisease,
  getHistory,
  getPrediction,
  deletePrediction,
} = require("../controllers/diseaseController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Upload image & predict disease
router.post(
  "/predict",
  protect,
  upload.single("image"),
  predictDisease
);

// Get prediction history
router.get(
  "/history",
  protect,
  getHistory
);

// Get single prediction
router.get(
  "/:id",
  protect,
  getPrediction
);

// Delete prediction
router.delete(
  "/:id",
  protect,
  deletePrediction
);

module.exports = router;