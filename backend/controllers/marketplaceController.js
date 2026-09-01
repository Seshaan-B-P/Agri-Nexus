const Marketplace = require("../models/Marketplace");

// @desc    Create Marketplace Listing
// @route   POST /api/marketplace
// @access  Private
const createListing = async (req, res) => {
  try {
    const { title, itemType, cropType, price, unit, quantity, location, contactPhone, description, image } = req.body;

    if (!title || !price || !location || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const listing = await Marketplace.create({
      farmer: req.user._id,
      title,
      itemType: itemType || "Produce",
      cropType: cropType || "",
      price,
      unit: unit || "kg",
      quantity: quantity || 1,
      location,
      contactPhone,
      description: description || "",
      image: image || "",
    });

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get All Listings
// @route   GET /api/marketplace
// @access  Private / Public
const getListings = async (req, res) => {
  try {
    const listings = await Marketplace.find()
      .populate("farmer", "name phone email state district")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("Get listings error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete Listing
// @route   DELETE /api/marketplace/:id
// @access  Private
const deleteListing = async (req, res) => {
  try {
    const listing = await Marketplace.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check ownership
    if (listing.farmer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this listing",
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createListing,
  getListings,
  deleteListing,
};
