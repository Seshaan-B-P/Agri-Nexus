import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import FarmForm from "../components/FarmForm";
import { getFarm, updateFarm } from "../services/farmService";

function EditFarm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [farm, setFarm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFarm();
  }, []);

  const fetchFarm = async () => {
    try {
      setLoading(true);
      const data = await getFarm(id);
      setFarm(data.farm);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load farm details");
      navigate("/farms");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFarm = async (formData) => {
    try {
      setSaving(true);
      await updateFarm(id, formData);
      toast.success("Farm details updated successfully! 🚜");
      navigate("/farms");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update farm");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-800">✏️ Edit Farm Details</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Update your farm plot metadata.</p>
      </div>

      <FarmForm
        initialData={farm}
        onSubmit={handleUpdateFarm}
        loading={saving}
      />
    </div>
  );
}

export default EditFarm;
