import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTractor, FaPlus, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

import FarmCard from "../components/FarmCard";
import { getFarms, deleteFarm } from "../services/farmService";

function Farms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      const data = await getFarms();
      setFarms(data.farms || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this farm?")) return;

    try {
      await deleteFarm(id);
      toast.success("Farm deleted successfully!");
      loadFarms();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete farm");
    }
  };

  const filteredFarms = farms.filter(
    (f) =>
      f.farmName?.toLowerCase().includes(search.toLowerCase()) ||
      f.location?.toLowerCase().includes(search.toLowerCase())
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
            <FaTractor className="text-emerald-600" /> My Farms
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your registered agricultural land plots, locations, soil types, and water sources.
          </p>
        </div>

        <Link
          to="/farms/add"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all self-start sm:self-auto"
        >
          <FaPlus /> Add New Farm
        </Link>
      </div>

      {/* Search Bar */}
      {farms.length > 0 && (
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search farm by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none transition"
          />
        </div>
      )}

      {/* Farms Grid / Empty State */}
      {filteredFarms.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center space-y-4">
          <div className="text-6xl">🚜</div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {search ? "No matching farms found" : "No Farms Registered Yet"}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search
              ? "Try adjusting your search keywords."
              : "Register your first farm to start tracking crops and plant health diagnostics."}
          </p>
          {!search && (
            <Link
              to="/farms/add"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow hover:bg-emerald-700 transition mt-2"
            >
              <FaPlus /> Add Your First Farm
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => (
            <FarmCard key={farm._id} farm={farm} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Farms;
