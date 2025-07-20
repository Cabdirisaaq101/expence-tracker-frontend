// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-backend-production-07c9.up.railway.app", // ✅ Railway backend live URL
  withCredentials: true,
});

export default api;
