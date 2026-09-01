import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import CropForm from "../components/CropForm";
import { getCrop, updateCrop } from "../services/cropService";

function EditCrop() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [crop, setCrop] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCrop();
  }, []);

  const fetchCrop = async () => {
    try {
      setLoading(true);
      const data = await getCrop(id);
      setCrop(data.crop);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load crop details");
      navigate("/crops");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCrop = async (formData) => {
    try {
      setSaving(true);
      await updateCrop(id, formData);
      toast.success("Crop details updated successfully! 🌱");
      navigate("/crops");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update crop");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-800">✏️ Edit Crop Details</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Update crop stage, sowing dates, and variety details.</p>
      </div>

      <CropForm initialData={crop} onSubmit={handleUpdateCrop} loading={saving} />
    </div>
  );
}

export default EditCrop;
