import { useEffect, useState } from "react";
import {
  FaCoins,
  FaPlus,
  FaFilter,
  FaCalendarAlt,
  FaTractor,
  FaSeedling,
  FaTag,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { getExpenses, deleteExpense } from "../services/expenseService";
import { getFarms } from "../services/farmService";
import { getCrops } from "../services/cropService";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseForm from "../components/ExpenseForm";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);

  const [metrics, setMetrics] = useState({
    totalExpenses: 0,
    thisMonthExpenses: 0,
    highestCategory: "None",
  });

  const [filters, setFilters] = useState({
    farm: "",
    crop: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [expRes, farmRes, cropRes] = await Promise.allSettled([
        getExpenses(),
        getFarms(),
        getCrops(),
      ]);

      if (expRes.status === "fulfilled" && expRes.value.success) {
        setExpenses(expRes.value.expenses || []);
        setMetrics({
          totalExpenses: expRes.value.totalExpenses || 0,
          thisMonthExpenses: expRes.value.thisMonthExpenses || 0,
          highestCategory: expRes.value.highestCategory || "None",
        });
      }

      if (farmRes.status === "fulfilled") setFarms(farmRes.value.farms || []);
      if (cropRes.status === "fulfilled") setCrops(cropRes.value.crops || []);
    } catch (err) {
      console.error("Load expenses initial error:", err);
      toast.error("Failed to load expense records.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const applyFilters = async (activeFilters) => {
    try {
      setLoading(true);
      const res = await getExpenses(activeFilters);
      if (res.success) {
        setExpenses(res.expenses || []);
        setMetrics({
          totalExpenses: res.totalExpenses || 0,
          thisMonthExpenses: res.thisMonthExpenses || 0,
          highestCategory: res.highestCategory || "None",
        });
      }
    } catch (err) {
      console.error("Filter expenses error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense record?")) return;
    try {
      const res = await deleteExpense(id);
      if (res.success) {
        toast.success("Expense deleted");
        applyFilters(filters);
      }
    } catch (err) {
      console.error("Delete expense error:", err);
      toast.error("Failed to delete expense.");
    }
  };

  const categories = [
    "Seeds",
    "Fertilizer",
    "Pesticides",
    "Labour",
    "Irrigation",
    "Equipment",
    "Transport",
    "Electricity",
    "Other",
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <FaCoins className="text-emerald-600" /> Farm Expense Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track, filter, and analyze operational expenditures across your farms & crop cycles.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition self-start sm:self-auto"
        >
          <FaPlus /> Log New Expense
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Expenses */}
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 space-y-1">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Expenses</p>
          <h3 className="text-3xl font-black text-slate-800">
            ₹{metrics.totalExpenses.toLocaleString("en-IN")}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold">All recorded transactions</p>
        </div>

        {/* This Month Expenses */}
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 space-y-1">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">This Month</p>
          <h3 className="text-3xl font-black text-emerald-600">
            ₹{metrics.thisMonthExpenses.toLocaleString("en-IN")}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold">Current month spending</p>
        </div>

        {/* Highest Category */}
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 space-y-1">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Highest Category</p>
          <h3 className="text-3xl font-black text-amber-500 capitalize">
            {metrics.highestCategory}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold">Largest cost driver</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xs space-y-3">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <FaFilter className="text-emerald-600" /> Filter Expense Records
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Farm */}
          <select
            name="farm"
            value={filters.farm}
            onChange={handleFilterChange}
            className="border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white outline-none"
          >
            <option value="">All Farms</option>
            {farms.map((f) => (
              <option key={f._id} value={f._id}>
                {f.farmName}
              </option>
            ))}
          </select>

          {/* Crop */}
          <select
            name="crop"
            value={filters.crop}
            onChange={handleFilterChange}
            className="border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white outline-none"
          >
            <option value="">All Crops</option>
            {crops.map((c) => (
              <option key={c._id} value={c._id}>
                {c.cropName}
              </option>
            ))}
          </select>

          {/* Category */}
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Start Date */}
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white outline-none"
          />

          {/* End Date */}
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white outline-none"
          />
        </div>
      </div>

      {/* Expense List */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      ) : expenses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto">
            <FaCoins />
          </div>
          <h3 className="text-base font-black text-slate-800">No Expenses Recorded</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No expenses found matching the selected filters. Log your first expenditure to start tracking.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow"
          >
            <FaPlus /> Log First Expense
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense._id}
              expense={expense}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      <ExpenseForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => applyFilters(filters)}
        initialData={editingExpense}
        farms={farms}
        crops={crops}
      />
    </div>
  );
}

export default Expenses;
