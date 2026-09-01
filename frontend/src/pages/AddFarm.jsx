import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FarmForm from "../components/FarmForm";
import { addFarm } from "../services/farmService";

function AddFarm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddFarm = async (formData) => {
    try {
      setLoading(true);
      await addFarm(formData);
      toast.success("Farm added successfully! 🚜");
      navigate("/farms");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add farm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-700">🚜 Add New Farm</h1>

        <p className="text-gray-500 mt-2">Enter your farm details below.</p>
      </div>

      <FarmForm onSubmit={handleAddFarm} loading={loading} />
    </div>
  );
}

export default AddFarm;
