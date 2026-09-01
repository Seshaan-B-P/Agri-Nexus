import { Link } from "react-router-dom";
import { FaSeedling, FaTractor, FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";

function CropCard({ crop, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 p-6 transition-all duration-300 flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg shadow-sm">
              <FaSeedling />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                {crop.cropName}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {crop.variety ? `Variety: ${crop.variety}` : "Standard Variety"}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              crop.status === "Growing"
                ? "bg-emerald-100 text-emerald-700"
                : crop.status === "Harvesting" || crop.status === "Harvest Ready"
                ? "bg-amber-100 text-amber-700"
                : crop.status === "Harvested"
                ? "bg-slate-200 text-slate-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {crop.status || "Planted"}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-2">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <FaTractor className="text-emerald-600" /> Farm
            </p>
            <p className="font-bold text-slate-700 truncate mt-0.5">
              {crop.farm?.farmName || "N/A"}
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Season</p>
            <p className="font-bold text-slate-700 mt-0.5">
              {crop.season || "Kharif"}
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <FaCalendarAlt className="text-blue-500" /> Sowing Date
            </p>
            <p className="font-bold text-slate-700 mt-0.5">
              {crop.sowingDate ? new Date(crop.sowingDate).toLocaleDateString() : "N/A"}
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <FaCalendarAlt className="text-amber-500" /> Exp. Harvest
            </p>
            <p className="font-bold text-slate-700 mt-0.5">
              {crop.expectedHarvestDate ? new Date(crop.expectedHarvestDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>

        {crop.notes && (
          <p className="text-xs text-slate-500 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 italic line-clamp-2">
            "{crop.notes}"
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 mt-6 pt-4 border-t border-slate-100">
        <Link
          to={`/crops/edit/${crop._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all"
        >
          <FaEdit /> Edit Crop
        </Link>

        <button
          onClick={() => onDelete(crop._id)}
          className="flex items-center justify-center px-3.5 bg-slate-100 hover:bg-red-600 text-slate-500 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all"
          title="Delete Crop"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default CropCard;
