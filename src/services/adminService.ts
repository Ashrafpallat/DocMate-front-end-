import { Doctor } from "../Interfaces/doctorInterface";
import { Patient } from "../Interfaces/patientInterface";
import Prescription from "../Interfaces/prescriptionInterface";
import api from "./axiosInstance";

export const adminLogin = async (email: string, password: string) => {
    try {
        const response = await api.post('/admin/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};
export const getPendingVerifications = async () => {
    try {
        const response = await api.get('/admin/pending-verifications');
        return response.data
    } catch (error) {
        console.log('error fetching pendingverification', error);
        throw error
    }
}
export const verifyDoctor = async (selectedDoctorId: string) => {
    try {
        const response = await api.post(`/admin/pending-verifications/${selectedDoctorId}`);
        return response.data;
    } catch (error) {
        console.error('Error verifying doctor:', error);
        throw error;
    }
};
export const updateDoctorStatus = async (doctorId: string, newStatus: string) => {
    try {
      const response = await api.put(`/admin/doctors/${doctorId}/status`, { status: newStatus });
      return response.data;
    } catch (error) {
      console.error('Error updating doctor status:', error);
      throw error;
    }
  };
  export const updatePatientStatus = async (patientId: string, newStatus: string) => {
    try {
      const response = await api.put(`/admin/patient/${patientId}/status`, { status: newStatus });
      return response.data
    } catch (error) {
      console.error('Error updating patient status:', error);
      throw error;
    }
  };
  export const getDoctors = async (): Promise<Doctor[]> => {
    try {
      const response = await api.get<Doctor[]>('/admin/doctors');
      return response.data; // Return the list of doctors from the response
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  };
  export const getPatients = async (): Promise<Patient[]> => {
    try {
      const response = await api.get<Patient[]>('/admin/patients');
      return response.data; // Return the list of patients from the response
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  };
  export const getAllPrescriptions = async (): Promise<Prescription[]> => {
    try {
      const response = await api.get<Prescription[]>('/admin/getAllPrescriptions');
      return response.data; // Return the list of patients from the response
    } catch (error) {
      console.error('Error fetching getAllPrescirption api:', error);
      throw error;
    }
  };