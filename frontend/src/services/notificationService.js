import API from "./api";

export const getNotifications = async () => {
  const response = await API.get("/notifications");
  return response.data;
};

export const getUnreadNotifications = async () => {
  const response = await API.get("/notifications/unread");
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await API.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await API.put("/notifications/read-all");
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await API.delete(`/notifications/${id}`);
  return response.data;
};

export const deleteAllNotifications = async () => {
  const response = await API.delete("/notifications");
  return response.data;
};
