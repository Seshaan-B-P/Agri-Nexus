import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaTractor,
  FaSeedling,
  FaFlask,
  FaCloudSun,
  FaSync,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCoins,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { getFarms } from "../services/farmService";
import { getCrops } from "../services/cropService";
import { predictYield } from "../services/yieldService";

function YieldPrediction() {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);

  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [selectedCropId, setSelectedCropId] = useState("");

  const [formData, setFormData] = useState({
    crop: "Paddy",
    area: 1,
    soilType: "Loamy",
    ph: 6.5,
    N: 50,
    P: 20,
    K: 20,
    rainfall: 150,
    temperature: 25,
    humidity: 75,
    season: "Kharif",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadFarmsAndCrops();
  }, []);

  const loadFarmsAndCrops = async () => {
    try {
      const [farmRes, cropRes] = await Promise.allSettled([
        getFarms(),
        getCrops(),
      ]);

      if (farmRes.status === "fulfilled") setFarms(farmRes.value.farms || []);
      if (cropRes.status === "fulfilled") setCrops(cropRes.value.crops || []);
    } catch (err) {
      console.error("Load farms/crops error:", err);
    }
  };

  const handleFarmChange = (farmId) => {
    setSelectedFarmId(farmId);
    const farm = farms.find((f) => f._id === farmId);
    if (farm) {
      setFormData((prev) => ({
        ...prev,
        area: farm.area || 1,
        soilType: farm.soilType || "Loamy",
      }));
    }
  };

  const handleCropChange = (cropId) => {
    setSelectedCropId(cropId);
    const c = crops.find((item) => item._id === cropId);
    if (c) {
      setFormData((prev) => ({
        ...prev,
        crop: c.cropName || "Paddy",
        season: c.season || "Kharif",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "crop" || name === "soilType" || name === "season" ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.crop || formData.area <= 0) {
      setErrorMsg("Please enter a valid crop name and positive farm area.");
      return;
    }

    try {
      setLoading(true);
      const res = await predictYield(formData);
      if (res && res.success) {
        setResult(res);
        toast.success("Crop yield prediction calculated! 📈");
      } else {
        setErrorMsg(res?.message || "Failed to generate yield prediction.");
      }
    } catch (err) {
      console.error("Yield prediction error:", err);
      setErrorMsg(err.response?.data?.message || "Error connecting to yield service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <FaChartLine className="text-emerald-600" /> Crop Yield Prediction
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Estimate harvest yield per acre and total field production using regression machine learning algorithms.
        </p>
      </div>

      {/* Auto pre-fill selector bar */}
      {(farms.length > 0 || crops.length > 0) && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xs space-y-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <FaTractor className="text-emerald-600" /> Pre-fill from Registered Farms & Crops
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Select Farm
              </label>
              <select
                value={selectedFarmId}
                onChange={(e) => handleFarmChange(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none"
              >
                <option value="">Select a farm...</option>
                {farms.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.farmName} ({f.area} {f.areaUnit || "Acres"}, {f.soilType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Select Crop
              </label>
              <select
                value={selectedCropId}
                onChange={(e) => handleCropChange(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none"
              >
                <option value="">Select a crop...</option>
                {crops.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.cropName} ({c.season})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Prediction Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
        {errorMsg && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <FaExclamationTriangle className="text-red-500" /> {errorMsg}
          </div>
        )}

        {/* 1. Basic Field Information */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaSeedling className="text-emerald-600" /> 1. Crop & Acreage Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Crop Name
              </label>
              <input
                type="text"
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Farm Area (Acres)
              </label>
              <input
                type="number"
                name="area"
                min="0.1"
                step="0.5"
                value={formData.area}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Season
              </label>
              <select
                name="season"
                value={formData.season}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
                <option value="All Season">All Season</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Soil Type
              </label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Clay">Clay</option>
                <option value="Loamy">Loamy</option>
                <option value="Sandy">Sandy</option>
                <option value="Black">Black</option>
                <option value="Red">Red</option>
                <option value="Alluvial">Alluvial</option>
                <option value="Laterite">Laterite</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Soil & Climate Conditions */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaFlask className="text-purple-600" /> 2. Soil Nutrients & Climate Inputs
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase mb-1">
                N (kg/ha)
              </label>
              <input
                type="number"
                name="N"
                value={formData.N}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase mb-1">
                P (kg/ha)
              </label>
              <input
                type="number"
                name="P"
                value={formData.P}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase mb-1">
                K (kg/ha)
              </label>
              <input
                type="number"
                name="K"
                value={formData.K}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase mb-1">
                pH
              </label>
              <input
                type="number"
                name="ph"
                step="0.1"
                value={formData.ph}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase mb-1">
                Rainfall (mm)
              </label>
              <input
                type="number"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase mb-1">
                Temp (°C)
              </label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-700 uppercase mb-1">
                Humidity (%)
              </label>
              <input
                type="number"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? <FaSync className="animate-spin" /> : <FaChartLine />}
            <span>{loading ? "Calculating Regression Model..." : "Predict Crop Yield"}</span>
          </button>
        </div>
      </form>

      {/* Prediction Output Card */}
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Yield per Acre Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-3">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                Predicted Yield Rate
              </span>
              <h3 className="text-4xl font-black text-slate-800 mt-2">
                {result.yieldPerAcre} <span className="text-base text-slate-400 font-bold">{result.unit} / acre</span>
              </h3>
              <p className="text-xs text-slate-500">Expected production density for {formData.crop}.</p>
            </div>

            {/* Total Yield Card */}
            <div className="bg-gradient-to-br from-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                Total Estimated Harvest
              </span>
              <h3 className="text-4xl font-black text-amber-400 mt-2">
                {result.totalYield} <span className="text-base text-emerald-200 font-bold">{result.unit}</span>
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Total output across {formData.area} {formData.area === 1 ? "acre" : "acres"}.
              </p>
            </div>
          </div>

          {/* Model Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
            <FaInfoCircle className="text-amber-600 text-lg flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold uppercase tracking-wider text-[10px]">Prediction Disclaimer</h4>
              <p className="mt-0.5 leading-relaxed">
                Estimated yield based on available inputs and historical regression training data. Actual harvest yields may vary according to microclimate events and field management practices.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YieldPrediction;
