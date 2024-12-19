import { DefaultToken } from "../Interfaces/defaultTokenInterface";
import { DoctorSignupData } from "../Interfaces/doctorSignupInterface";
import api from "./axiosInstance";

export const doctorSignup = async (data: DoctorSignupData) => {
  try {
    const response = await api.post('/doctor/signup', data)
    return response
  } catch (error) {
    console.log('error doctor singup api', error);
  }
}
export const doctorLoginApi = async (email: string, password: string) => {
  try {
    const response = await api.post('/doctor/login', { email, password });
    return response.data
  } catch (error) {
    console.log('error login post api', error);
  }
}
export const googleAuthApi = async (name: string, email: string) => {
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
export const getHistory = async () => {
  try {
    const response = await api.get(`/doctor/history`);
    return response.data
  } catch (error) {
    console.log('error fetching history', error);
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
export const getProfile = async () => {
  try {
    const response = await api.get('/doctor/profile');
    return response.data
  } catch (error) {
    console.log('error fetching doctor profile api', error);
  }
}
export const updateDoctorProfile = async (data: FormData) => {
  try {
    const response = await api.post('/doctor/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return response
  } catch (error) {
    console.log('error updating doctor profile api', error);
  }
}
export const submitVerification = async (submissionData: FormData) => {
  try {
    const response = await api.post('/doctor/verify', submissionData,);
    return response
  } catch (error) {
    console.log('error submiting verification api', error);
  }
}
export const doctorLogout = async () => {
  try {
    const response = await api.post('/doctor/logout', {});
    return response
  } catch (error) {
    console.log('error doctor logout api', error);
  }
}