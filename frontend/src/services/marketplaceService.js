import API from "./api";

export const getListings = async () => {
  const response = await API.get("/marketplace");
  return response.data;
};

export const createListing = async (listingData) => {
  const response = await API.post("/marketplace", listingData);
  return response.data;
};

export const deleteListing = async (id) => {
  const response = await API.delete(`/marketplace/${id}`);
  return response.data;
};
