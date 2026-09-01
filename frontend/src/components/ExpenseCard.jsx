import {
  FaSeedling,
  FaFlask,
  FaBug,
  FaUserFriends,
  FaWater,
  FaTractor,
  FaTruck,
  FaBolt,
  FaTag,
  FaEdit,
  FaTrashAlt,
  FaCalendarAlt,
} from "react-icons/fa";

function ExpenseCard({ expense, onEdit, onDelete }) {
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Seeds":
        return <FaSeedling className="text-emerald-600" />;
      case "Fertilizer":
        return <FaFlask className="text-blue-600" />;
      case "Pesticides":
        return <FaBug className="text-red-500" />;
      case "Labour":
        return <FaUserFriends className="text-purple-600" />;
      case "Irrigation":
        return <FaWater className="text-cyan-600" />;
      case "Equipment":
        return <FaTractor className="text-amber-600" />;
      case "Transport":
        return <FaTruck className="text-indigo-600" />;
      case "Electricity":
        return <FaBolt className="text-yellow-500" />;
      default:
        return <FaTag className="text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:border-slate-200 transition-all flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl flex-shrink-0">
          {getCategoryIcon(expense.category)}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-800">{expense.description}</h3>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-semibold">
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">
              {expense.category}
            </span>
            {expense.farm?.farmName && (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                🌾 {expense.farm.farmName}
              </span>
            )}
            {expense.crop?.cropName && (
              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                🌱 {expense.crop.cropName}
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-400">
              <FaCalendarAlt className="text-[10px]" />
              {new Date(expense.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Amount & Actions */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right">
          <span className="text-lg font-black text-slate-900 block">
            ₹{expense.amount.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">
            {expense.paymentMethod}
          </span>
        </div>

        <div className="flex items-center gap-1.5 border-l border-slate-100 pl-3">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
            title="Edit Expense"
          >
            <FaEdit className="text-xs" />
          </button>
          <button
            onClick={() => onDelete(expense._id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
            title="Delete Expense"
          >
            <FaTrashAlt className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseCard;
