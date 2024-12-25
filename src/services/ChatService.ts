import toast from "react-hot-toast";
import api from "./axiosInstance";

export const getAllChats = async () => {
    try {
        const response = await api.get('/chat/allChats');
        return response
    } catch (error: any) {
        toast.error(error.response.data.message)
        console.log('error fetching getAllChats api', error);
    }
}
export const fetchOrCreateChat = async (selectedUserId: string) => {
    try {
        const response = await api.post(`/chat/fetchOrCreateChat`, { user1: selectedUserId });
        return response
    } catch (error) {
        console.log('error fetchOrCreatChat api', error);

    }
}
export const getMyMessages = async (chatId: string) => {
    try {
        const getMessages = await api.get(`/chat/${chatId}`);
        return getMessages
    } catch (error) {
        console.log('error getMessages api', error);
    }
}
export const sendMyMessage = async(chatId: any, receiver:any, content:any)=>{
    try {
      const response = await api.post('/chat/send-message', { chatId, receiver, content });
        return response
    } catch (error) {
        console.log('error sendMessage api',error);
    }
}