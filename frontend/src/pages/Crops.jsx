import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSeedling, FaPlus, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

import CropCard from "../components/CropCard";
import { getCrops, deleteCrop } from "../services/cropService";

function Crops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      setLoading(true);
      const data = await getCrops();
      setCrops(data.crops || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;

    try {
      await deleteCrop(id);
      toast.success("Crop deleted successfully!");
      loadCrops();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete crop");
    }
  };

  const filteredCrops = crops.filter(
    (c) =>
      c.cropName?.toLowerCase().includes(search.toLowerCase()) ||
      c.variety?.toLowerCase().includes(search.toLowerCase()) ||
      c.farm?.farmName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <FaSeedling className="text-blue-600" /> My Crops
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track active crops, sowing dates, variety information, and expected harvest schedules.
          </p>
        </div>

        <Link
          to="/crops/add"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all self-start sm:self-auto"
        >
          <FaPlus /> Add New Crop
        </Link>
      </div>

      {/* Search Bar */}
      {crops.length > 0 && (
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search crop by name, variety, or farm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
      )}

      {/* Crops Grid / Empty State */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center space-y-4">
          <div className="text-6xl">🌱</div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {search ? "No matching crops found" : "No Crops Tracked Yet"}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search
              ? "Try adjusting your search criteria."
              : "Add your first crop to link it with a farm and monitor AI health assessments."}
          </p>
          {!search && (
            <Link
              to="/crops/add"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow hover:bg-blue-700 transition mt-2"
            >
              <FaPlus /> Add Your First Crop
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <CropCard key={crop._id} crop={crop} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Crops;