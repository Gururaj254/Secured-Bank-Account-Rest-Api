// src/api/axiosConfig.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8090", // Your Spring Boot Port
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;