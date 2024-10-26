// src/services/axiosInstance.ts
import axios from "axios";
import store, { } from '../redux/store'
import {  logoutPatient } from "../redux/patientSlice";
import { logoutDoctor } from "../redux/doctorSlice";
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // This allows cookies (like JWT tokens) to be sent with requests
});

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => {
    // Return the response if it's successful
    return response;
  },
  (error) => {
    // Check if the error response is a 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Dispatch a Redux action to log out the user and clear their data
      const patient = localStorage.getItem('patient');
      const doctor = localStorage.getItem('user');

      if (patient) {
        store.dispatch(logoutPatient());
      } else if (doctor) {
        store.dispatch(logoutDoctor());
      }
      // Optionally redirect the user to the login page
    }

    // Return a rejected promise to propagate the error to catch blocks
    return Promise.reject(error);
  }
);

export default api;
