import  { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PatientHeader from '../components/patient/PatientHeader';
import DoctorHeader from '../components/doctor/DoctorHeader';
import ChatList from '../components/ChatList';
import ChatInterface from '../components/ChatInterface';
import api from '../services/axiosInstance';

function ChatHome() {
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUesr] = useState<any | null>(null);
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true)
        const response = await api.get('/chat/allChats');
        console.log('all chats response.data', response.data);

        if (response?.data) {
          const chatList = response.data.map((item: any) => ({
            _id: item.doctor._id || item.patient._id,
            name: item.doctor.name || item.patient.name,
            profilePhoto: item.doctor.profilePhoto || item.patient.profilePhoto,
            lastMessage: item.lastMessage|| 'last message', // Replace with actual message when available
          }));
          setChatUsers(chatList);
          setLoading(false)
        }
      } catch (err: any) {
        console.error(err);
      }finally{
        setLoading(false)
      }
    };

    fetchChats();
  }, []);

  const handleSelectChat = (chatUser: any) => {
    setSelectedUesr(chatUser);
  };

  // Render the appropriate header based on the route
  const isDoctorRoute = location.pathname.includes('/doctor');

  return (
    <div>
      {isDoctorRoute ? <DoctorHeader /> : <PatientHeader />}
      <div className="bg-[#fff] min-h-screen p-2 pt-24 flex">
          <ChatList chatUsers={chatUsers} onSelectChat={handleSelectChat} />
        <ChatInterface selectedUser={selectedUser} />
      </div>
    </div>
  );
}

export default ChatHome;
