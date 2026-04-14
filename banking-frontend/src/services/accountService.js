import API from "../api/axiosConfig";

// Create account
export const createAccount = (data) => API.post("/accounts", data);

// Get all accounts
export const getAccounts = () => API.get("/api/accounts")

// Deposit
export const deposit = (id, amount) =>
  API.put(`/accounts/${id}/deposit`, { amount });

// Withdraw
export const withdraw = (id, amount) =>
  API.put(`/accounts/${id}/withdraw`, { amount });

// Delete account
export const deleteAccount = (id) =>
  API.delete(`/accounts/${id}`);