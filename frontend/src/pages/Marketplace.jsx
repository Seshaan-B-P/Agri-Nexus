import { useEffect, useState } from "react";
import { FaStore, FaPlus, FaSearch, FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaTag, FaTrash, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

import { getListings, createListing, deleteListing } from "../services/marketplaceService";

function Marketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    itemType: "Produce",
    cropType: "",
    price: "",
    unit: "kg",
    quantity: "1",
    location: "",
    contactPhone: "",
    description: "",
  });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await getListings();
      setListings(data.listings || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load marketplace listings");
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
      await createListing(form);
      toast.success("Item posted on Marketplace successfully! 🛒");
      setShowModal(false);
      setForm({
        title: "",
        itemType: "Produce",
        cropType: "",
        price: "",
        unit: "kg",
        quantity: "1",
        location: "",
        contactPhone: "",
        description: "",
      });
      loadListings();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to post listing");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteListing(id);
      toast.success("Listing removed successfully");
      setListings((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete listing");
    }
  };

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase()) ||
      item.cropType?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "All" || item.itemType === category;

    return matchesSearch && matchesCategory;
  });

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
            <FaStore className="text-emerald-600" /> Farmers Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Buy and sell harvested produce, seeds, fertilizers, and farm equipment directly with local farmers.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all self-start md:self-auto"
        >
          <FaPlus /> Post Item for Sale
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search crops, seeds, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {["All", "Produce", "Seeds", "Equipment", "Fertilizer"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                category === cat
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center space-y-4">
          <div className="text-6xl">🛒</div>
          <h2 className="text-xl font-extrabold text-slate-800">No Marketplace Items Found</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search || category !== "All"
              ? "No items match your active search filters."
              : "Be the first farmer to post produce or equipment for sale!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => {
            const isOwner = item.farmer?._id === currentUser.id || item.farmer === currentUser.id;
            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 p-6 transition-all duration-300 flex flex-col justify-between group relative"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase rounded-full tracking-wider">
                        {item.itemType}
                      </span>
                      <h2 className="text-lg font-black text-slate-800 mt-2 group-hover:text-emerald-600 transition-colors">
                        {item.title}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-emerald-600">₹{item.price}</p>
                      <p className="text-[10px] font-bold text-slate-400">per {item.unit}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500 text-xs" />
                      <span className="font-bold text-slate-800">{item.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaTag className="text-emerald-500 text-xs" />
                      <span>Seller: {item.farmer?.name || "Farmer"}</span>
                    </p>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-500 italic line-clamp-2">
                      "{item.description}"
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={`https://wa.me/91${item.contactPhone.replace(/\D/g, '')}?text=Hi,%20I%20am%20interested%20in%20your%20listing:%20${encodeURIComponent(item.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md"
                  >
                    <FaWhatsapp className="text-sm" /> Chat WhatsApp
                  </a>

                  <a
                    href={`tel:${item.contactPhone}`}
                    className="flex items-center justify-center p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                    title="Call Seller"
                  >
                    <FaPhoneAlt className="text-xs" />
                  </a>

                  {isOwner && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center justify-center p-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold rounded-xl transition-all"
                      title="Delete Listing"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <FaStore className="text-emerald-600" /> Post New Item
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
                  Item Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Organic Paddy Grain (10 Quintals)"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    name="itemType"
                    value={form.itemType}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="2500"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="kg">kg</option>
                    <option value="Quintal">Quintal</option>
                    <option value="Ton">Ton</option>
                    <option value="Bag">Bag</option>
                    <option value="Piece">Piece</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    placeholder="9876543210"
                    value={form.contactPhone}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location / Village *
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Salem, Tamil Nadu"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Item Description
                </label>
                <textarea
                  rows="3"
                  name="description"
                  placeholder="Describe quality, variety, or machine specs..."
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? "Posting Listing..." : "Post Listing"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
