import API from "./api";

export const getCropRecommendation = async (recommendationData) => {
  const response = await API.post("/recommendations/recommend", recommendationData);
  return response.data;
};
