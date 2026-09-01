import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaSeedling, FaTint, FaRulerCombined, FaEdit, FaTrash, FaTractor } from "react-icons/fa";

function FarmCard({ farm, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 p-6 transition-all duration-300 flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-sm">
              <FaTractor />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
                {farm.farmName}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <FaMapMarkerAlt className="text-red-400 text-xs" /> {farm.location}
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-2">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <FaRulerCombined className="text-blue-500" /> Area
            </p>
            <p className="font-bold text-slate-700 mt-0.5">
              {farm.area} {farm.areaUnit || 'Acres'}
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <FaSeedling className="text-emerald-500" /> Soil Type
            </p>
            <p className="font-bold text-slate-700 mt-0.5">
              {farm.soilType || 'Loam'}
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <FaTint className="text-cyan-500" /> Water Source
            </p>
            <p className="font-bold text-slate-700 mt-0.5">
              {farm.waterSource || 'Borewell'}
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Crop Focus</p>
            <p className="font-bold text-slate-700 truncate mt-0.5">
              {farm.cropType || 'General'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 mt-6 pt-4 border-t border-slate-100">
        <Link
          to={`/farms/edit/${farm._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all"
        >
          <FaEdit /> Edit Farm
        </Link>

        <button
          onClick={() => onDelete(farm._id)}
          className="flex items-center justify-center px-3.5 bg-slate-100 hover:bg-red-600 text-slate-500 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all"
          title="Delete Farm"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default FarmCard;
