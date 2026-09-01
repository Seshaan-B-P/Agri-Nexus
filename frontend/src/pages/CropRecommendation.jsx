import { useEffect, useState } from "react";
import {
  FaSeedling,
  FaRobot,
  FaFlask,
  FaCloudSun,
  FaTractor,
  FaCheckCircle,
  FaInfoCircle,
  FaSync,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { getFarms } from "../services/farmService";
import { getWeather } from "../services/weatherService";
import { getCropRecommendation } from "../services/recommendationService";

function CropRecommendation() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");

  const [formData, setFormData] = useState({
    N: 90,
    P: 42,
    K: 43,
    temperature: 25,
    humidity: 80,
    ph: 6.5,
    rainfall: 200,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const res = await getFarms();
      if (res.farms) {
        setFarms(res.farms);
      }
    } catch (err) {
      console.error("Load farms error:", err);
    }
  };

  const handleUseFarmData = async () => {
    if (!selectedFarm) {
      toast.error("Please select a farm first.");
      return;
    }

    const farm = farms.find((f) => f._id === selectedFarm);
    if (!farm) return;

    // Soil heuristics per soil type
    const soilPresets = {
      Clay: { N: 90, P: 45, K: 50, ph: 6.8 },
      Sandy: { N: 40, P: 20, K: 30, ph: 6.2 },
      Loamy: { N: 85, P: 50, K: 45, ph: 6.5 },
      Silty: { N: 75, P: 40, K: 40, ph: 6.6 },
      Black: { N: 100, P: 55, K: 60, ph: 7.2 },
      Red: { N: 50, P: 30, K: 35, ph: 5.8 },
      Alluvial: { N: 95, P: 60, K: 50, ph: 7.0 },
      Laterite: { N: 45, P: 25, K: 30, ph: 5.5 },
    };

    const preset = soilPresets[farm.soilType] || { N: 70, P: 40, K: 40, ph: 6.5 };

    // Fetch live weather if farm has lat/lon
    let temp = 26;
    let hum = 75;
    let rain = 160;

    if (farm.latitude && farm.longitude) {
      const weatherData = await getWeather(farm.latitude, farm.longitude);
      if (weatherData && weatherData.current) {
        temp = weatherData.current.temperature || 26;
        hum = weatherData.current.humidity || 75;
        rain = weatherData.current.precipitation > 0 ? weatherData.current.precipitation * 20 : 160;
      }
    }

    setFormData({
      N: preset.N,
      P: preset.P,
      K: preset.K,
      temperature: temp,
      humidity: hum,
      ph: preset.ph,
      rainfall: rain,
    });

    toast.success(`Pre-filled data from farm: ${farm.farmName} (${farm.soilType} Soil)`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.ph < 0 || formData.ph > 14) {
      setErrorMsg("Soil pH must be between 0 and 14.");
      return;
    }

    try {
      setLoading(true);
      const res = await getCropRecommendation(formData);
      if (res && res.success) {
        setResult(res);
        toast.success("Crop recommendation generated! 🌱");
      } else {
        setErrorMsg(res?.message || "Failed to generate recommendation.");
      }
    } catch (err) {
      console.error("Recommendation submit error:", err);
      setErrorMsg(err.response?.data?.message || "Error connecting to recommendation service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <FaSeedling className="text-emerald-600" /> AI Crop Recommendation System
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Machine learning powered crop matching based on soil N-P-K nutrients, pH, and environmental climate parameters.
        </p>
      </div>

      {/* Auto pre-fill bar */}
      {farms.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaTractor className="text-emerald-700 text-xl flex-shrink-0" />
            <div>
              <h3 className="text-xs font-black text-emerald-900">Use Saved Farm Profile Data</h3>
              <p className="text-[11px] text-emerald-700 font-medium">Auto-fill soil nutrients & weather coordinates</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
              className="border border-emerald-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-white outline-none"
            >
              <option value="">Select a Farm...</option>
              {farms.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.farmName} ({f.soilType})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleUseFarmData}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition flex-shrink-0"
            >
              Use Farm Data
            </button>
          </div>
        </div>
      )}

      {/* Form Input Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
        {errorMsg && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <FaExclamationTriangle className="text-red-500" /> {errorMsg}
          </div>
        )}

        {/* Soil Information Section */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaFlask className="text-purple-600" /> 1. Soil Chemical Properties
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Nitrogen (N)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="N"
                  min="0"
                  max="200"
                  value={formData.N}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-xs font-bold text-slate-400">kg/ha</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Phosphorus (P)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="P"
                  min="0"
                  max="200"
                  value={formData.P}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-xs font-bold text-slate-400">kg/ha</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Potassium (K)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="K"
                  min="0"
                  max="300"
                  value={formData.K}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-xs font-bold text-slate-400">kg/ha</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Soil pH
              </label>
              <input
                type="number"
                name="ph"
                min="0"
                max="14"
                step="0.1"
                value={formData.ph}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Environmental Climate Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaCloudSun className="text-amber-500" /> 2. Environmental & Climate Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Temperature (°C)
              </label>
              <input
                type="number"
                name="temperature"
                min="-10"
                max="60"
                step="0.5"
                value={formData.temperature}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Relative Humidity (%)
              </label>
              <input
                type="number"
                name="humidity"
                min="0"
                max="100"
                value={formData.humidity}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Annual Rainfall (mm)
              </label>
              <input
                type="number"
                name="rainfall"
                min="0"
                max="1000"
                value={formData.rainfall}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? <FaSync className="animate-spin" /> : <FaRobot />}
            <span>{loading ? "Analyzing Machine Learning Model..." : "Get AI Crop Recommendation"}</span>
          </button>
        </div>
      </form>

      {/* Result Display Box */}
      {result && (
        <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Top ML Recommended Crop
              </span>
              <h2 className="text-4xl sm:text-5xl font-black flex items-center gap-3">
                🌾 {result.recommendedCrop}
              </h2>
              <p className="text-xs text-emerald-100 flex items-center gap-1.5 pt-1">
                <FaCheckCircle className="text-emerald-400" />
                <span>{result.reason}</span>
              </p>
            </div>

            {/* Confidence Badge */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center min-w-[140px]">
              <p className="text-[10px] font-extrabold uppercase text-emerald-200">Confidence Score</p>
              <h3 className="text-4xl font-black text-amber-400 mt-1">{result.confidence}%</h3>
              <span className="text-[9px] text-emerald-200 font-bold uppercase tracking-wider mt-1 block">
                {result.provider || "ML Model"}
              </span>
            </div>
          </div>

          {/* Alternative Crops Grid */}
          {result.alternativeCrops && result.alternativeCrops.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Alternative Recommended Crops
              </h3>
              <div className="flex flex-wrap gap-3">
                {result.alternativeCrops.map((alt, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2"
                  >
                    <span>🌱 {alt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CropRecommendation;
