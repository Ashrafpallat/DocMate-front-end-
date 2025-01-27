// src/services/axiosInstance.ts
import axios, { HttpStatusCode } from "axios";
import store, { } from '../redux/store'
import {  logoutPatient } from "../redux/patientSlice";
import { logoutDoctor } from "../redux/doctorSlice";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${backendUrl}/api`, 
  withCredentials: true, 
});

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => {
    // Return the response if it's successful
    return response;
  },
  (error) => {
    // Check if the error response is a 401 (Unauthorized)
    if (error.response && error.response.status === HttpStatusCode.Unauthorized || error.response.status === HttpStatusCode.Forbidden ) {
      // Dispatch a Redux action to log out the user and clear their data
      const patient = localStorage.getItem('patient');
      const doctor = localStorage.getItem('user');

      if (patient) {
        store.dispatch(logoutPatient());
      } else if (doctor) {
        store.dispatch(logoutDoctor());
      } 
      if(error.response.status === 403){
        toast.error('Your account has been blocked')
      }
      if(error.response.status === 401){
        toast('Unautharised',{icon:'🙅🏻'})
      }
    }

    // Return a rejected promise to propagate the error to catch blocks
    return Promise.reject(error);
  }
);
 
export default api;
