import toast from "react-hot-toast";
import api from "./axiosInstance";


export const patientSigupApi = async (formData: {
  name: string; email: string;
  password: string; confirmPassword: string; location: string; age: string; gender: string;
}) => {
  try {
    const response = await api.post('/patient/signup', formData)
    return response
  } catch (error: any) {
    toast.error(error.response.data.message)
    console.log('error singup patient api', error);
  }
}
export const patientLoginApi = async (email: string, password: string) => {
  try {
    const response = await api.post("/patient/login", { email, password });
    return response
  } catch (error: any) {
    toast(error.response.data.message, {icon:'☹️'})
    console.log('error patient login api', error);
  }
}
export const patientGoogleAutApi = async (name: string, email: string) => {
  try {
    const response = await api.post("/patient/google-auth", {
      name,
      email,
    });
    return response
  } catch (error: any) {
    toast.error(error.response.data.message)
    console.log('error google auth api', error);
  }
}
export const getNearbyDoctors = async (
  latitude: string,
  longitude: string,
  page: number,
  limit: number
) => {
  const response = await api.get("/patient/nearby-doctors", {
    params: { lat: latitude, lng: longitude, page, limit },
  });
  return response.data;
};
export const getPendingAppointments = async () => {
  try {
    const response = await api.get('/patient/pending-appointments');
    return response
  } catch (error: any) {
    toast.error(error.response.data.message)
    console.log('error fetching pendin appointments api', error);
  }
}
export const getPatientProfile = async () => {
  try {
    const response = await api.get('/patient/profile');
    return response.data
  } catch (error: any) {
    toast.error(error.response.data.message)
    console.log('error fetching patient profile api', error);
  }
}
export const updatePatientProfile = async (submissionData: FormData) => {
  try {
    const response = await api.post('/patient/profile', submissionData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return response
  } catch (error: any) {
    toast.error(error.response.data.message)
    console.log('error updating patient profile api', error);
  }
}
export const reserveSlotApi = async (doctorId: string, day: string, slotIndex: number) => {
  try {
    const response = await api.post('/patient/book-slot', { doctorId, day, slotIndex })
    return response
  } catch (error: any) {
    toast.error(error.response.data.message)
    console.log('error booking slot api', error);
  }
}
export const getSlotsByDoctorId = async (doctorId: string) => {
  try {
    const response = await api.get(`/doctor/${doctorId}/slots`)
    return response.data
  } catch (error: any) {
    toast.error(error.response.data.message)
    console.log('error fetching doctor slots api', error);
  }
}
export const getDoctorReviews = async (doctorId: string) => {
  try {
    const response = await api.get('/doctor/reviews', { params: { doctorId } });
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message)
    console.log('error fetching doctor review api', error);
  }
};
export const createPaymentSession = async (doctorId: string, amount: number, day: string, slotIndex: number) => {
  try {
    const paymentResponse = await api.post('/patient/payment/create-session', { doctorId, amount, day, slotIndex })
    return paymentResponse
  } catch (error: any) {
    toast.error(error.response.data.message)
    console.log('error creating payment session api', error);
  }
}
export const addReview = async (doctorId:string, rating:number, reviewText: string) => {
  try {
    const response = api.post('/patient/add-review', { doctorId, rating, reviewText })
    return response
  } catch (error: any) {
    toast.error(error.response.data.message)
    console.log('error adding review api',error);
  }
}
export const getPatientHistory = async()=>{
  try {
    const response = await api.get('/patient/history');
    return response
  } catch (error: any) {
    toast.error(error.response.data.message)
    console.log('error fetching patient history api', error);
  }
}
export const patientLogout = async()=>{
  try {
   const response =  await api.post("/patient/logout",{}) 
   return response
  } catch (error: any) {
    toast.error(error.response.data.message)
    console.log('error patient logout api',error);
  }
}