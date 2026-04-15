import axios from "axios";

//.port=8090
const API_URL = "http://localhost:8090/api/accounts";


// FETCH ALL ACCOUNTS

export const getAccounts = () => axios.get(API_URL);


//  CREATE NEW ACCOUNT
//   @param {Object} accountData - { accountHolderName: string, balance: number }
 
export const addAccount = (accountData) => axios.post(API_URL, accountData);


// DEPOSIT MONEY
 
export const deposit = (id, amount) => 
  axios.put(`${API_URL}/${id}/deposit`, { amount });


// WITHDRAW MONEY
 
export const withdraw = (id, amount) => 
  axios.put(`${API_URL}/${id}/withdraw`, { amount });


// DELETE ACCOUNT
 
export const deleteAccount = (id) => axios.delete(`${API_URL}/${id}`);


//  NEW: FETCH TRANSACTION HISTORY
//  This connects to the new 'transactions' table logic we discussed.

export const getTransactionHistory = (id) => 
  axios.get(`${API_URL}/${id}/transactions`);