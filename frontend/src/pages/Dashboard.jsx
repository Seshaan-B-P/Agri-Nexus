import { useEffect, useState } from "react";
import {
  FaTractor,
  FaSeedling,
  FaRobot,
  FaCloudSun,
  FaPlus,
  FaArrowRight,
  FaLeaf,
  FaShieldAlt,
  FaCalendarCheck,
  FaStore,
  FaBell,
  FaCoins,
  FaChartLine,
  FaLightbulb,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import DashboardCard from "../components/DashboardCard";
import { getFarms } from "../services/farmService";
import { getCrops } from "../services/cropService";
import { getWeather } from "../services/weatherService";
import { getDiseaseHistory } from "../services/diseaseService";
import { getTasks } from "../services/taskService";
import { getListings } from "../services/marketplaceService";
import { getUnreadNotifications } from "../services/notificationService";
import { getExpenses } from "../services/expenseService";
import { useLanguage } from "../context/LanguageContext";

function Dashboard() {
  const { t } = useLanguage();

  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [weather, setWeather] = useState({ temp: "--°C", condition: "Loading weather..." });
  const [scans, setScans] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [listings, setListings] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [farmData, cropData, historyData, taskData, marketData, notifData, expData] =
        await Promise.allSettled([
          getFarms(),
          getCrops(),
          getDiseaseHistory(),
          getTasks(),
          getListings(),
          getUnreadNotifications(),
          getExpenses(),
        ]);

      const userFarms = farmData.status === "fulfilled" ? farmData.value.farms || [] : [];
      setFarms(userFarms);

      if (cropData.status === "fulfilled") setCrops(cropData.value.crops || []);
      if (historyData.status === "fulfilled") setScans(historyData.value.history || []);
      if (taskData.status === "fulfilled") setTasks(taskData.value.tasks || []);
      if (marketData.status === "fulfilled") setListings(marketData.value.listings || []);
      if (notifData.status === "fulfilled") setUnreadCount(notifData.value.unreadCount || 0);
      if (expData.status === "fulfilled") setTotalExpenses(expData.value.totalExpenses || 0);

      // Fetch Weather
      let lat = 11.1271;
      let lon = 78.6569;

      if (userFarms.length > 0 && userFarms[0].latitude && userFarms[0].longitude) {
        lat = userFarms[0].latitude;
        lon = userFarms[0].longitude;
      }

      const weatherRes = await getWeather(lat, lon);
      if (weatherRes && weatherRes.current) {
        setWeather({
          temp: `${weatherRes.current.temperature}°C`,
          condition: weatherRes.current.condition || `Wind: ${weatherRes.current.windspeed} km/h`,
        });
      }
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const pendingTasksCount = tasks.filter((t) => t.status === "Pending").length;
  const recentScan = scans.length > 0 ? scans[0] : null;

  return (
    <div className="space-y-8 p-2 sm:p-4">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10 text-9xl pointer-events-none select-none">
          🌿
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <FaLeaf /> {t("brandSubtitle")}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Protect & Boost Your Yields with AI 🌾
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 font-medium">
            {t("dashboardSubtitle")}
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <Link
              to="/disease"
              className="flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <FaShieldAlt className="text-emerald-600" />
              <span>{t("quickAiScan")}</span>
            </Link>

            <Link
              to="/crop-recommendation"
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition-all"
            >
              <FaLightbulb />
              <span>Crop Recommendation</span>
            </Link>

            <Link
              to="/yield-prediction"
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition-all"
            >
              <FaChartLine />
              <span>Yield Prediction</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <DashboardCard
          title={t("activeFarms")}
          value={farms.length}
          icon={<FaTractor />}
          color="emerald"
        />

        <DashboardCard
          title={t("trackedCrops")}
          value={crops.length}
          icon={<FaSeedling />}
          color="blue"
        />

        <DashboardCard
          title="Unread Alerts"
          value={unreadCount}
          icon={<FaBell />}
          color="amber"
          subtitle={unreadCount > 0 ? "Action required" : "All clear"}
        />

        <DashboardCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString("en-IN")}`}
          icon={<FaCoins />}
          color="purple"
        />

        <DashboardCard
          title="Pending Tasks"
          value={pendingTasksCount}
          icon={<FaCalendarCheck />}
          color="teal"
        />

        <DashboardCard
          title={t("weatherAlert")}
          value={weather.temp}
          icon={<FaCloudSun />}
          color="amber"
          subtitle={weather.condition}
        />
      </div>

      {/* Summary Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Recent Disease Scan */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <FaShieldAlt className="text-purple-600" /> 🧬 Recent Disease Scan
            </h2>
            <Link
              to="/disease-history"
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              History <FaArrowRight className="text-[9px]" />
            </Link>
          </div>

          {!recentScan ? (
            <div className="text-center py-6 text-slate-400 space-y-2">
              <p className="text-xs font-semibold">No disease scans recorded yet.</p>
              <Link
                to="/disease"
                className="inline-flex items-center gap-1.5 bg-purple-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow"
              >
                Scan Plant Leaf
              </Link>
            </div>
          ) : (
            <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-800">{recentScan.disease}</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    recentScan.severity === "High"
                      ? "bg-red-100 text-red-700"
                      : recentScan.severity === "Medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {recentScan.severity || "Low"} Risk
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{recentScan.treatment}</p>
            </div>
          )}
        </div>

        {/* Widget 2: Pending Tasks */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <FaCalendarCheck className="text-teal-600" /> 📅 Pending Farm Tasks
            </h2>
            <Link
              to="/tasks"
              className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1"
            >
              View Calendar <FaArrowRight className="text-[9px]" />
            </Link>
          </div>

          {tasks.filter((t) => t.status === "Pending").length === 0 ? (
            <div className="text-center py-6 text-slate-400 space-y-2">
              <p className="text-xs font-semibold">All farm tasks completed! 🎉</p>
              <Link
                to="/tasks"
                className="inline-flex items-center gap-1.5 bg-teal-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow"
              >
                + Add Task
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {tasks
                .filter((t) => t.status === "Pending")
                .slice(0, 2)
                .map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">{task.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{task.taskType}</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      Pending
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Widget 3: Marketplace Activity */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <FaStore className="text-blue-600" /> 💰 Marketplace Activity
            </h2>
            <Link
              to="/marketplace"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Market <FaArrowRight className="text-[9px]" />
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-6 text-slate-400 space-y-2">
              <p className="text-xs font-semibold">No active produce listings.</p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow"
              >
                + Create Listing
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {listings.slice(0, 2).map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">₹{item.price} / {item.unit}</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
