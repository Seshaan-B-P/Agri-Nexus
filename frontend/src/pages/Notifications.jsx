import { useEffect, useState } from "react";
import {
  FaBell,
  FaCheckDouble,
  FaTrashAlt,
  FaCloudSunRain,
  FaShieldAlt,
  FaTasks,
  FaStore,
  FaSeedling,
  FaInfoCircle,
  FaCheck,
  FaExclamationCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../services/notificationService";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // "all" | "unread"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (err) {
      console.error("Fetch notifications error:", err);
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await markAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        toast.success("Notification marked as read");
      }
    } catch (err) {
      console.error("Mark read error:", err);
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await markAllAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read! 🎉");
      }
    } catch (err) {
      console.error("Mark all read error:", err);
      toast.error("Failed to mark all as read.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteNotification(id);
      if (res.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        toast.success("Notification deleted");
      }
    } catch (err) {
      console.error("Delete notification error:", err);
      toast.error("Failed to delete notification.");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    try {
      const res = await deleteAllNotifications();
      if (res.success) {
        setNotifications([]);
        toast.success("All notifications cleared");
      }
    } catch (err) {
      console.error("Clear all error:", err);
      toast.error("Failed to clear notifications.");
    }
  };

  // Type Icon Mapper
  const getTypeIcon = (type) => {
    switch (type) {
      case "weather":
        return <FaCloudSunRain className="text-amber-500 text-lg" />;
      case "disease":
        return <FaShieldAlt className="text-purple-600 text-lg" />;
      case "task":
        return <FaTasks className="text-teal-600 text-lg" />;
      case "market":
        return <FaStore className="text-blue-600 text-lg" />;
      case "crop":
        return <FaSeedling className="text-emerald-600 text-lg" />;
      default:
        return <FaInfoCircle className="text-slate-500 text-lg" />;
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === "unread" ? !n.isRead : true
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <FaBell className="text-emerald-600" /> Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time automated alerts for weather, crop tasks, market, and AI plant health.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs px-3.5 py-2 rounded-xl border border-emerald-200 transition"
              >
                <FaCheckDouble /> Mark All Read
              </button>
            )}

            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs px-3.5 py-2 rounded-xl border border-red-200 transition"
            >
              <FaTrashAlt /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition ${
            filter === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            filter === "unread"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="bg-white text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto">
            <FaBell />
          </div>
          <h3 className="text-base font-black text-slate-800">No Notifications</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {filter === "unread"
              ? "You're all caught up! No unread notifications right now."
              : "No notification alerts have been received yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif._id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex items-start gap-4 shadow-xs ${
                !notif.isRead
                  ? "border-emerald-300 bg-emerald-50/20 ring-1 ring-emerald-500/10"
                  : "border-slate-100 opacity-90"
              }`}
            >
              {/* Type Icon Container */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex-shrink-0">
                {getTypeIcon(notif.type)}
              </div>

              {/* Message Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    {notif.title}
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    )}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">
                    {new Date(notif.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {notif.message}
                </p>

                <div className="pt-2 flex items-center justify-between text-[10px]">
                  <span
                    className={`font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      notif.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : notif.priority === "medium"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {notif.priority} Priority
                  </span>

                  <div className="flex items-center gap-3">
                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notif._id)}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <FaCheck /> Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif._id)}
                      className="text-slate-400 hover:text-red-600 font-bold transition flex items-center gap-1"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
