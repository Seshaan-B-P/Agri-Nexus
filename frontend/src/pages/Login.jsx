import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaLeaf, FaRobot, FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";

import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await loginUser(form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome back, ${data.user?.name || "Farmer"}! 🎉`);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden grid md:grid-cols-2 relative z-10">
        {/* Left Side: Brand & Hero Showcase */}
        <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 text-9xl pointer-events-none select-none">
            🌾
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/30">
                <FaLeaf />
              </div>
              <h1 className="text-xl font-black tracking-tight text-white">
                Agri <span className="text-emerald-400">Nexus</span>
              </h1>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Smart AI Agriculture Platform 🌿
            </h2>
            <p className="mt-4 text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
              Log in to manage your farms, monitor crops in real time, and diagnose plant diseases instantly with AI.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-700/50 space-y-3">
            <div className="flex items-center gap-3 text-xs text-emerald-200">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FaRobot />
              </span>
              <span>Instant Plant.id AI Disease Detection</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-emerald-200">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                ⚡
              </span>
              <span>Real-time Weather & Crop Analytics</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">Sign In</h3>
            <p className="text-xs text-slate-400 mt-1">Enter your farmer account details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@farm.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                  <FaLock />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <span>{loading ? "Signing In..." : "Sign In to Account"}</span>
              <FaArrowRight className="text-xs" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-700/60">
            <p className="text-xs text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
