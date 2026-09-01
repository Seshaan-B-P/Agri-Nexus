import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import {
  FaTractor,
  FaSeedling,
  FaRobot,
  FaExclamationTriangle,
  FaChartPie,
  FaChartBar,
  FaFileDownload,
  FaStore,
  FaTasks,
  FaCoins,
  FaCalendarAlt,
  FaSync,
  FaCalculator,
  FaCheckCircle,
} from "react-icons/fa";

import { getReportAnalytics } from "../services/reportService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getReportAnalytics();
      if (response && response.success) {
        setAnalytics(response.data);
      } else {
        setError("Failed to retrieve real-time analytics data.");
      }
    } catch (err) {
      console.error("Reports loading error:", err);
      setError(
        err.response?.data?.message ||
          "Network error while fetching report data from server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="text-sm font-bold text-slate-500">
          Generating real-time analytics from your farm records...
        </p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center space-y-4">
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl text-red-800 space-y-3">
          <FaExclamationTriangle className="text-3xl text-red-500 mx-auto" />
          <h2 className="text-lg font-black">Analytics Load Error</h2>
          <p className="text-xs font-semibold">{error || "Data unavailable"}</p>
          <button
            onClick={fetchReportData}
            className="inline-flex items-center gap-2 bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow hover:bg-red-700 transition"
          >
            <FaSync /> Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const {
    farmSummary,
    cropSummary,
    diseaseAnalytics,
    taskAnalytics,
    marketplaceAnalytics,
    expenseAnalytics,
  } = analytics;

  // --- Chart Data Constructs ---

  // 1. Crops by Season
  const seasonLabels = Object.keys(cropSummary.cropsBySeason || {});
  const seasonDataValues = Object.values(cropSummary.cropsBySeason || {});
  const seasonChartData = {
    labels: seasonLabels.length ? seasonLabels : ["Kharif", "Rabi", "Zaid", "Year-round"],
    datasets: [
      {
        label: "Number of Crops",
        data: seasonLabels.length ? seasonDataValues : [0, 0, 0, 0],
        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // 2. Disease Severity Stats
  const severityChartData = {
    labels: ["High Severity", "Medium Severity", "Low Severity"],
    datasets: [
      {
        label: "AI Plant Scans",
        data: [
          diseaseAnalytics.severityDistribution?.High || 0,
          diseaseAnalytics.severityDistribution?.Medium || 0,
          diseaseAnalytics.severityDistribution?.Low || 0,
        ],
        backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
        borderRadius: 8,
      },
    ],
  };

  // 3. Farm Soil Distribution
  const soilLabels = Object.keys(farmSummary.soilTypesCount || {});
  const soilValues = Object.values(farmSummary.soilTypesCount || {});
  const soilChartData = {
    labels: soilLabels.length ? soilLabels : ["Clay", "Loam", "Sandy", "Black"],
    datasets: [
      {
        label: "Farms Count",
        data: soilLabels.length ? soilValues : [0, 0, 0, 0],
        backgroundColor: ["#84cc16", "#06b6d4", "#f97316", "#a855f7", "#ec4899", "#14b8a6"],
      },
    ],
  };

  // 4. Expense Category Distribution (Doughnut Chart)
  const expCatLabels = Object.keys(expenseAnalytics.expensesByCategory || {});
  const expCatValues = Object.values(expenseAnalytics.expensesByCategory || {});
  const expenseCategoryChartData = {
    labels: expCatLabels.length ? expCatLabels : ["Seeds", "Fertilizer", "Labour"],
    datasets: [
      {
        label: "Expenses (₹)",
        data: expCatLabels.length ? expCatValues : [0, 0, 0],
        backgroundColor: [
          "#10b981",
          "#3b82f6",
          "#ef4444",
          "#8b5cf6",
          "#06b6d4",
          "#f59e0b",
          "#ec4899",
          "#eab308",
          "#64748b",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // 5. Farm-wise Expenses (Bar Chart)
  const expFarmLabels = Object.keys(expenseAnalytics.expensesByFarm || {});
  const expFarmValues = Object.values(expenseAnalytics.expensesByFarm || {});
  const expenseFarmChartData = {
    labels: expFarmLabels.length ? expFarmLabels : ["Paddy Field"],
    datasets: [
      {
        label: "Farm Expenses (₹)",
        data: expFarmLabels.length ? expFarmValues : [0],
        backgroundColor: "#3b82f6",
        borderRadius: 8,
      },
    ],
  };

  // 6. Monthly Expenses Trend (Line Chart)
  const expMonthLabels = Object.keys(expenseAnalytics.monthlyExpenses || {});
  const expMonthValues = Object.values(expenseAnalytics.monthlyExpenses || {});
  const expenseMonthlyChartData = {
    labels: expMonthLabels.length ? expMonthLabels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Expenditure (₹)",
        data: expMonthLabels.length ? expMonthValues : [0, 0, 0, 0, 0, 0],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#10b981",
      },
    ],
  };

  // Estimated Profit Calculation Integration (Expected Revenue - Total Expenses)
  const estimatedYieldTons = Number((farmSummary.totalFarmArea * 2.5).toFixed(1)); // ~2.5 tons/acre benchmark
  const marketPricePerTon = 22500; // Paddy average rate
  const expectedRevenue = Math.round(estimatedYieldTons * marketPricePerTon);
  const totalExpenses = expenseAnalytics.totalExpenses || 0;
  const estimatedProfit = expectedRevenue - totalExpenses;

  return (
    <div className="space-y-8 p-4 md:p-6 print:p-0 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <FaChartBar className="text-emerald-600" /> Reports & Real Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Authenticated real-time metrics aggregated exclusively from your farm database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold">
            <FaCalendarAlt className="text-slate-400" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-slate-800"
            >
              <option value="all">All Time Records</option>
              <option value="season">Current Season</option>
              <option value="year">This Year (2026)</option>
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow hover:bg-slate-800 transition"
          >
            <FaFileDownload /> Export PDF / Print
          </button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Total Farms */}
        <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Farms</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{farmSummary.totalFarms}</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{farmSummary.totalFarmArea} Acres Area</p>
          </div>
          <div className="p-3.5 bg-emerald-100 text-emerald-700 rounded-2xl text-xl">
            <FaTractor />
          </div>
        </div>

        {/* Total Crops */}
        <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Active Crops</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{cropSummary.totalCrops}</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Tracked Crops</p>
          </div>
          <div className="p-3.5 bg-blue-100 text-blue-700 rounded-2xl text-xl">
            <FaSeedling />
          </div>
        </div>

        {/* AI Scans */}
        <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">AI Disease Scans</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{diseaseAnalytics.totalScans}</h3>
            <p className="text-[10px] text-red-500 font-bold mt-0.5">
              {diseaseAnalytics.severityDistribution?.High || 0} High Severity
            </p>
          </div>
          <div className="p-3.5 bg-purple-100 text-purple-700 rounded-2xl text-xl">
            <FaRobot />
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Expenses</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              ₹{(expenseAnalytics.totalExpenses || 0).toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
              ₹{(expenseAnalytics.thisMonthExpenses || 0).toLocaleString("en-IN")} This Month
            </p>
          </div>
          <div className="p-3.5 bg-amber-100 text-amber-700 rounded-2xl text-xl">
            <FaCoins />
          </div>
        </div>

        {/* Marketplace Listings */}
        <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Market Listings</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{marketplaceAnalytics.totalListings}</h3>
            <p className="text-[10px] text-blue-600 font-bold mt-0.5">
              {marketplaceAnalytics.activeListings} Active
            </p>
          </div>
          <div className="p-3.5 bg-teal-100 text-teal-700 rounded-2xl text-xl">
            <FaStore />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Crop Distribution by Season */}
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaChartPie className="text-emerald-600 text-lg" />
            <h2 className="text-base font-black text-slate-800">Crop Distribution by Season</h2>
          </div>
          <div className="h-64 flex items-center justify-center">
            {cropSummary.totalCrops === 0 ? (
              <p className="text-xs font-bold text-slate-400">No crop records found in database.</p>
            ) : (
              <Doughnut
                data={seasonChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "right" } },
                }}
              />
            )}
          </div>
        </div>

        {/* 2. Disease Severity Distribution */}
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaChartBar className="text-purple-600 text-lg" />
            <h2 className="text-base font-black text-slate-800">Plant Disease Risk & Severity</h2>
          </div>
          <div className="h-64 flex items-center justify-center">
            {diseaseAnalytics.totalScans === 0 ? (
              <p className="text-xs font-bold text-slate-400">No AI scan history records available.</p>
            ) : (
              <Bar
                data={severityChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Expense Management Charts Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <FaCoins className="text-emerald-600" /> Financial Expenditure & Expense Breakdown
        </h2>

        {!expenseAnalytics.hasExpenses ? (
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center text-xl">
                <FaCoins />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Expense Analytics</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  No expense records logged yet. Log expenses to view breakdown.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              No Data
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Doughnut Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <FaChartPie className="text-emerald-600" /> Expense by Category
              </h3>
              <div className="h-60 flex items-center justify-center">
                <Doughnut
                  data={expenseCategoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              </div>
            </div>

            {/* Farm-wise Expenses Bar Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <FaChartBar className="text-blue-600" /> Farm-wise Expenses
              </h3>
              <div className="h-60 flex items-center justify-center">
                <Bar
                  data={expenseFarmChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </div>

            {/* Monthly Trend Line Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <FaChartLine className="text-teal-600" /> Monthly Expense Trend
              </h3>
              <div className="h-60 flex items-center justify-center">
                <Line
                  data={expenseMonthlyChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PROFIT INTEGRATION CARD (Expected Revenue - Total Expenses) */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-wider text-emerald-200">
              Automated Profitability Analysis
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Estimated Net Profit: ₹{estimatedProfit.toLocaleString("en-IN")}
            </h2>
            <p className="text-xs text-emerald-100 font-medium">
              Calculated using: Expected Revenue (Yield × Market Rate) - Total Farm Expenses.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-2 min-w-[220px]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-200">Expected Revenue:</span>
              <span className="font-bold text-amber-300">₹{expectedRevenue.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-200">Total Expenses:</span>
              <span className="font-bold text-red-300">₹{totalExpenses.toLocaleString("en-IN")}</span>
            </div>
            <div className="h-px bg-white/20 my-1"></div>
            <div className="flex justify-between items-center text-xs font-black">
              <span>Estimated Profit:</span>
              <span className="text-emerald-400">₹{estimatedProfit.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-emerald-200/80 border-t border-white/10 pt-3">
          💡 <strong>Note:</strong> Profit estimations are derived based on yield predictions, market prices, and logged MongoDB expense entries. Actual farm returns may vary based on market fluctuations.
        </p>
      </div>
    </div>
  );
}

export default Reports;
