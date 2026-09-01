import { useEffect, useState } from "react";
import { FaHistory, FaSearch, FaTrash, FaMedkit, FaShieldAlt, FaCalendarAlt, FaTractor, FaSeedling } from "react-icons/fa";
import toast from "react-hot-toast";

import { getDiseaseHistory, deletePrediction } from "../services/diseaseService";

function DiseaseHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await getDiseaseHistory();
      setHistory(res.history || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load disease history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prediction history record?")) return;

    try {
      await deletePrediction(id);
      toast.success("Prediction record deleted successfully!");
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete prediction");
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.disease?.toLowerCase().includes(search.toLowerCase()) ||
      item.farm?.farmName?.toLowerCase().includes(search.toLowerCase()) ||
      item.crop?.cropName?.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity =
      filterSeverity === "All" || item.severity === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <FaHistory className="text-emerald-600" /> AI Scan History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review past crop disease diagnoses, severity levels, and treatment history.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search disease, farm, crop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            {["All", "High", "Medium", "Low"].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterSeverity === sev
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Grid / Empty State */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center space-y-3">
          <div className="text-6xl text-slate-300">🌱</div>
          <h2 className="text-xl font-extrabold text-slate-800">No Scan Records Found</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search || filterSeverity !== "All"
              ? "No scan history matches your search filters."
              : "Perform your first AI disease diagnosis to store historical reports here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                {item.image && (
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}${item.image}`}
                      alt={item.disease}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          item.severity === "High"
                            ? "bg-red-500 text-white"
                            : item.severity === "Medium"
                            ? "bg-amber-500 text-white"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        {item.severity} Severity
                      </span>
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {item.confidence}% Match
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-800 leading-tight">
                      {item.disease}
                    </h2>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <FaCalendarAlt className="text-emerald-600" />
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                        <FaTractor className="text-emerald-600" /> Farm
                      </p>
                      <p className="font-bold text-slate-700 truncate mt-0.5">
                        {item.farm?.farmName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                        <FaSeedling className="text-blue-600" /> Crop
                      </p>
                      <p className="font-bold text-slate-700 truncate mt-0.5">
                        {item.crop?.cropName || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Treatment Snippet */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FaMedkit className="text-emerald-600" /> Treatment
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.treatment}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-600 text-slate-600 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  <FaTrash className="text-xs" />
                  <span>Delete Scan Record</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiseaseHistory;
