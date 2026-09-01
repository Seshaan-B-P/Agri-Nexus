const Crop = require("../models/Crop");
const Farm = require("../models/Farm");

// @desc    Add Crop
// @route   POST /api/crops
// @access  Private
const addCrop = async (req, res) => {
  try {
    const {
      farm,
      cropName,
      variety,
      season,
      sowingDate,
      expectedHarvestDate,
      status,
      cropImage,
      notes,
    } = req.body;

    // Validation
    if (!farm || !cropName || !season || !sowingDate || !expectedHarvestDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Verify farm belongs to logged-in user
    const farmExists = await Farm.findOne({
      _id: farm,
      farmer: req.user._id,
    });

    if (!farmExists) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    const crop = await Crop.create({
      farmer: req.user._id,
      farm,
      cropName,
      variety,
      season,
      sowingDate,
      expectedHarvestDate,
      status,
      cropImage,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Crop added successfully",
      crop,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get My Crops
// @route   GET /api/crops
// @access  Private
const getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({
      farmer: req.user._id,
    })
      .populate("farm", "farmName location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: crops.length,
      crops,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get Single Crop
// @route   GET /api/crops/:id
// @access  Private
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    }).populate("farm", "farmName location");

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    res.status(200).json({
      success: true,
      crop,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update Crop
// @route   PUT /api/crops/:id
// @access  Private
const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    // If farm is being changed, verify ownership
    if (req.body.farm) {
      const farmExists = await Farm.findOne({
        _id: req.body.farm,
        farmer: req.user._id,
      });

      if (!farmExists) {
        return res.status(404).json({
          success: false,
          message: "Farm not found",
        });
      }
    }

    const updatedCrop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("farm", "farmName location");

    res.status(200).json({
      success: true,
      message: "Crop updated successfully",
      crop: updatedCrop,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete Crop
// @route   DELETE /api/crops/:id
// @access  Private
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    await Crop.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Crop deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addCrop,
  getMyCrops,
  getCropById,
  updateCrop,
  deleteCrop,
};
