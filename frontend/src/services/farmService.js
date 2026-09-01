import API from "./api";

export const getFarms = async () => {
  const res = await API.get("/farms");
  return res.data;
};

export const getFarm = async (id) => {
  const res = await API.get(`/farms/${id}`);
  return res.data;
};

export const addFarm = async (farmData) => {
  const res = await API.post("/farms", farmData);
  return res.data;
};

export const updateFarm = async (id, farmData) => {
  const res = await API.put(`/farms/${id}`, farmData);
  return res.data;
};

export const deleteFarm = async (id) => {
  const res = await API.delete(`/farms/${id}`);
  return res.data;
};
