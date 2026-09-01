const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  createListing,
  getListings,
  deleteListing,
} = require("../controllers/marketplaceController");

router.route("/")
  .get(protect, getListings)
  .post(protect, createListing);

router.route("/:id")
  .delete(protect, deleteListing);

module.exports = router;
