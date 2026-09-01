const Farm = require("../models/Farm");

// @desc    Add New Farm
// @route   POST /api/farms
// @access  Private
const addFarm = async (req, res) => {
  try {
    const {
      farmName,
      location,
      area,
      areaUnit,
      soilType,
      waterSource,
      cropType,
      latitude,
      longitude,
      description,
    } = req.body;

    // Validation
    if (!farmName || !location || !area || !soilType || !waterSource) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const farm = await Farm.create({
      farmer: req.user._id,
      farmName,
      location,
      area,
      areaUnit,
      soilType,
      waterSource,
      cropType,
      latitude,
      longitude,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Farm added successfully",
      farm,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get All Farms of Logged-in User
// @route   GET /api/farms
// @access  Private
const getMyFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ farmer: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: farms.length,
      farms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get Single Farm
// @route   GET /api/farms/:id
// @access  Private
const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    res.status(200).json({
      success: true,
      farm,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update Farm
// @route   PUT /api/farms/:id
// @access  Private
const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    const updatedFarm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Farm updated successfully",
      farm: updatedFarm,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete Farm
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    await Farm.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Farm deleted successfully",
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
  addFarm,
  getMyFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
};
