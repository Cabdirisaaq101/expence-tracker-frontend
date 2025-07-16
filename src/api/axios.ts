// src/api/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "https://expense-api.up.railway.app",
  withCredentials: true,
});

export default instance;
