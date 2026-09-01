import { useState, useEffect } from "react";
import { FaTractor, FaMapMarkerAlt, FaSave } from "react-icons/fa";

function FarmForm({ initialData = {}, onSubmit, loading = false }) {
  const [form, setForm] = useState({
    farmName: "",
    location: "",
    area: "",
    areaUnit: "Acres",
    soilType: "Loamy",
    waterSource: "Borewell",
    cropType: "",
    latitude: "",
    longitude: "",
    description: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        farmName: initialData.farmName || "",
        location: initialData.location || "",
        area: initialData.area || "",
        areaUnit: initialData.areaUnit || "Acres",
        soilType: initialData.soilType || "Loamy",
        waterSource: initialData.waterSource || "Borewell",
        cropType: initialData.cropType || "",
        latitude: initialData.latitude || "",
        longitude: initialData.longitude || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

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
          <FaTractor className="text-emerald-600" /> Farm General Information
        </h2>
        <p className="text-xs text-slate-400">Fill in details about your farm plot</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Farm Name *
          </label>
          <input
            type="text"
            name="farmName"
            value={form.farmName}
            onChange={handleChange}
            placeholder="e.g. Green Acres Farm"
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Location / Address *
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Attur, Salem"
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Area Size *
          </label>
          <input
            type="number"
            step="any"
            name="area"
            value={form.area}
            onChange={handleChange}
            placeholder="e.g. 5"
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Area Unit
          </label>
          <select
            name="areaUnit"
            value={form.areaUnit}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
          >
            <option value="Acres">Acres</option>
            <option value="Hectares">Hectares</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Soil Type
          </label>
          <select
            name="soilType"
            value={form.soilType}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
          >
            <option value="Loamy">Loamy</option>
            <option value="Clay">Clay</option>
            <option value="Sandy">Sandy</option>
            <option value="Silty">Silty</option>
            <option value="Black">Black</option>
            <option value="Red">Red</option>
            <option value="Alluvial">Alluvial</option>
            <option value="Laterite">Laterite</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Primary Water Source
          </label>
          <select
            name="waterSource"
            value={form.waterSource}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
          >
            <option value="Borewell">Borewell</option>
            <option value="Canal">Canal</option>
            <option value="River">River</option>
            <option value="Rainwater">Rainwater</option>
            <option value="Pond">Pond</option>
            <option value="Tank">Tank</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Primary Crop Type
          </label>
          <input
            type="text"
            name="cropType"
            value={form.cropType}
            onChange={handleChange}
            placeholder="e.g. Paddy, Sugarcane, Maize"
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Latitude (Optional)
            </label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              placeholder="11.1271"
              className="w-full border border-slate-300 rounded-xl p-3.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Longitude (Optional)
            </label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              placeholder="78.6569"
              className="w-full border border-slate-300 rounded-xl p-3.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Description / Notes
          </label>
          <textarea
            rows="3"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Additional notes about irrigation, field conditions..."
            className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-base disabled:opacity-50"
      >
        <FaSave /> {loading ? "Saving Farm..." : "Save Farm Records"}
      </button>
    </form>
  );
}

export default FarmForm;
