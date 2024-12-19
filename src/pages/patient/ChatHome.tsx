import React, { useEffect, useState } from 'react';
import PatientHeader from '../../components/patient/PatientHeader';
import { getPatientHistory } from '../../services/patientServices';
import ChatList from '../../components/ChatList';
import ChatInterface from '../../components/ChatInterface';

function ChatHome() {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getPatientHistory();
        if (response?.data) {
          // Map the response to the required format
          const chatList = response.data.map((item: any) => ({
            _id: item.doctorId._id,
            name: item.doctorId.name,
            profilePhoto: item.doctorId.profilePhoto,
            lastMessage: "Last message content here", // Replace with actual message when available
          }));
          setChats(chatList);
        }
      } catch (err: any) {
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
