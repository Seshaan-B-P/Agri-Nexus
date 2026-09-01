const { predictCropRecommendation } = require("../services/recommendationService");

// =======================
// Recommend Crop
// =======================
const getRecommendation = async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

    if (
      N === undefined ||
      P === undefined ||
      K === undefined ||
      temperature === undefined ||
      humidity === undefined ||
      ph === undefined ||
      rainfall === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required inputs: N, P, K, temperature, humidity, ph, rainfall.",
      });
    }

    const result = await predictCropRecommendation({
      N: Number(N),
      P: Number(P),
      K: Number(K),
      temperature: Number(temperature),
      humidity: Number(humidity),
      ph: Number(ph),
      rainfall: Number(rainfall),
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Recommendation Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getRecommendation,
};
