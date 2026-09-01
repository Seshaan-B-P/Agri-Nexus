import API from "./api";

export const predictYield = async (yieldData) => {
  const response = await API.post("/yield/predict", yieldData);
  return response.data;
};
