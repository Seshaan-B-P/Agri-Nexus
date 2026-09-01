const { predictYield } = require("../services/yieldPredictionService");

// =======================
// Predict Yield
// =======================
const getYieldPrediction = async (req, res) => {
  try {
    const { crop, area, soilType, ph, N, P, K, rainfall, temperature, humidity, season } = req.body;

    if (!crop || !area) {
      return res.status(400).json({
        success: false,
        message: "Crop name and farm area are required.",
      });
    }

    const result = await predictYield({
      crop,
      area: Number(area),
      soilType: soilType || "Loamy",
      ph: Number(ph || 6.5),
      N: Number(N || 50),
      P: Number(P || 20),
      K: Number(K || 20),
      rainfall: Number(rainfall || 150),
      temperature: Number(temperature || 25),
      humidity: Number(humidity || 75),
      season: season || "Kharif",
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Yield Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getYieldPrediction,
};
