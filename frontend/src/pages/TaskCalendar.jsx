import { useEffect, useState } from "react";
import { FaCalendarCheck, FaPlus, FaCheckCircle, FaRegCircle, FaTrash, FaTimes, FaSeedling } from "react-icons/fa";
import toast from "react-hot-toast";

import { getTasks, createTask, updateTaskStatus, deleteTask } from "../services/taskService";
import { getCrops } from "../services/cropService";

function TaskCalendar() {
  const [tasks, setTasks] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    crop: "",
    title: "",
    taskType: "Irrigation",
    dueDate: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [taskRes, cropRes] = await Promise.allSettled([
        getTasks(),
        getCrops(),
      ]);

      if (taskRes.status === "fulfilled") setTasks(taskRes.value.tasks || []);
      if (cropRes.status === "fulfilled") setCrops(cropRes.value.crops || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load task reminders");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createTask(form);
      toast.success("Task reminder created! 📅");
      setShowModal(false);
      setForm({
        crop: "",
        title: "",
        taskType: "Irrigation",
        dueDate: "",
        notes: "",
      });
      loadData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    try {
      await updateTaskStatus(id, nextStatus);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: nextStatus } : t))
      );
      toast.success(`Task marked as ${nextStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task reminder?")) return;
    try {
      await deleteTask(id);
      toast.success("Task deleted");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter(
    (t) => filterType === "All" || t.taskType === filterType
  );

  const pendingCount = tasks.filter((t) => t.status === "Pending").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <FaCalendarCheck className="text-emerald-600" /> Crop Task Calendar & Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Schedule watering, fertilizing, pesticide spraying, and harvesting tasks for your crops.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all self-start md:self-auto"
        >
          <FaPlus /> Add Task Reminder
        </button>
      </div>

      {/* Stats Summary & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold">
            {pendingCount}
          </span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Tasks</h3>
            <p className="text-sm font-bold text-slate-800">
              {pendingCount === 0 ? "All caught up! 🎉" : `${pendingCount} tasks requiring action`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["All", "Irrigation", "Fertilizer", "Pesticide", "Harvesting", "General"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                filterType === type
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center space-y-4">
          <div className="text-6xl">📅</div>
          <h2 className="text-xl font-extrabold text-slate-800">No Tasks Scheduled</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add task reminders for irrigation, fertilizer applications, or crop harvesting schedules.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((t) => {
            const isCompleted = t.status === "Completed";
            return (
              <div
                key={t._id}
                className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border transition-all duration-200 flex items-center justify-between gap-4 ${
                  isCompleted
                    ? "border-slate-100 bg-slate-50/60 opacity-75"
                    : "border-emerald-100 hover:border-emerald-300 shadow-md"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={() => handleToggle(t._id, t.status)}
                    className={`text-2xl transition-colors ${
                      isCompleted ? "text-emerald-500" : "text-slate-300 hover:text-emerald-500"
                    }`}
                  >
                    {isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          t.taskType === "Irrigation"
                            ? "bg-blue-100 text-blue-700"
                            : t.taskType === "Fertilizer"
                            ? "bg-emerald-100 text-emerald-700"
                            : t.taskType === "Pesticide"
                            ? "bg-purple-100 text-purple-700"
                            : t.taskType === "Harvesting"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {t.taskType}
                      </span>
                      {t.crop && (
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <FaSeedling className="text-blue-500" /> {t.crop.cropName}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-base font-bold mt-1 leading-snug truncate ${
                        isCompleted ? "line-through text-slate-400" : "text-slate-800"
                      }`}
                    >
                      {t.title}
                    </h3>

                    {t.notes && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{t.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Due Date</p>
                    <p className="text-xs font-bold text-slate-700">
                      {new Date(t.dueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete task"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <FaCalendarCheck className="text-emerald-600" /> Add Task Reminder
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Apply 1st Urea Dosage"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Task Type
                </label>
                <select
                  name="taskType"
                  value={form.taskType}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Irrigation">Irrigation / Watering</option>
                  <option value="Fertilizer">Fertilizer Application</option>
                  <option value="Pesticide">Pesticide Spray</option>
                  <option value="Harvesting">Harvesting</option>
                  <option value="Pruning">Pruning / Weeding</option>
                  <option value="General">General Task</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Link to Crop (Optional)
                </label>
                <select
                  name="crop"
                  value={form.crop}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">No Crop Link</option>
                  {crops.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.cropName} ({c.variety || 'Crop'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Notes
                </label>
                <textarea
                  rows="2"
                  name="notes"
                  placeholder="e.g. 50kg bag per acre early morning..."
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? "Saving Reminder..." : "Save Task Reminder"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCalendar;
