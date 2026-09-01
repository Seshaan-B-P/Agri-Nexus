import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaTractor,
  FaSeedling,
  FaRobot,
  FaCamera,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { getProfile, updateProfile } from "../services/authService";
import { getFarms } from "../services/farmService";
import { getCrops } from "../services/cropService";
import { getDiseaseHistory } from "../services/diseaseService";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "farmer",
    state: "",
    district: "",
    village: "",
    profileImage: "",
    createdAt: "",
  });

  const [stats, setStats] = useState({
    farms: 0,
    crops: 0,
    scans: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    state: "",
    district: "",
    village: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileRes, farmsRes, cropsRes, historyRes] = await Promise.allSettled([
        getProfile(),
        getFarms(),
        getCrops(),
        getDiseaseHistory(),
      ]);

      if (profileRes.status === "fulfilled" && profileRes.value.user) {
        const u = profileRes.value.user;
        setUser(u);
        setFormData({
          name: u.name || "",
          phone: u.phone || "",
          state: u.state || "",
          district: u.district || "",
          village: u.village || "",
        });
      }

      setStats({
        farms: farmsRes.status === "fulfilled" ? farmsRes.value.farms?.length || 0 : 0,
        crops: cropsRes.status === "fulfilled" ? cropsRes.value.crops?.length || 0 : 0,
        scans: historyRes.status === "fulfilled" ? historyRes.value.history?.length || 0 : 0,
      });
    } catch (error) {
      console.error("Profile load error:", error);
      toast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // If a file is selected, send FormData multipart request
      let updatePayload;
      if (selectedFile) {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("phone", formData.phone);
        data.append("state", formData.state);
        data.append("district", formData.district);
        data.append("village", formData.village);
        data.append("profileImage", selectedFile);
        updatePayload = data;
      } else {
        updatePayload = formData;
      }

      const res = await updateProfile(updatePayload);
      if (res && res.success) {
        setUser(res.user);
        // Update local storage
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, ...res.user })
        );

        toast.success("Profile updated successfully! 🎉");
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl("");
      } else {
        toast.error(res?.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // Profile image URL resolver helper
  const getProfileImageUrl = () => {
    if (previewUrl) return previewUrl;
    if (user.profileImage) {
      if (user.profileImage.startsWith("http")) return user.profileImage;
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const serverOrigin = apiBase.replace(/\/api\/?$/, "");
      return `${serverOrigin}${user.profileImage.startsWith("/") ? "" : "/"}${user.profileImage}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const profileImageUrl = getProfileImageUrl();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header / Avatar Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 rounded-3xl shadow-xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 text-9xl pointer-events-none">
          🌾
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          {/* Avatar Container */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-white text-emerald-800 flex items-center justify-center text-4xl font-black shadow-lg border-4 border-white/20 overflow-hidden">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user.name ? user.name.charAt(0).toUpperCase() : "F"}</span>
              )}
            </div>

            {/* Quick edit photo icon when in edit mode */}
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-full shadow-lg cursor-pointer transition">
                <FaCamera className="text-xs" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="text-center sm:text-left space-y-1.5">
            <h1 className="text-3xl font-black">{user.name || "Farmer"}</h1>
            <p className="text-emerald-200 text-xs flex items-center justify-center sm:justify-start gap-2">
              <FaEnvelope className="text-xs" /> {user.email}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 flex items-center gap-1">
                <FaShieldAlt /> Role: {user.role || "Farmer"}
              </span>
              {user.createdAt && (
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-100 flex items-center gap-1">
                  <FaCalendarAlt /> Joined: {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </span>
              )}
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="sm:ml-auto flex items-center gap-2 bg-white text-emerald-800 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow hover:bg-emerald-50 transition"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl text-xl">
            <FaTractor />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">My Farms</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.farms}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl text-xl">
            <FaSeedling />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Crops</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.crops}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-xl text-xl">
            <FaRobot />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">AI Scans</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.scans}</h3>
          </div>
        </div>
      </div>

      {/* Details Card / Form */}
      <div className="bg-white rounded-3xl shadow-xs p-6 md:p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <FaUser className="text-emerald-600" /> Account Details
          </h2>
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                setSelectedFile(null);
                setPreviewUrl("");
              }}
              className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs font-bold"
            >
              <FaTimes /> Cancel
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image File Selector */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
              <FaCamera className="text-emerald-600 text-xl" />
              <div className="flex-1">
                <label className="block text-xs font-extrabold text-slate-700">
                  Update Profile Image (அவதார் புகைப்படம்)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  State (மாநிலம்)
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Tamil Nadu"
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  District (மாவட்டம்)
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="e.g. Salem"
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Village / City (கிராமம் / நகரம்)
                </label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="e.g. Attur"
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedFile(null);
                  setPreviewUrl("");
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-emerald-600 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
              >
                <FaSave /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Full Name
              </p>
              <p className="text-base font-extrabold text-slate-800">{user.name || "N/A"}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Email Address (Read-only)
              </p>
              <p className="text-base font-extrabold text-slate-800">{user.email || "N/A"}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Phone Number
              </p>
              <p className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FaPhone className="text-emerald-600 text-xs" /> {user.phone || "N/A"}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Location (State, District, Village)
              </p>
              <p className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500 text-xs" />
                {[user.village, user.district, user.state].filter(Boolean).join(", ") || "Not specified"}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Account Role
              </p>
              <p className="text-base font-extrabold text-slate-800 capitalize">{user.role || "farmer"}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Account Created On
              </p>
              <p className="text-base font-extrabold text-slate-800">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
