import { useEffect, useState } from "react";
import { FaBell, FaSearch, FaCalendarAlt, FaRobot, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { getUnreadNotifications } from "../services/notificationService";

function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();

  const [user, setUser] = useState({
    name: "Farmer",
    role: "Farmer",
  });

  const [currentDate, setCurrentDate] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const today = new Date();
    setCurrentDate(
      today.toLocaleDateString(language === "ta" ? "ta-IN" : "en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );

    // Fetch unread notifications count
    fetchUnreadCount();
  }, [language]);

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadNotifications();
      if (res.success) {
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error("Navbar notification check error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 shadow-xs transition-all">
      {/* Left: Greeting & Date */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            {t("welcomeBack")} 👋
          </h1>
          <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
            <FaCalendarAlt className="text-emerald-600 text-xs" /> {currentDate}
          </p>
        </div>
      </div>

      {/* Middle: Quick Action Search Bar */}
      <div className="hidden md:flex items-center gap-2 bg-slate-100/80 border border-slate-200/60 rounded-full px-4 py-2 w-72 focus-within:w-80 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
        <FaSearch className="text-slate-400 text-sm" />
        <input
          type="text"
          placeholder={t("searchPlaceholder") || "Search farms, crops..."}
          className="bg-transparent border-none outline-none text-xs text-slate-700 w-full placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Right: Language Switcher, AI Quick Scan CTA, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs px-3 py-2 rounded-full transition-all shadow-xs hover:scale-105"
          title="Switch Language / மொழியை மாற்றுக"
        >
          <FaGlobe className="text-emerald-600 text-sm" />
          <span>{language === "en" ? "தமிழ்" : "English"}</span>
        </button>

        {/* Quick AI Detection Button */}
        <Link
          to="/disease"
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <FaRobot className="text-sm animate-bounce" />
          <span>{t("quickAiScan")}</span>
        </Link>

        {/* Notifications Link Trigger */}
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="relative p-2.5 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all border border-slate-200/50"
        >
          <FaBell className="text-lg" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white border-2 border-white shadow-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        {/* Profile Link */}
        <Link
          to="/profile"
          className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-sm font-bold shadow-md border-2 border-white">
            {user.name ? user.name.charAt(0).toUpperCase() : "F"}
          </div>
          <div className="hidden lg:block text-left pr-2">
            <h2 className="text-xs font-bold text-slate-800 leading-tight">
              {user.name}
            </h2>
            <p className="text-[10px] font-semibold text-emerald-600 capitalize leading-none mt-0.5">
              {user.role}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
