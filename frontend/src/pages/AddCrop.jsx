import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CropForm from "../components/CropForm";
import { addCrop } from "../services/cropService";

function AddCrop() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddCrop = async (formData) => {
    try {
      setLoading(true);
      await addCrop(formData);
      toast.success("Crop added successfully! 🌱");
      navigate("/crops");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add crop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-800">🌱 Track New Crop</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Register a new crop to link with your farm and monitor lifecycle.</p>
      </div>

      <CropForm onSubmit={handleAddCrop} loading={loading} />
    </div>
  );
}

export default AddCrop;
