import { useEffect, useState } from "react";
import { FaCoins, FaTimes, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";

import { createExpense, updateExpense } from "../services/expenseService";

function ExpenseForm({ isOpen, onClose, onSuccess, initialData, farms, crops }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Seeds",
    farm: "",
    crop: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || "",
        amount: initialData.amount || "",
        category: initialData.category || "Seeds",
        farm: initialData.farm?._id || initialData.farm || "",
        crop: initialData.crop?._id || initialData.crop || "",
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        paymentMethod: initialData.paymentMethod || "Cash",
        notes: initialData.notes || "",
      });
    } else {
      setFormData({
        description: "",
        amount: "",
        category: "Seeds",
        farm: farms && farms.length > 0 ? farms[0]._id : "",
        crop: crops && crops.length > 0 ? crops[0]._id : "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "Cash",
        notes: "",
      });
    }
  }, [initialData, farms, crops]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description.trim() || !formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid description and positive amount.");
      return;
    }

    try {
      setSubmitting(true);
      if (initialData && initialData._id) {
        const res = await updateExpense(initialData._id, formData);
        if (res.success) {
          toast.success("Expense updated successfully! 💰");
          onSuccess();
          onClose();
        }
      } else {
        const res = await createExpense(formData);
        if (res.success) {
          toast.success("Expense logged successfully! 💰");
          onSuccess();
          onClose();
        }
      }
    } catch (err) {
      console.error("Save expense error:", err);
      toast.error(err.response?.data?.message || "Failed to save expense.");
    } finally {
      setSubmitting(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-5 flex items-center justify-between">
          <h2 className="text-lg font-black flex items-center gap-2">
            <FaCoins /> {initialData ? "Edit Farm Expense" : "Log New Farm Expense"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition p-1 text-base"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Description (விளக்கம்)
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Purchased 2 bags of Urea"
              required
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                min="1"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 2500"
                required
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Target Farm
              </label>
              <select
                name="farm"
                value={formData.farm}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">General (No Specific Farm)</option>
                {farms.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.farmName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Target Crop
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">General (No Specific Crop)</option>
                {crops.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.cropName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit/Card">Credit/Debit Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional remarks..."
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            ></textarea>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-emerald-600 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow hover:bg-emerald-700 transition disabled:opacity-50"
            >
              <FaSave /> {submitting ? "Saving..." : initialData ? "Update Expense" : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;
