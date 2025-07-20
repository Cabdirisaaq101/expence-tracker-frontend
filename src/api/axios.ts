import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-backend-production-07c9.up.railway.app/api",
  withCredentials: true, // Optional if you're using cookies or auth
});

export default api;
