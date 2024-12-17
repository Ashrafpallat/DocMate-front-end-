import api from "./axiosInstance";

export const patientLoginApi = async(email: string, password: string)=>{
    try {
      const response = await api.post("/patient/login", { email, password });
        return response
    } catch (error) {
        
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
  export const getPendingAppointments = async()=>{
    try {
        const response = await api.get('/patient/pending-appointments');
        return response
    } catch (error) {
        console.log('error fetching pendin appointments api',error);
    }
  }