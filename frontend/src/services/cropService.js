import API from "./api";

export const getCrops = async () => {
  const res = await API.get("/crops");
  return res.data;
};

export const getCrop = async (id) => {
  const res = await API.get(`/crops/${id}`);
  return res.data;
};

export const addCrop = async (cropData) => {
  const res = await API.post("/crops", cropData);
  return res.data;
};

export const updateCrop = async (id, cropData) => {
  const res = await API.put(`/crops/${id}`, cropData);
  return res.data;
};

export const deleteCrop = async (id) => {
  const res = await API.delete(`/crops/${id}`);
  return res.data;
};
