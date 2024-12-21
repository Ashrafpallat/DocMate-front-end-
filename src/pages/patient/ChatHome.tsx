import React, { useEffect, useState } from 'react';
import PatientHeader from '../../components/patient/PatientHeader';
import { getPatientHistory } from '../../services/patientServices';
import ChatList from '../../components/ChatList';
import ChatInterface from '../../components/ChatInterface';
import api from '../../services/axiosInstance';
import toast from 'react-hot-toast';

function ChatHome() {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // const response = await getPatientHistory();
        const response = await api.get('/chat/allChats')
        console.log('all chats response.data',response.data);
        
        if (response?.data) {
          const chatList = response.data.map((item: any) => ({
            _id: item.doctor._id || item.patient._id,
            name: item.doctor.name || item.patient.name,
            profilePhoto: item.doctor.profilePhoto || item.patient.profilePhoto,
            lastMessage: "Last message content here", // Replace with actual message when available
          }));
          setChats(chatList);
        }
      } catch (err: any) {
        // toast.error(err.response.data.message)
        console.error(err);
      }
    };

    fetchChats();
  }, []);

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
  };

  return (
    <div>
      <PatientHeader />
      <div className="bg-[#fff] min-h-screen p-6 pt-28 flex">
        <ChatList chats={chats} onSelectChat={handleSelectChat} />
        <ChatInterface selectedChat={selectedChat} />
      </div>
    </div>
  );
}

export default ChatHome;
