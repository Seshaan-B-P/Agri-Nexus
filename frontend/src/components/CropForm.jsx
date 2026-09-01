import { useState, useEffect } from "react";
import { FaSeedling, FaTractor, FaCalendarAlt, FaSave } from "react-icons/fa";
import { getFarms } from "../services/farmService";

function CropForm({ initialData = {}, onSubmit, loading = false }) {
  const [farms, setFarms] = useState([]);

  const [form, setForm] = useState({
    farm: "",
    cropName: "",
    variety: "",
    season: "Kharif",
    sowingDate: "",
    expectedHarvestDate: "",
    status: "Planted",
    notes: "",
  });

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        farm: initialData.farm?._id || initialData.farm || "",
        cropName: initialData.cropName || "",
        variety: initialData.variety || "",
        season: initialData.season || "Kharif",
        sowingDate: initialData.sowingDate
          ? initialData.sowingDate.substring(0, 10)
          : "",
        expectedHarvestDate: initialData.expectedHarvestDate
          ? initialData.expectedHarvestDate.substring(0, 10)
          : "",
        status: initialData.status || "Planted",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const loadFarms = async () => {
    try {
      const data = await getFarms();
      setFarms(data.farms || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 sm:p-8 space-y-6"
    >
      <div className="border-b border-slate-100 pb-4 mb-2">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <FaSeedling className="text-blue-600" /> Crop Information & Cycle
        </h2>
        <p className="text-xs text-slate-400">Link your crop to a farm plot and set schedule</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FaTractor className="text-emerald-600" /> Linked Farm *
          </label>
          <select
            name="farm"
            value={form.farm}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          >
            <option value="">Select Farm...</option>
            {farms.map((f) => (
              <option key={f._id} value={f._id}>
                {f.farmName} ({f.location})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Crop Name *
          </label>
          <input
            type="text"
            name="cropName"
            value={form.cropName}
            onChange={handleChange}
            placeholder="e.g. Paddy, Cotton, Wheat, Tomato"
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Variety / Hybrid Type
          </label>
          <input
            type="text"
            name="variety"
            value={form.variety}
            onChange={handleChange}
            placeholder="e.g. ADT-43, Co-5, Hybrid-1"
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Growing Season
          </label>
          <select
            name="season"
            value={form.season}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="Kharif">Kharif (Monsoon)</option>
            <option value="Rabi">Rabi (Winter)</option>
            <option value="Zaid">Zaid (Summer)</option>
            <option value="Year-round">Year-round</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Current Crop Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="Planted">Planted</option>
            <option value="Growing">Growing</option>
            <option value="Harvesting">Harvest Ready / Harvesting</option>
            <option value="Harvested">Harvested</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FaCalendarAlt className="text-blue-500" /> Sowing Date *
          </label>
          <input
            type="date"
            name="sowingDate"
            value={form.sowingDate}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FaCalendarAlt className="text-amber-500" /> Expected Harvest Date *
          </label>
          <input
            type="date"
            name="expectedHarvestDate"
            value={form.expectedHarvestDate}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Notes / Fertilization Details
          </label>
          <textarea
            rows="3"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Add notes about fertilizer schedules, pest treatments..."
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-base disabled:opacity-50"
      >
        <FaSave /> {loading ? "Saving Crop..." : "Save Crop Schedule"}
      </button>
    </form>
  );
}

export default CropForm;
