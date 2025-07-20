import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-backend-production-07c9.up.railway.app",
  withCredentials: true,
});

export default api;
