import API from "./api";

export const getExpenses = async (params = {}) => {
  const response = await API.get("/expenses", { params });
  return response.data;
};

export const getExpenseById = async (id) => {
  const response = await API.get(`/expenses/${id}`);
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await API.post("/expenses", expenseData);
  return response.data;
};

export const updateExpense = async (id, expenseData) => {
  const response = await API.put(`/expenses/${id}`, expenseData);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await API.delete(`/expenses/${id}`);
  return response.data;
};
