import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaTractor,
  FaSeedling,
  FaRobot,
  FaHistory,
  FaComments,
  FaStore,
  FaCalendarCheck,
  FaCloudSunRain,
  FaCalculator,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaLeaf,
  FaBell,
  FaChartLine,
  FaCoins,
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

function Sidebar() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    {
      name: t("navDashboard"),
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <FaBell />,
    },
    {
      name: t("navAiAssistant"),
      path: "/ai-assistant",
      icon: <FaComments />,
      badge: "CHAT",
    },
    {
      name: t("navMyFarms"),
      path: "/farms",
      icon: <FaTractor />,
    },
    {
      name: t("navMyCrops"),
      path: "/crops",
      icon: <FaSeedling />,
    },
    {
      name: "Crop AI Recommendation",
      path: "/crop-recommendation",
      icon: <FaSeedling />,
      badge: "AI",
    },
    {
      name: "Yield Prediction",
      path: "/yield-prediction",
      icon: <FaChartLine />,
      badge: "ML",
    },
    {
      name: t("navDiseaseDetection"),
      path: "/disease",
      icon: <FaRobot />,
      badge: "AI",
    },
    {
      name: t("navScanHistory"),
      path: "/disease-history",
      icon: <FaHistory />,
    },
    {
      name: "Farm Expenses",
      path: "/expenses",
      icon: <FaCoins />,
    },
    {
      name: t("navMarketplace"),
      path: "/marketplace",
      icon: <FaStore />,
      badge: "NEW",
    },
    {
      name: t("navTasks"),
      path: "/tasks",
      icon: <FaCalendarCheck />,
    },
    {
      name: t("navWeather"),
      path: "/weather",
      icon: <FaCloudSunRain />,
    },
    {
      name: t("navCalculator"),
      path: "/calculator",
      icon: <FaCalculator />,
    },
    {
      name: t("navReports"),
      path: "/reports",
      icon: <FaChartBar />,
    },
    {
      name: t("navProfile"),
      path: "/profile",
      icon: <FaUser />,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-slate-100 shadow-2xl flex flex-col justify-between border-r border-slate-800 relative z-20">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/20">
            <FaLeaf />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
              Agri <span className="text-emerald-400">Nexus</span>
            </h1>
            <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
              {t("brandSubtitle")}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-4 py-6">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">
            Main Menu
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2 rounded-xl font-medium text-xs transition-all duration-200 group ${
                    isActive
                      ? "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-base group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase border ${
                      item.badge === "CHAT"
                        ? "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
                        : item.badge === "NEW"
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/30"
                        : item.badge === "ML"
                        ? "bg-purple-400/20 text-purple-300 border-purple-400/30"
                        : "bg-teal-400/20 text-teal-300 border-teal-400/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2.5 w-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white font-semibold text-xs py-3 rounded-xl transition-all duration-200 border border-slate-700 hover:border-red-500 shadow-md"
        >
          <FaSignOutAlt className="text-sm" />
          <span>{t("signOut")}</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
