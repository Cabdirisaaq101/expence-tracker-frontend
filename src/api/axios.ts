// src/api/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "https://railway.com/project/b607a779-3504-46c4-a524-9980a9e2dfa3/service/9cd080ff-3b61-4236-a7a7-1f9b60ef15ad?environmentId=b443074b-cb95-4650-a96a-c3187f067570",
  withCredentials: true,
});

export default instance;
