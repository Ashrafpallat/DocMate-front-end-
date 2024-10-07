// src/services/axiosInstance.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", 
  withCredentials: true, // This allows cookies (like JWT tokens) to be sent with requests
});

export default api;
