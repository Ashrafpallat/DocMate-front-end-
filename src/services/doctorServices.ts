import { DefaultToken } from "../Interfaces/defaultTokenInterface";
import api from "./axiosInstance";

export const doctorLoginApi = async (email: string, password: string)=>{
    try {
        const response = await api.post('/doctor/login', { email, password });
        return response.data
    } catch (error) {
        console.log('error login post api',error);
    }
}
export const googleAuthApi = async(name: string, email: string)=>{
    try {
        const response = await api.post('/doctor/google-auth', { name, email })
        return response.data
    } catch (error) {
        console.log('error google login api', error);
    }
}
export const getDoctorSlots = async (): Promise<DefaultToken[]> => {
    try {
      const response = await api.get<DefaultToken[]>('/doctor/doctor/slotes');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor slots:', error);
      throw error;
    }
  };
  interface PrescriptionData {
    symptoms: string;
    diagnosis: string;
    medications: string;
  }
  export const createPrescription = async (formData: PrescriptionData, patientId: string) => {
  try {
    const response = await api.post(
      '/doctor/prescription',
      { ...formData, patientId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};
export const getHistory = async()=>{
    try {
        const response = await api.get(`/doctor/history`);
        return response.data
    } catch (error) {
        console.log('error fetching history',error);
    }
}
interface SaveSlotsRequest {
    selectedDay: string;
    slots: {
      start: string;
      end: string;
    }[];
  }  
  export const saveDoctorSlots = async (requestData: SaveSlotsRequest) => {
    try {
      const response = await api.post('/doctor/save-slots', requestData);
      return response;
    } catch (error) {
      console.error('Error saving slots:', error);
      throw error;
    }
  };
  export const getProfile = async ()=>{
    try {
      const response = await api.get('/doctor/profile');
        return response.data   
    } catch (error) {
        console.log('error fetching doctor profile api', error);
    }
  }