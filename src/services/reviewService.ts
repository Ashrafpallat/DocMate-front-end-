import api from "./axiosInstance";

// Fetch reviews API call
export const getDoctorReviews = async () => {
    try {
        const response = await api.get('/doctor/reviews');
        return response.data; // Return only the data
    } catch (error) {
        console.error('Error frm review service:', error);
        throw error; // Throw error to be handled by the caller
    }
};
