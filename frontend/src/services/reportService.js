import API from "./api";

export const getReportAnalytics = async () => {
  const response = await API.get("/reports/analytics");
  return response.data;
};
