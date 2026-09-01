function DashboardCard({ title, value, icon, color = "emerald", subtitle }) {
  const colorStyles = {
    emerald: "bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-emerald-500/30",
    blue: "bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-blue-500/30",
    purple: "bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-purple-500/30",
    amber: "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/30",
  };

  const glowStyles = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    amber: "bg-amber-500",
  };

  const iconStyle = colorStyles[color] || colorStyles.emerald;
  const glowStyle = glowStyles[color] || glowStyles.emerald;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      {/* Decorative Background Glow */}
      <div
        className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-15 blur-2xl transition-all group-hover:scale-150 ${glowStyle}`}
      ></div>

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h2 className="text-2xl font-black text-slate-800 mt-1.5 tracking-tight">
            {value}
          </h2>
          {subtitle && (
            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110 ${iconStyle}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
