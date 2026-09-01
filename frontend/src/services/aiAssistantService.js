import API from "./api";

export const sendMessage = async (data) => {
  const response = await API.post("/ai-assistant/chat", data);
  return response.data;
};

export const getChatHistory = async (sessionId) => {
  const response = await API.get(`/ai-assistant/history/${sessionId}`);
  return response.data;
};

export const clearChatHistory = async (sessionId) => {
  const response = await API.delete(`/ai-assistant/history/${sessionId}`);
  return response.data;
};
