import API from "./api";

export const predictDisease = async (formData) => {
    const response = await API.post("/disease/predict", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getDiseaseHistory = async () => {
    const response = await API.get("/disease/history");
    return response.data;
};

export const getPrediction = async (id) => {
    const response = await API.get(`/disease/${id}`);
    return response.data;
};

export const deletePrediction = async (id) => {
    const response = await API.delete(`/disease/${id}`);
    return response.data;
};