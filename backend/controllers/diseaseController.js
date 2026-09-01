const axios = require("axios");
const fs = require("fs");
const path = require("path");


const DiseaseHistory = require("../models/DiseaseHistory");
const Notification = require("../models/Notification");

// @desc    Predict crop disease
// @route   POST /api/disease/predict
// @access  Private
const predictDisease = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Farm:", req.body.farm);
    console.log("Crop:", req.body.crop);
    console.log("File:", req.file);
    const farm = req.body.farm || req.body.fram;
    const crop = req.body.crop;

    if (!farm || !crop) {
      return res.status(400).json({
        success: false,
        message: "Please provide both farm and crop IDs.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a crop image.",
      });
    }

    // Read uploaded image
    const imagePath = path.join(__dirname, "..", req.file.path);

    const imageBase64 = fs.readFileSync(imagePath, {
      encoding: "base64",
    });

    // Call Plant.id API
    const response = await axios.post(
      "https://plant.id/api/v3/health_assessment",
      {
        images: [imageBase64],
        latitude: 11.1271,
        longitude: 78.6569,
        similar_images: true,
      },
      {
        headers: {
          "Api-Key": process.env.PLANT_ID_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data.result;

    const disease =
      result.disease?.suggestions?.[0]?.name || "Healthy";

    const confidence =
      result.disease?.suggestions?.[0]?.probability || 0;

    const treatment =
      result.disease?.suggestions?.[0]?.treatment?.biological?.join(", ") ||
      "No treatment available.";

    const prevention =
      result.disease?.suggestions?.[0]?.prevention?.join(", ") ||
      "No prevention available.";

    const severity =
      confidence > 0.8
        ? "High"
        : confidence > 0.5
          ? "Medium"
          : "Low";

    // MongoDB Save
    const history = await DiseaseHistory.create({
      farmer: req.user.id,
      farm,
      crop,
      image: `/uploads/${req.file.filename}`,
      disease,
      confidence: Number((confidence * 100).toFixed(2)),
      severity,
      treatment,
      prevention,
      aiProvider: "Plant.id",
    });

    // Create automatic notification
    try {
      await Notification.create({
        user: req.user.id,
        title: "AI Crop Disease Alert 🧬",
        message: `Recent AI scan detected '${disease}' (${severity} Severity). Review treatment recommendations.`,
        type: "disease",
        priority: severity === "High" ? "high" : "medium",
        relatedId: history._id.toString(),
      });
    } catch (notifErr) {
      console.error("Failed to trigger disease notification:", notifErr);
    }

    return res.status(200).json({
      success: true,
      prediction: history,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get prediction history
// @route   GET /api/disease/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const history = await DiseaseHistory.find({
      farmer: req.user.id,
    })
      .populate("farm", "farmName")
      .populate("crop", "cropName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: history.length,
      history,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get one prediction
// @route   GET /api/disease/:id
// @access  Private
const getPrediction = async (req, res) => {
  try {
    const prediction = await DiseaseHistory.findById(req.params.id)
      .populate("farm", "farmName")
      .populate("crop", "cropName");

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found.",
      });
    }

    res.json({
      success: true,
      prediction,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete prediction
// @route   DELETE /api/disease/:id
// @access  Private
const deletePrediction = async (req, res) => {
  try {
    const prediction = await DiseaseHistory.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found.",
      });
    }

    await prediction.deleteOne();

    res.json({
      success: true,
      message: "Prediction deleted successfully.",
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
  predictDisease,
  getHistory,
  getPrediction,
  deletePrediction,
};