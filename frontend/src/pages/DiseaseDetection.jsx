import { useEffect, useState } from "react";
import { FaRobot, FaCloudUploadAlt, FaCheckCircle, FaExclamationTriangle, FaMedkit, FaShieldAlt, FaTractor, FaSeedling, FaImage } from "react-icons/fa";
import toast from "react-hot-toast";

import API from "../services/api";

function DiseaseDetection() {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);

  const [selectedFarm, setSelectedFarm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadFarms();
    loadCrops();
  }, []);

  const loadFarms = async () => {
    try {
      const res = await API.get("/farms");
      setFarms(res.data.farms || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCrops = async () => {
    try {
      const res = await API.get("/crops");
      setCrops(res.data.crops || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const filteredCrops = selectedFarm
    ? crops.filter((crop) => {
        const farmId = typeof crop.farm === "object" ? crop.farm._id : crop.farm;
        return farmId === selectedFarm;
      })
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCrop || !image) {
      toast.error("Please select a crop and upload a leaf image.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("farm", selectedFarm);
      formData.append("crop", selectedCrop);
      formData.append("image", image);

      const res = await API.post("/disease/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data.prediction);
      toast.success("AI Disease Scan completed successfully! 🌿");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "AI Analysis Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 text-9xl pointer-events-none">
          🤖
        </div>
        <div className="relative z-10 space-y-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-wider text-emerald-200">
            Plant.id AI Engine v3
          </span>
          <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
            <FaRobot className="text-emerald-400" /> AI Crop Disease Detection
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-xl">
            Upload an image of an affected leaf to receive instant diagnosis, confidence score, biological treatment plan, and prevention guidelines.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Farm */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FaTractor className="text-emerald-600" /> 1. Select Farm *
              </label>
              <select
                className="w-full border border-slate-300 rounded-xl p-3.5 text-sm font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                value={selectedFarm}
                onChange={(e) => {
                  setSelectedFarm(e.target.value);
                  setSelectedCrop("");
                }}
                required
              >
                <option value="">Choose Farm...</option>
                {farms.map((farm) => (
                  <option key={farm._id} value={farm._id}>
                    {farm.farmName} ({farm.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Crop */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FaSeedling className="text-blue-600" /> 2. Select Affected Crop *
              </label>
              <select
                className="w-full border border-slate-300 rounded-xl p-3.5 text-sm font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition disabled:opacity-50"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                disabled={!selectedFarm}
                required
              >
                <option value="">
                  {!selectedFarm ? "First select a farm above" : "Choose Crop..."}
                </option>
                {filteredCrops.map((crop) => (
                  <option key={crop._id} value={crop._id}>
                    {crop.cropName} ({crop.variety || 'Standard'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drag & Drop Image Upload Zone */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FaImage className="text-purple-600" /> 3. Upload Leaf Image *
            </label>

            <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl p-6 text-center transition-all cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {preview ? (
                <div className="flex flex-col items-center space-y-3">
                  <img
                    src={preview}
                    alt="Uploaded leaf preview"
                    className="w-48 h-48 object-cover rounded-xl shadow-md border-2 border-emerald-500"
                  />
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Image Selected (Click to change)
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <FaCloudUploadAlt />
                  </div>
                  <p className="text-sm font-bold text-slate-700">
                    Click or Drag & Drop Leaf Image Here
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports JPG, PNG, WEBP (Clear close-up photo recommended)
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedCrop || !image}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-3 text-base"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing Plant Health with AI...</span>
              </>
            ) : (
              <>
                <FaRobot />
                <span>Run AI Disease Diagnosis</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* AI Diagnosis Result Showcase */}
      {result && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden space-y-6 animate-fade-in">
          {/* Result Header */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Diagnosis Complete
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {result.disease}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  result.severity === "High"
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : result.severity === "Medium"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                Severity: {result.severity}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid md:grid-cols-12 gap-8">
            {/* Image & Confidence */}
            <div className="md:col-span-5 space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                <img
                  src={`${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}${result.image}`}
                  alt="Scanned Leaf"
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Confidence Progress Meter */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>AI Confidence Score</span>
                  <span className="text-emerald-600">{result.confidence}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Recommendations & Treatment */}
            <div className="md:col-span-7 space-y-6">
              {/* Treatment */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 space-y-2">
                <h3 className="font-extrabold text-emerald-900 text-sm flex items-center gap-2">
                  <FaMedkit className="text-emerald-600" /> Recommended Biological Treatment
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed font-medium">
                  {result.treatment}
                </p>
              </div>

              {/* Prevention */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 space-y-2">
                <h3 className="font-extrabold text-blue-900 text-sm flex items-center gap-2">
                  <FaShieldAlt className="text-blue-600" /> Preventive Measures
                </h3>
                <p className="text-xs sm:text-sm text-blue-800 leading-relaxed font-medium">
                  {result.prevention}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiseaseDetection;
