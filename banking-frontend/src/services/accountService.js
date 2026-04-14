import axios from "axios";

// Make sure this matches your Spring Boot port
const API_URL = "http://localhost:8090/api/accounts";

export const getAccounts = () => axios.get(API_URL);

// --- ADDED THIS FUNCTION ---
// This handles creating a new account. 
// ID is not required because MySQL handles auto-increment.
export const addAccount = (accountData) => {
  return axios.post(`${API_URL}`, accountData);
};

export const deposit = (id, amount) => {
  // Wrapping 'amount' in an object { amount: value } to match your Java Map
  return axios.put(`${API_URL}/${id}/deposit`, { amount });
};

export const withdraw = (id, amount) => {
  // Wrapping 'amount' in an object { amount: value }
  return axios.put(`${API_URL}/${id}/withdraw`, { amount });
};

export const deleteAccount = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};